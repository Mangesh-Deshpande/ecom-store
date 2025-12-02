import { Order, OrderItem } from "../models/Order";
import { Cart } from "../models/Cart";
import ProductService from "./product.service";
import DiscountService from "./discount.service";
import CartService from "./cart.service";
import { DISCOUNT_CONFIG } from "../utils/constants";

class OrderService {
  private orders: Order[] = [];
  private orderCounter: number = 0;

  createOrder(userId: string, cart: Cart, discountCode?: string): Order | null {
    // validate stock for all items
    for (const item of cart.items) {
      if (!ProductService.checkStock(item.productId, item.quantity)) {
        return null;
      }
    }

    // calculate subtotal
    const subtotal = CartService.calculateTotal(cart);
    let discount = 0;
    let validatedDiscountCode: string | undefined = undefined;

    // validate and apply discount code if provided
    if (discountCode) {
      const validCode = DiscountService.validateDiscountCode(discountCode);
      if (!validCode) {
        throw new Error("Invalid or already used discount code");
      }
      discount = (subtotal * validCode.discountPercentage) / 100;
      validatedDiscountCode = discountCode;
    }

    const total = subtotal - discount;

    // create order items with product details
    const orderItems: OrderItem[] = cart.items.map((item) => {
      const product = ProductService.getProductById(item.productId)!;
      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      };
    });

    // update stock
    for (const item of cart.items) {
      ProductService.updateStock(item.productId, item.quantity);
    }

    this.orderCounter++;
    const order: Order = {
      id: `order-${Date.now()}`,
      userId,
      items: orderItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      discountCode: validatedDiscountCode,
      orderNumber: this.orderCounter,
      status: "completed",
      createdAt: new Date(),
    };

    this.orders.push(order);

    // mark discount code as used AFTER order is created successfully
    if (validatedDiscountCode) {
      DiscountService.markAsUsed(validatedDiscountCode, userId);
    }

    // check if this order qualifies for discount code generation
    if (this.orderCounter % DISCOUNT_CONFIG.NTH_ORDER === 0) {
      DiscountService.generateDiscountCode(this.orderCounter);
    }

    // clear cart
    CartService.clearCart(userId);

    return order;
  }

  getAllOrders(): Order[] {
    return this.orders;
  }

  getOrdersByUser(userId: string): Order[] {
    return this.orders.filter((order) => order.userId === userId);
  }

  getOrderById(orderId: string): Order | null {
    return this.orders.find((order) => order.id === orderId) || null;
  }

  getTotalItemsPurchased(): number {
    return this.orders.reduce((total, order) => {
      return total + order.items.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);
  }

  getTotalPurchaseAmount(): number {
    return this.orders.reduce((total, order) => total + order.total, 0);
  }

  getTotalDiscountAmount(): number {
    return this.orders.reduce((total, order) => total + order.discount, 0);
  }

  getOrderCount(): number {
    return this.orderCounter;
  }
}

export default new OrderService();
