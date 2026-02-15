const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const createApp = require("../src/app");
const MerchOrder = require("../src/models/MerchOrder");

jest.setTimeout(180000);

describe("POST /api/merch/orders", () => {
  let mongod;
  const app = createApp();

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  beforeEach(async () => {
    await MerchOrder.deleteMany({});
  });

  it("creates an order and sanitizes fields", async () => {
    const payload = {
      itemId: "silver-tee",
      itemName: "Silver Tee<script>",
      unitPrice: 35,
      quantity: 2,
      size: "M",
      customerName: "  Alice <b>Fan</b>  ",
      email: "alice@example.com",
      phone: "+1 (202) 555-0199",
      address: "  50 Main Street, Brooklyn  ",
      note: "Deliver after 6pm",
    };

    const res = await request(app).post("/api/merch/orders").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.orderId).toBeTruthy();

    const saved = await MerchOrder.findById(res.body.orderId).lean();
    expect(saved).toBeTruthy();
    expect(saved.itemName).toBe("Silver Teescript");
    expect(saved.customerName).toBe("Alice bFan/b");
    expect(saved.address).toBe("50 Main Street, Brooklyn");
  });

  it("rejects invalid email", async () => {
    const res = await request(app).post("/api/merch/orders").send({
      itemId: "silver-tee",
      itemName: "Silver Tee",
      unitPrice: 35,
      quantity: 1,
      size: "M",
      customerName: "Bob",
      email: "not-an-email",
      address: "100 1st Avenue, New York",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email/i);
  });
});
