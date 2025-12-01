import { Router } from "express";
import userRoutes from "./user.routes";
import cartRoutes from "./cart.routes";

const router = Router();

// API routes
router.use(userRoutes);
router.use("/cart", cartRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
