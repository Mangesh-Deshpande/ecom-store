import { describe, it, expect, beforeEach } from "vitest";
import { UserService } from "../../src/services/user.service";

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe("getAllUsers", () => {
    it("should return an array of users", () => {
      const users = userService.getAllUsers();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThanOrEqual(0);
    });

    it("should return users with correct properties", () => {
      const users = userService.getAllUsers();

      if (users.length > 0) {
        const user = users[0];
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("email");
      }
    });
  });

  describe("getUserById", () => {
    it("should return a user for valid id", () => {
      const userId = "1";
      const user = userService.getUserById(userId);

      expect(user).toBeDefined();
      expect(user).toHaveProperty("id", userId);
    });

    it("should return null for non-existent user", () => {
      const user = userService.getUserById("non-existent-id");

      expect(user).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should create a new user with provided data", () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
      };

      const newUser = userService.createUser(userData);

      expect(newUser).toHaveProperty("id");
      expect(newUser.name).toBe(userData.name);
      expect(newUser.email).toBe(userData.email);
    });

    it("should generate unique ids for users", () => {
      const user1 = userService.createUser({
        name: "User 1",
        email: "user1@test.com",
      });
      const user2 = userService.createUser({
        name: "User 2",
        email: "user2@test.com",
      });

      expect(user1.id).not.toBe(user2.id);
    });
  });
});
