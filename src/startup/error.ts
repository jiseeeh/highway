import type { Express, NextFunction, Request, Response } from "express";
import createError from "http-errors";

import { env } from "@/lib/env.js";
import { logger } from "@/lib/logger.js";

const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404, "Not Found"));
};

type HttpErrorShape = {
  status?: number;
  statusCode?: number;
  message?: string;
  stack?: string;
};

function isHttpError(err: unknown): err is HttpErrorShape {
  return typeof err === "object" && err !== null;
}

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status = 500;
  let message = "Internal Server Error";
  let stack: string | undefined;

  if (isHttpError(err)) {
    status = err.status || err.statusCode || 500;
    message = status >= 500 ? "Internal Server Error" : err.message || "Error";
    stack = err.stack;
  }

  logger.error(
    { err, method: req.method, url: req.originalUrl },
    "Unhandled error",
  );

  if (res.headersSent) {
    return next(err);
  }

  res.status(status).json({
    status: "error",
    message,
    ...(env.NODE_ENV !== "production" ? { detail: stack } : {}),
  });
};

export const errorSetup = (app: Express) => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};
