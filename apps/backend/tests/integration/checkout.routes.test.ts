import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("Checkout Routes", () => {
  const userId = "test-checkout-user";

  beforeEach(async () => {
    // clear cart
    await request(app).delete("/api/cart").set("user-id", userId);
  });

  describe("POST /api/checkout", () => {
    it("should checkout successfully without discount code", async () => {
      // add items to cart
      await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p1", quantity: 1 });

      // checkout
      const response = await request(app)
        .post("/api/checkout")
        .set("user-id", userId)
        .send({})
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Order placed successfully");
      expect(response.body.data.order).toBeDefined();
      expect(response.body.data.order.items).toHaveLength(1);
      expect(response.body.data.order.status).toBe("completed");
      expect(response.body.data.order.discount).toBe(0);
      expect(response.body.data.order.total).toBeGreaterThan(0);
    });

    it("should fail checkout with empty cart", async () => {
      const response = await request(app)
        .post("/api/checkout")
        .set("user-id", userId)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Cart is empty");
    });

    it("should apply valid discount code", async () => {
      // create 5 orders to generate discount code
      for (let i = 0; i < 5; i++) {
        const tempUser = `temp-user-${i}`;
        await request(app)
          .post("/api/cart/items")
          .set("user-id", tempUser)
          .send({ productId: "p2", quantity: 1 });

        await request(app)
          .post("/api/checkout")
          .set("user-id", tempUser)
          .send({});
      }

      // get analytics to find discount code
      const analyticsRes = await request(app)
        .get("/api/admin/analytics")
        .expect(200);

      const discountCodes = analyticsRes.body.data.discountCodes.codes;
      const availableCode = discountCodes.find((dc: any) => !dc.isUsed);

      if (availableCode) {
        // add items for new user
        await request(app)
          .post("/api/cart/items")
          .set("user-id", userId)
          .send({ productId: "p1", quantity: 1 });

        // checkout with discount
        const response = await request(app)
          .post("/api/checkout")
          .set("user-id", userId)
          .send({ discountCode: availableCode.code })
          .expect(200);

        expect(response.body.data.order.discount).toBeGreaterThan(0);
        expect(response.body.data.order.discountCode).toBe(availableCode.code);
        expect(response.body.data.order.total).toBeLessThan(
          response.body.data.order.subtotal
        );
      }
    });

    it("should fail with invalid discount code", async () => {
      await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p1", quantity: 1 });

      const response = await request(app)
        .post("/api/checkout")
        .set("user-id", userId)
        .send({ discountCode: "INVALID-CODE" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "Invalid or already used discount code"
      );
    });

    it("should clear cart after successful checkout", async () => {
      await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p1", quantity: 1 });

      await request(app)
        .post("/api/checkout")
        .set("user-id", userId)
        .send({})
        .expect(200);

      // check cart is empty
      const cartRes = await request(app)
        .get("/api/cart")
        .set("user-id", userId);

      expect(cartRes.body.data.cart.items).toHaveLength(0);
    });
  });

  describe("GET /api/checkout/orders", () => {
    it("should return user orders", async () => {
      // create an order
      await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p1", quantity: 1 });

      await request(app).post("/api/checkout").set("user-id", userId).send({});

      // get orders
      const response = await request(app)
        .get("/api/checkout/orders")
        .set("user-id", userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toBeDefined();
      expect(response.body.data.count).toBeGreaterThan(0);
    });
  });

  describe("GET /api/checkout/orders/:orderId", () => {
    it("should return specific order", async () => {
      // create an order
      await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p1", quantity: 1 });

      const checkoutRes = await request(app)
        .post("/api/checkout")
        .set("user-id", userId)
        .send({});

      const orderId = checkoutRes.body.data.order.id;

      // get specific order
      const response = await request(app)
        .get(`/api/checkout/orders/${orderId}`)
        .set("user-id", userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.order.id).toBe(orderId);
    });

    it("should return 404 for non-existent order", async () => {
      const response = await request(app)
        .get("/api/checkout/orders/invalid-order-id")
        .set("user-id", userId)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Order not found");
    });
  });
});
