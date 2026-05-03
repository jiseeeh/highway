import type { Express } from "express";

import { pinoHttp } from "pino-http";
import { pool } from "@/db/index.js";
import { env } from "@/lib/env.js";
import { logger } from "@/lib/logger.js";

export const appSetup = (app: Express) => {
  const PORT = env.PORT;

  app.use(pinoHttp({ logger }));

  const server = app.listen(Number(PORT), "0.0.0.0", () => {
    logger.info(`Server is listening on 0.0.0.0:${PORT}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);

    server.close(async () => {
      logger.info("HTTP server closed");

      try {
        await pool.end();
        logger.info("Database pool closed");

        process.exit(0);
      } catch (err) {
        logger.error({ err }, "Error during database shutdown");
        process.exit(1);
      }
    });

    // force shut if graceful shutdown takes too long
    setTimeout(() => {
      logger.error(
        "Could not close connections in time, forcefully shutting down",
      );
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled promise rejection");
    process.exit(1);
  });
};
