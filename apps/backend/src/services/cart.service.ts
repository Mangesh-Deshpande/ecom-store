import { Cart } from "../models/Cart";
import ProductService from "./product.service";

class CartService {
  private carts: Map<string, Cart> = new Map();

  getCart(userId: string): Cart {
    // check if the user has a cart or else create it
    if (!this.carts.has(userId)) {
      this.carts.set(userId, {
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return this.carts.get(userId)!;
  }

  addItem(userId: string, productId: string, quantity: number): Cart | null {
    const product = ProductService.getProductById(productId);
    if (!product) return null;

    if (!ProductService.checkStock(productId, quantity)) {
      return null;
    }

    const cart = this.getCart(userId);
    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    cart.updatedAt = new Date();
    return cart;
  }

  calculateTotal(cart: Cart): number {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}

export default new CartService();
