const express = require("express");
const Stripe = require("stripe");
const MerchOrder = require("../models/MerchOrder");
const { merchOrderLimiter } = require("../middleware/rateLimit");
const { sanitizeText } = require("../utils/sanitize");
const { sendMerchOrderConfirmation } = require("../utils/mailer");

const router = express.Router();

const MERCH_CATALOG = {
  "silver-tee": {
    name: "Silver Pulse T-Shirt",
    price: 35,
    hasSize: true,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=900",
  },
  "silver-mobile-cover": {
    name: "Neon Wave Mobile Cover",
    price: 24,
    hasSize: false,
    image:
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=900",
  },
  "silver-cap": {
    name: "Midnight DJ Cap",
    price: 29,
    hasSize: false,
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=900",
  },
  "silver-hoodie": {
    name: "Afterhours Hoodie",
    price: 62,
    hasSize: true,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=900",
  },
};

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

router.post("/checkout-session", merchOrderLimiter, async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ message: "Stripe is not configured" });
    }

    const itemId = sanitizeText(req.body.itemId, 60);
    const quantity = Math.min(10, Math.max(1, Number(req.body.quantity || 1)));
    const size = sanitizeText(req.body.size || "N/A", 10).toUpperCase();
    const catalogItem = MERCH_CATALOG[itemId];

    if (!catalogItem) {
      return res.status(400).json({ message: "Invalid merch item" });
    }

    const origin =
      sanitizeText(req.body.origin || "", 200) ||
      sanitizeText(req.headers.origin || "", 200);
    const frontendUrl = (process.env.FRONTEND_URL || origin || "http://localhost:5173").replace(
      /\/$/,
      ""
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(catalogItem.price * 100),
            product_data: {
              name: catalogItem.name,
              images: catalogItem.image ? [catalogItem.image] : undefined,
            },
          },
        },
      ],
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "NZ"],
      },
      success_url: `${frontendUrl}/fans?checkout=success`,
      cancel_url: `${frontendUrl}/fans?checkout=cancelled`,
      metadata: {
        itemId,
        size: catalogItem.hasSize ? size : "N/A",
      },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    return res.status(500).json({ message: "Could not start Stripe checkout" });
  }
});

router.post("/orders", merchOrderLimiter, async (req, res) => {
  try {
    const itemId = sanitizeText(req.body.itemId, 60);
    const itemName = sanitizeText(req.body.itemName, 120);
    const customerName = sanitizeText(req.body.customerName, 80);
    const email = sanitizeText(req.body.email, 120).toLowerCase();
    const phone = sanitizeText(req.body.phone || "", 40);
    const address = sanitizeText(req.body.address, 300);
    const note = sanitizeText(req.body.note || "", 500);
    const quantity = Number(req.body.quantity || 1);
    const unitPrice = Number(req.body.unitPrice || 0);
    const size = sanitizeText(req.body.size || "N/A", 10).toUpperCase();

    if (!itemId || !itemName || !customerName || !email || !address) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (phone && !/^[+()\d\s-]{7,20}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone format" });
    }

    const order = await MerchOrder.create({
      itemId,
      itemName,
      unitPrice,
      quantity,
      size,
      customerName,
      email,
      phone,
      address,
      note,
    });

    try {
      await sendMerchOrderConfirmation({ order });
    } catch (mailError) {
      console.warn("Merch confirmation email failed:", mailError.message);
    }

    res.status(201).json({
      message: "Order submitted",
      orderId: order._id,
      status: order.status,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Invalid order data" });
  }
});

module.exports = router;
