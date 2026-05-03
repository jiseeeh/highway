import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { env } from "../lib/env.js";

export const securitySetup = (app: Express) => {
  app.use(helmet());

  app.use(
    cors({
      origin: env.NODE_ENV === "production" ? env.FRONTEND_URL : "*",
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  return app;
};
