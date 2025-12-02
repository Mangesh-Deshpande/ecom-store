import { DiscountCode } from "../models/DiscountCode";
import { DISCOUNT_CONFIG } from "../utils/constants";

class DiscountService {
  private discountCodes: DiscountCode[] = [];

  generateDiscountCode(orderNumber: number): DiscountCode {
    const code = `DISCOUNT${orderNumber}-${Date.now()}`;
    const discountCode: DiscountCode = {
      code,
      discountPercentage: DISCOUNT_CONFIG.DISCOUNT_PERCENTAGE,
      isUsed: false,
      generatedForOrder: orderNumber,
      createdAt: new Date(),
    };
    this.discountCodes.push(discountCode);
    return discountCode;
  }

  validateDiscountCode(code: string): DiscountCode | null {
    const discountCode = this.discountCodes.find((dc) => dc.code === code);
    if (!discountCode || discountCode.isUsed) {
      return null;
    }
    return discountCode;
  }

  markAsUsed(code: string, userId: string): boolean {
    const discountCode = this.discountCodes.find((dc) => dc.code === code);
    if (!discountCode || discountCode.isUsed) {
      return false;
    }
    discountCode.isUsed = true;
    discountCode.usedBy = userId;
    discountCode.usedAt = new Date();
    return true;
  }

  getAllDiscountCodes(): DiscountCode[] {
    return this.discountCodes;
  }

  // getTotalDiscountAmount(): number {
  //   return 0;
  // }
}

export default new DiscountService();
