import { Router } from "express";
import userRoutes from "./user.routes";

const router = Router();

// API routes
router.use(userRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
