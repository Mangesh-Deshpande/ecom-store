import { describe, it, expect } from "vitest";
import DiscountService from "../../src/services/discount.service";

describe("DiscountService", () => {
  describe("generateDiscountCode", () => {
    it("should generate discount code with correct structure", () => {
      const orderNumber = 5;
      const discountCode = DiscountService.generateDiscountCode(orderNumber);

      expect(discountCode).toBeDefined();
      expect(discountCode.code).toContain("DISCOUNT");
      expect(discountCode.code).toContain(String(orderNumber));
      expect(discountCode.discountPercentage).toBe(10);
      expect(discountCode.isUsed).toBe(false);
      expect(discountCode.generatedForOrder).toBe(orderNumber);
    });

    it("should generate unique codes", () => {
      const code1 = DiscountService.generateDiscountCode(5);
      const code2 = DiscountService.generateDiscountCode(10);

      expect(code1.code).not.toBe(code2.code);
    });
  });

  describe("validateDiscountCode", () => {
    it("should validate existing unused code", () => {
      const generated = DiscountService.generateDiscountCode(5);
      const validated = DiscountService.validateDiscountCode(generated.code);

      expect(validated).toBeDefined();
      expect(validated?.code).toBe(generated.code);
    });

    it("should return null for invalid code", () => {
      const validated = DiscountService.validateDiscountCode("INVALID-CODE");
      expect(validated).toBeNull();
    });

    it("should return null for used code", () => {
      const generated = DiscountService.generateDiscountCode(5);
      DiscountService.markAsUsed(generated.code, "user-123");

      const validated = DiscountService.validateDiscountCode(generated.code);
      expect(validated).toBeNull();
    });
  });

  describe("markAsUsed", () => {
    it("should mark code as used", () => {
      const generated = DiscountService.generateDiscountCode(5);
      const result = DiscountService.markAsUsed(generated.code, "user-123");

      expect(result).toBe(true);

      const codes = DiscountService.getAllDiscountCodes();
      const usedCode = codes.find((c) => c.code === generated.code);
      expect(usedCode?.isUsed).toBe(true);
      expect(usedCode?.usedBy).toBe("user-123");
    });

    it("should fail to mark already used code", () => {
      const generated = DiscountService.generateDiscountCode(5);
      DiscountService.markAsUsed(generated.code, "user-1");

      const result = DiscountService.markAsUsed(generated.code, "user-2");
      expect(result).toBe(false);
    });
  });
});
