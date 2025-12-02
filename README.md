# 🛒 E-commerce Store API

A fully functional e-commerce REST API built with Express.js and TypeScript, featuring shopping cart management, checkout with discount validation, and comprehensive admin analytics.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [API Endpoints](#-api-endpoints)
- [Usage Examples](#-usage-examples)
- [Testing](#-testing)
- [Business Logic](#-business-logic)
- [Project Structure](#-project-structure)

## ✨ Features

### Customer Features

- ✅ Add items to shopping cart
- ✅ Update item quantities
- ✅ Remove items from cart
- ✅ Clear entire cart
- ✅ Checkout with automatic total calculation
- ✅ Apply discount codes at checkout
- ✅ View order history
- ✅ Stock validation

### Admin Features

- ✅ View analytics dashboard
  - Total items purchased
  - Total purchase amount
  - Total discount amount
  - Discount code statistics
- ✅ Generate discount codes manually
- ✅ View all orders
- ✅ View product inventory
- ✅ Track next discount milestone

### System Features

- ✅ Automatic discount code generation every Nth order (configurable)
- ✅ 10% discount on eligible orders
- ✅ One-time use discount codes
- ✅ Real-time stock management
- ✅ In-memory data store
- ✅ Comprehensive error handling
- ✅ Full API documentation (Swagger/OpenAPI)
- ✅ Unit and integration tests

## 🏗️ Architecture

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Testing**: Vitest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Validation**: Custom middleware

### Design Patterns

- **Service Layer Pattern**: Business logic separated from controllers
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Services instantiated as singletons
- **MVC Architecture**: Clear separation of concerns

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd <repo-name>

# Install dependencies
npm install

# Navigate to backend
cd apps/backend

# Start development server
npm run dev
```

The API will be available at `http://localhost:4000`

## 📚 API Endpoints

### Cart Management

| Method | Endpoint                     | Description          | Auth Header |
| ------ | ---------------------------- | -------------------- | ----------- |
| GET    | `/api/cart`                  | Get user's cart      | user-id     |
| POST   | `/api/cart/items`            | Add item to cart     | user-id     |
| PUT    | `/api/cart/items/:productId` | Update item quantity | user-id     |
| DELETE | `/api/cart/items/:productId` | Remove item          | user-id     |
| DELETE | `/api/cart`                  | Clear cart           | user-id     |

### Checkout

| Method | Endpoint                        | Description        | Auth Header |
| ------ | ------------------------------- | ------------------ | ----------- |
| POST   | `/api/checkout`                 | Place order        | user-id     |
| GET    | `/api/checkout/orders`          | Get user orders    | user-id     |
| GET    | `/api/checkout/orders/:orderId` | Get specific order | user-id     |

### Admin

| Method | Endpoint                   | Description       | Auth Header |
| ------ | -------------------------- | ----------------- | ----------- |
| GET    | `/api/admin/analytics`     | Get statistics    | -           |
| POST   | `/api/admin/discount-code` | Generate discount | -           |
| GET    | `/api/admin/products`      | Get all products  | -           |
| GET    | `/api/admin/orders`        | Get all orders    | -           |

## 💡 Usage Examples

### 1. Add Items to Cart

```bash
curl -X POST http://localhost:4000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "user-id: customer-1" \
  -d '{
    "productId": "p1",
    "quantity": 2
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cart": {
      "userId": "customer-1",
      "items": [
        {
          "productId": "p1",
          "quantity": 2,
          "price": 999.99
        }
      ]
    },
    "total": 1999.98
  }
}
```

### 2. View Cart

```bash
curl -X GET http://localhost:4000/api/cart \
  -H "user-id: customer-1"
```

### 3. Checkout Without Discount

```bash
curl -X POST http://localhost:4000/api/checkout \
  -H "Content-Type: application/json" \
  -H "user-id: customer-1" \
  -d '{}'
```

### 4. Checkout With Discount Code

```bash
curl -X POST http://localhost:4000/api/checkout \
  -H "Content-Type: application/json" \
  -H "user-id: customer-1" \
  -d '{
    "discountCode": "DISCOUNT5-1733054400000"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "id": "order-1733054400000",
      "userId": "customer-1",
      "subtotal": 1999.98,
      "discount": 199.998,
      "total": 1799.98,
      "discountCode": "DISCOUNT5-1733054400000",
      "orderNumber": 6
    }
  }
}
```

### 5. View Analytics

```bash
curl -X GET http://localhost:4000/api/admin/analytics
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalItemsPurchased": 25,
    "totalPurchaseAmount": 7845.50,
    "totalDiscountAmount": 784.55,
    "orderCount": 12,
    "discountCodes": {
      "total": 2,
      "used": 1,
      "available": 1,
      "codes": [...]
    },
    "nextDiscountAt": 3
  }
}
```

## 🧪 Testing

### Run All Tests

```bash
npm run test
```

### Run Specific Test Suite

```bash
# Cart functionality
npm run test -- tests/integration/cart.routes.test.ts

# Checkout functionality
npm run test -- tests/integration/checkout.routes.test.ts

# Admin functionality
npm run test -- tests/integration/admin.routes.test.ts
```

### Test Coverage

```bash
npm run test:coverage
```

### Test Structure

```
tests/
├── integration/          # API endpoint tests
│   ├── cart.routes.test.ts
│   ├── checkout.routes.test.ts
│   └── admin.routes.test.ts
└── unit/                 # Service layer tests
    └── discount.service.test.ts
```

## 🎯 Business Logic

### Discount Code Generation

**Rule**: Every Nth order generates a discount code (default N=5)

**Implementation**:

1. Order counter increments with each successful checkout
2. When `orderNumber % N === 0`, system generates discount code
3. Code format: `DISCOUNT{orderNumber}-{timestamp}`
4. Discount percentage: 10% (configurable)

**Example**:

- Orders 1-4: No discount generated
- Order 5: Discount code generated ✅
- Orders 6-9: No discount generated
- Order 10: Discount code generated ✅

### Discount Code Usage

**Rules**:

1. Each code can only be used once
2. Code must exist and not be marked as used
3. Discount applies to entire order (subtotal)
4. Code is marked as used immediately upon successful checkout
5. Code becomes invalid for future use

**Validation Flow**:

```
User applies code → Validate code exists → Check if used →
Apply discount → Calculate total → Mark as used → Complete order
```

### Stock Management

**Rules**:

1. Stock checked when adding to cart
2. Stock validated again at checkout
3. Stock decremented only after successful order
4. Insufficient stock prevents both cart addition and checkout

## 📁 Project Structure

```
apps/backend/src/
├── models/
│   ├── Product.ts          # Product interface
│   ├── Cart.ts             # Cart & CartItem interfaces
│   ├── Order.ts            # Order & OrderItem interfaces
│   └── DiscountCode.ts     # DiscountCode interface
│
├── services/
│   ├── product.service.ts  # Product inventory management
│   ├── cart.service.ts     # Cart operations
│   ├── order.service.ts    # Order creation & management
│   └── discount.service.ts # Discount code logic
│
├── controllers/
│   ├── cart.controller.ts      # Cart API handlers
│   ├── checkout.controller.ts  # Checkout API handlers
│   └── admin.controller.ts     # Admin API handlers
│
├── routes/
│   ├── cart.routes.ts      # Cart endpoints
│   ├── checkout.routes.ts  # Checkout endpoints
│   └── admin.routes.ts     # Admin endpoints
│
├── utils/
│   └── constants.ts        # Configuration constants
│
└── middlewares/
    └── error.middleware.ts # Error handling
```

## 🔧 Configuration

### Change Nth Order for Discount

Edit `apps/backend/src/utils/constants.ts`:

```typescript
export const DISCOUNT_CONFIG = {
  NTH_ORDER: 5, // Change to 3, 10, etc.
  DISCOUNT_PERCENTAGE: 10, // Change to 15, 20, etc.
};
```

### Available Products

| ID  | Name     | Price   | Initial Stock |
| --- | -------- | ------- | ------------- |
| p1  | Laptop   | $999.99 | 10            |
| p2  | Mouse    | $29.99  | 50            |
| p3  | Keyboard | $79.99  | 30            |
| p4  | Monitor  | $399.99 | 15            |

## 📖 API Documentation

Interactive API documentation available at:
**http://localhost:4000/api-docs**

Features:

- Try out all endpoints
- View request/response schemas
- See example payloads
- Test authentication headers

## 🎓 Testing Workflow

### Complete E2E Test Scenario

```bash
# 1. View products
curl http://localhost:4000/api/admin/products

# 2. Add items to cart
curl -X POST http://localhost:4000/api/cart/items \
  -H "user-id: user1" -H "Content-Type: application/json" \
  -d '{"productId": "p1", "quantity": 1}'

# 3. View cart
curl http://localhost:4000/api/cart -H "user-id: user1"

# 4. Checkout
curl -X POST http://localhost:4000/api/checkout \
  -H "user-id: user1" -H "Content-Type: application/json" \
  -d '{}'

# 5. View orders
curl http://localhost:4000/api/checkout/orders -H "user-id: user1"

# 6. Create 4 more orders (users 2-5)
# ... repeat steps 2-4 for user2, user3, user4, user5

# 7. Check analytics (discount should be generated)
curl http://localhost:4000/api/admin/analytics

# 8. Use discount code
curl -X POST http://localhost:4000/api/checkout \
  -H "user-id: user6" -H "Content-Type: application/json" \
  -d '{"discountCode": "DISCOUNT5-xxx"}'
```

## 🐛 Error Handling

### Common Errors and Solutions

| Error                   | Cause                      | Solution                            |
| ----------------------- | -------------------------- | ----------------------------------- |
| "Cart is empty"         | Checkout without items     | Add items before checkout           |
| "Product not found"     | Invalid product ID         | Use valid ID (p1, p2, p3, p4)       |
| "Insufficient stock"    | Quantity exceeds stock     | Reduce quantity or check stock      |
| "Invalid discount code" | Code doesn't exist or used | Generate new code (every 5th order) |

## 🚀 Future Enhancements

- [ ] User authentication & authorization
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product search & filtering
- [ ] Product categories
- [ ] Wishlist functionality
- [ ] Multiple discount types
- [ ] Inventory alerts
- [ ] Order status tracking

## 📝 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

- Documentation: http://localhost:4000/api-docs
- Issues: GitHub Issues
- Email: support@example.com

---

Built with ❤️ using Express.js and TypeScript
