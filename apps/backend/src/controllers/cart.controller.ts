import { Request, Response } from "express";
import CartService from "../services/cart.service";
import ProductService from "../services/product.service";
import { RESPONSE_MESSAGES } from "../utils/constants";

export class CartController {
  // Get user's cart
  static getCart = (req: Request, res: Response): void => {
    const userId = (req.headers["user-id"] as string) || "default-user";
    const cart = CartService.getCart(userId);
    const total = CartService.calculateTotal(cart);

    res.json({
      success: true,
      data: {
        cart,
        total,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  };

  // Add item to cart
  static addItem = (req: Request, res: Response): void => {
    const userId = (req.headers["user-id"] as string) || "default-user";
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      res.status(400).json({
        success: false,
        message: "Product ID and valid quantity are required",
      });
      return;
    }

    const product = ProductService.getProductById(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: RESPONSE_MESSAGES.PRODUCT_NOT_FOUND,
      });
      return;
    }

    const cart = CartService.addItem(userId, productId, quantity);
    if (!cart) {
      res.status(400).json({
        success: false,
        message: RESPONSE_MESSAGES.INSUFFICIENT_STOCK,
      });
      return;
    }

    const total = CartService.calculateTotal(cart);

    res.json({
      success: true,
      message: RESPONSE_MESSAGES.ITEM_ADDED,
      data: {
        cart,
        total,
      },
    });
  };
}
