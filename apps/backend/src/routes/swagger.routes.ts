import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../utils/swagger";

const router = Router();

// Combine serve and setup in one call
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
