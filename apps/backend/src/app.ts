import express, { Application, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import routes from "./routes";
import { errorMiddleware } from "./middlewares";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation - Fixed typing
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API is running",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      docs: "/api-docs",
    },
  });
});

// Error handling
app.use(errorMiddleware);

export default app;
