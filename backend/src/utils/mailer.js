const nodemailer = require("nodemailer");

const getTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const sendMerchOrderConfirmation = async ({ order }) => {
  const transporter = getTransport();
  if (!transporter) return false;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const adminEmail = process.env.ADMIN_EMAIL;
  const to = [order.email, adminEmail].filter(Boolean).join(",");

  const subject = `Order Confirmation - ${order.itemName}`;
  const text = [
    `Hello ${order.customerName},`,
    "",
    "Your merch order has been received.",
    `Order ID: ${order._id}`,
    `Item: ${order.itemName}`,
    `Quantity: ${order.quantity}`,
    `Size: ${order.size}`,
    `Total: $${(order.unitPrice * order.quantity).toFixed(2)}`,
    "",
    "Thank you for supporting DJ Silver.",
  ].join("\n");

  await transporter.sendMail({ from, to, subject, text });
  return true;
};

module.exports = { sendMerchOrderConfirmation };
