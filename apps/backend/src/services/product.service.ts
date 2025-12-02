import { Product } from "../models/Product";

const productData = [
  {
    id: "p1",
    name: "Laptop",
    description: "High quality laptop",
    price: 999.99,
    stock: 50,
    createdAt: new Date(),
  },
  {
    id: "p2",
    name: "Mouse",
    description: "Wireless mouse",
    price: 29.99,
    stock: 50,
    createdAt: new Date(),
  },
  {
    id: "p3",
    name: "Keyboard",
    description: "Mechanical keyboard",
    price: 79.99,
    stock: 30,
    createdAt: new Date(),
  },
  {
    id: "p4",
    name: "Monitor",
    description: "32-inch 4K monitor",
    price: 399.99,
    stock: 15,
    createdAt: new Date(),
  },
];

class ProductService {
  private products: Product[] = productData;

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | null {
    return this.products.find((p) => p.id === id) || null;
  }

  updateStock(productId: string, quantity: number): boolean {
    const product = this.getProductById(productId);
    if (!product || product.stock < quantity) {
      return false;
    }
    product.stock -= quantity;
    return true;
  }

  checkStock(productId: string, quantity: number): boolean {
    const product = this.getProductById(productId);
    return product ? product.stock >= quantity : false;
  }
}

export default new ProductService();
