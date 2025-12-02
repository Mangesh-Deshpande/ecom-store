import { Router } from "express";
import cartRoutes from "./cart.routes";
import checkoutRoutes from "./checkout.routes";
import adminRoutes from "./admin.routes";

const router = Router();

// API routes
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/admin", adminRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
