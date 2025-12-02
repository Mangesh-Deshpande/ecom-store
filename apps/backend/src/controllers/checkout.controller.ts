import { Request, Response } from "express";
import CartService from "../services/cart.service";
import OrderService from "../services/order.service";
import { RESPONSE_MESSAGES } from "../utils/constants";

export class CheckoutController {
  // checkout and create order
  static checkout = (req: Request, res: Response): void => {
    const userId = (req.headers["user-id"] as string) || "default-user";
    const { discountCode } = req.body;

    const cart = CartService.getCart(userId);

    if (cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
      return;
    }

    try {
      const order = OrderService.createOrder(userId, cart, discountCode);

      if (!order) {
        res.status(400).json({
          success: false,
          message: RESPONSE_MESSAGES.INSUFFICIENT_STOCK,
        });
        return;
      }

      res.json({
        success: true,
        message: RESPONSE_MESSAGES.ORDER_PLACED,
        data: {
          order,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Checkout failed",
      });
    }
  };

  // get user's orders
  static getOrders = (req: Request, res: Response): void => {
    const userId = (req.headers["user-id"] as string) || "default-user";
    const orders = OrderService.getOrdersByUser(userId);

    res.json({
      success: true,
      data: {
        orders,
        count: orders.length,
      },
    });
  };

  // get order by id
  static getOrderById = (req: Request, res: Response): void => {
    const { orderId } = req.params;
    const order = OrderService.getOrderById(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        order,
      },
    });
  };
}
