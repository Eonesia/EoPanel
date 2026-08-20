import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health";
import { notificationsRouter } from "./routes/notifications";
import { authRouter } from "./routes/auth";
import { integrationsRouter } from "./routes/integrations";

export function createApp() {
  const app = express();
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

  app.use(cors({ origin: corsOrigin, credentials: true }));
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/notifications", notificationsRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/integrations", integrationsRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "not_found" });
  });

  return app;
}
