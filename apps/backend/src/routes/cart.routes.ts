import { Router } from "express";
import { CartController } from "../controllers/cart.controller";

const router = Router();

router.get("/", CartController.getCart);

router.post("/items", CartController.addItem);

export default router;
