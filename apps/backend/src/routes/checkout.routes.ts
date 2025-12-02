import { Router } from "express";
import { CheckoutController } from "../controllers/checkout.controller";

const router = Router();

/**
 * @swagger
 * /api/checkout:
 *   post:
 *     summary: Checkout and create order
 *     tags: [Checkout]
 *     parameters:
 *       - in: header
 *         name: user-id
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discountCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order created successfully
 */
router.post("/", CheckoutController.checkout);

/**
 * @swagger
 * /api/checkout/orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Checkout]
 *     parameters:
 *       - in: header
 *         name: user-id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get("/orders", CheckoutController.getOrders);

/**
 * @swagger
 * /api/checkout/orders/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Checkout]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 */
router.get("/orders/:orderId", CheckoutController.getOrderById);

export default router;
