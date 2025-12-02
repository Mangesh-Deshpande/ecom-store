import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("Cart Routes", () => {
  const userId = "test-user-1";

  beforeEach(async () => {
    // clear cart before each test
    await request(app).delete("/api/cart").set("user-id", userId);
  });

  describe("GET /api/cart", () => {
    it("should return empty cart for new user", async () => {
      const response = await request(app)
        .get("/api/cart")
        .set("user-id", userId)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cart.items).toEqual([]);
      expect(response.body.data.total).toBe(0);
      expect(response.body.data.itemCount).toBe(0);
    });
  });

  describe("POST /api/cart/items", () => {
    it("should add item to cart successfully", async () => {
      const response = await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({
          productId: "p1",
          quantity: 2,
        })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Item added to cart");
      expect(response.body.data.cart.items).toHaveLength(1);
      expect(response.body.data.cart.items[0].productId).toBe("p1");
      expect(response.body.data.cart.items[0].quantity).toBe(2);
      expect(response.body.data.total).toBeGreaterThan(0);
    });

    it("should return 404 for non-existent product", async () => {
      const response = await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({
          productId: "invalid-product",
          quantity: 1,
        })
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Product not found");
    });

    it("should return 400 for insufficient stock", async () => {
      const response = await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({
          productId: "p1",
          quantity: 1000,
        })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Insufficient stock");
    });

    it("should increment quantity if product already in cart", async () => {
      // add item first time
      await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p1", quantity: 2 });

      // add same item again
      const response = await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p1", quantity: 1 })
        .expect(200);

      expect(response.body.data.cart.items).toHaveLength(1);
      expect(response.body.data.cart.items[0].quantity).toBe(3);
    });
  });

  describe("PUT /api/cart/items/:productId", () => {
    beforeEach(async () => {
      // add item to cart
      await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p1", quantity: 2 });
    });

    it("should update item quantity successfully", async () => {
      const response = await request(app)
        .put("/api/cart/items/p1")
        .set("user-id", userId)
        .send({ quantity: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cart.items[0].quantity).toBe(5);
    });

    it("should remove item when quantity is 0", async () => {
      const response = await request(app)
        .put("/api/cart/items/p1")
        .set("user-id", userId)
        .send({ quantity: 0 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cart.items).toHaveLength(0);
    });

    it("should return 400 for negative quantity", async () => {
      const response = await request(app)
        .put("/api/cart/items/p1")
        .set("user-id", userId)
        .send({ quantity: -1 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/cart/items/:productId", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p1", quantity: 2 });
    });

    it("should remove item from cart", async () => {
      const response = await request(app)
        .delete("/api/cart/items/p1")
        .set("user-id", userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Item removed from cart");
      expect(response.body.data.cart.items).toHaveLength(0);
    });
  });

  describe("DELETE /api/cart", () => {
    it("should clear entire cart", async () => {
      // add multiple items
      await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p1", quantity: 2 });

      await request(app)
        .post("/api/cart/items")
        .set("user-id", userId)
        .send({ productId: "p2", quantity: 1 });

      // clear cart
      const response = await request(app)
        .delete("/api/cart")
        .set("user-id", userId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Cart cleared");

      // check cart is empty
      const getResponse = await request(app)
        .get("/api/cart")
        .set("user-id", userId);

      expect(getResponse.body.data.cart.items).toHaveLength(0);
    });
  });
});
