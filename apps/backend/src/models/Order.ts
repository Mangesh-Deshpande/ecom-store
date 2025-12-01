export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  discountCode?: string;
  orderNumber: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
}
