export interface DiscountCode {
  code: string;
  discountPercentage: number;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: Date;
  generatedForOrder: number;
  createdAt: Date;
}
