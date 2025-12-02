import { Request, Response } from "express";
import OrderService from "../services/order.service";
import DiscountService from "../services/discount.service";
import ProductService from "../services/product.service";
import { DISCOUNT_CONFIG } from "../utils/constants";

export class AdminController {
  // Get analytics/statistics
  static getAnalytics = (req: Request, res: Response): void => {
    const totalItemsPurchased = OrderService.getTotalItemsPurchased();
    const totalPurchaseAmount = OrderService.getTotalPurchaseAmount();
    const totalDiscountAmount = OrderService.getTotalDiscountAmount();
    const discountCodes = DiscountService.getAllDiscountCodes();
    const orderCount = OrderService.getOrderCount();

    res.json({
      success: true,
      data: {
        totalItemsPurchased,
        totalPurchaseAmount: parseFloat(totalPurchaseAmount.toFixed(2)),
        totalDiscountAmount: parseFloat(totalDiscountAmount.toFixed(2)),
        orderCount,
        discountCodes: {
          total: discountCodes.length,
          used: discountCodes.filter((dc) => dc.isUsed).length,
          available: discountCodes.filter((dc) => !dc.isUsed).length,
          codes: discountCodes,
        },
        nextDiscountAt:
          DISCOUNT_CONFIG.NTH_ORDER - (orderCount % DISCOUNT_CONFIG.NTH_ORDER),
      },
    });
  };

  // generate discount code manually (admin only)
  static generateDiscountCode = (req: Request, res: Response): void => {
    const orderCount = OrderService.getOrderCount();

    // check if the current order count qualifies for a discount
    if (orderCount % DISCOUNT_CONFIG.NTH_ORDER !== 0) {
      res.status(400).json({
        success: false,
        message: `Discount codes are generated every ${
          DISCOUNT_CONFIG.NTH_ORDER
        } orders. Next discount at order ${
          Math.ceil(orderCount / DISCOUNT_CONFIG.NTH_ORDER) *
          DISCOUNT_CONFIG.NTH_ORDER
        }`,
      });
      return;
    }

    const discountCode = DiscountService.generateDiscountCode(orderCount);

    res.json({
      success: true,
      message: "Discount code generated successfully",
      data: {
        discountCode,
      },
    });
  };

  // get all products (for admin management)
  static getProducts = (req: Request, res: Response): void => {
    const products = ProductService.getAllProducts();

    res.json({
      success: true,
      data: {
        products,
        count: products.length,
      },
    });
  };

  // get all orders (admin view)
  static getAllOrders = (req: Request, res: Response): void => {
    const orders = OrderService.getAllOrders();

    res.json({
      success: true,
      data: {
        orders,
        count: orders.length,
      },
    });
  };
}
