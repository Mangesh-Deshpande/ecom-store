import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("Admin Routes", () => {
  describe("GET /api/admin/analytics", () => {
    it("should return analytics data", async () => {
      const response = await request(app)
        .get("/api/admin/analytics")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveProperty("totalItemsPurchased");
      expect(response.body.data).toHaveProperty("totalPurchaseAmount");
      expect(response.body.data).toHaveProperty("totalDiscountAmount");
      expect(response.body.data).toHaveProperty("orderCount");
      expect(response.body.data).toHaveProperty("discountCodes");
      expect(response.body.data.discountCodes).toHaveProperty("total");
      expect(response.body.data.discountCodes).toHaveProperty("used");
      expect(response.body.data.discountCodes).toHaveProperty("available");
      expect(response.body.data.discountCodes).toHaveProperty("codes");
    });

    it("should calculate next discount correctly", async () => {
      const response = await request(app)
        .get("/api/admin/analytics")
        .expect(200);

      expect(response.body.data).toHaveProperty("nextDiscountAt");
      expect(response.body.data.nextDiscountAt).toBeGreaterThan(0);
      expect(response.body.data.nextDiscountAt).toBeLessThanOrEqual(5);
    });
  });

  describe("POST /api/admin/discount-code", () => {
    it("should generate discount code when condition is met", async () => {
      // first check current order count
      const analyticsRes = await request(app).get("/api/admin/analytics");

      const currentCount = analyticsRes.body.data.orderCount;

      // if not at nth order, create orders to reach it
      const ordersNeeded = 5 - (currentCount % 5);

      if (ordersNeeded > 0 && ordersNeeded < 5) {
        for (let i = 0; i < ordersNeeded; i++) {
          const tempUser = `discount-test-${i}-${Date.now()}`;
          await request(app)
            .post("/api/cart/items")
            .set("user-id", tempUser)
            .send({ productId: "p2", quantity: 1 });

          await request(app)
            .post("/api/checkout")
            .set("user-id", tempUser)
            .send({});
        }

        // generate discount
        const response = await request(app)
          .post("/api/admin/discount-code")
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.discountCode).toBeDefined();
        expect(response.body.data.discountCode.code).toBeDefined();
        expect(response.body.data.discountCode.discountPercentage).toBe(10);
      }
    });

    it("should fail when condition is not met", async () => {
      const analyticsRes = await request(app).get("/api/admin/analytics");

      const currentCount = analyticsRes.body.data.orderCount;

      if (currentCount % 5 !== 0) {
        const response = await request(app)
          .post("/api/admin/discount-code")
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain(
          "Discount codes are generated every"
        );
      }
    });
  });

  describe("GET /api/admin/products", () => {
    it("should return all products", async () => {
      const response = await request(app)
        .get("/api/admin/products")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toBeDefined();
      expect(Array.isArray(response.body.data.products)).toBe(true);
      expect(response.body.data.count).toBeGreaterThan(0);

      // check product structure
      if (response.body.data.products.length > 0) {
        const product = response.body.data.products[0];
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("name");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("stock");
      }
    });
  });

  describe("GET /api/admin/orders", () => {
    it("should return all orders", async () => {
      const response = await request(app).get("/api/admin/orders").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toBeDefined();
      expect(Array.isArray(response.body.data.orders)).toBe(true);
      expect(response.body.data.count).toBeDefined();
    });
  });
});
