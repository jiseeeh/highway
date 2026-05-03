import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import { env } from "../lib/env.js";
import { logger } from "../lib/logger.js";
import * as schema from "./schema/index.js";

const isProd = env.NODE_ENV === "production";

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  // 10 is good for a single server, reduce to 1 for serverless
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,

  // managed providers like neon usually requires ssl
  ssl: isProd
    ? {
        // 'rejectUnauthorized: false' allows connection to DBs using self-signed
        // certificates, which is standard for most managed cloud DB providers.
        rejectUnauthorized: false,
      }
    : false,
});

pool.on("error", (err) => {
  logger.error({ err }, "Unexpected DB pool error");
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;
