import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";

const router = Router();

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get store analytics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 */
router.get("/analytics", AdminController.getAnalytics);

/**
 * @swagger
 * /api/admin/discount-code:
 *   post:
 *     summary: Generate discount code manually
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Discount code generated
 */
router.post("/discount-code", AdminController.generateDiscountCode);

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get all products
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get("/products", AdminController.getProducts);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get("/orders", AdminController.getAllOrders);

export default router;
