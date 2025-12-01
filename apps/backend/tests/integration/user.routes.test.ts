import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("User Routes", () => {
  describe("GET /api/users", () => {
    it("should return 200 and list of users", async () => {
      const response = await request(app)
        .get("/api/users")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("users");
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return 200 and user details for valid id", async () => {
      const userId = "1";
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("id", userId);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id", userId);
    });

    it("should return 404 for non-existent user", async () => {
      const userId = "non-existent-id";
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toHaveProperty("message", "User not found");
      expect(response.body).toHaveProperty("id", userId);
    });

    it("should handle special characters in user id", async () => {
      const userId = "2";
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.user).toBeDefined();
    });
  });

  describe("GET /api/health", () => {
    it("should return 200 and health status", async () => {
      const response = await request(app)
        .get("/api/health")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("timestamp");
    });
  });
});
