import "dotenv/config";
import * as v from "valibot";

const EnvSchema = v.object({
  NODE_ENV: v.picklist(["development", "production", "test"]),
  PORT: v.pipe(v.string(), v.transform(Number)),
  FRONTEND_URL: v.pipe(v.string(), v.url()),
  DATABASE_URL: v.pipe(v.string(), v.url()),
});

const parsed = v.safeParse(EnvSchema, process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(v.flatten(parsed.issues).nested);
  process.exit(1);
}

export const env = parsed.output;
export type Env = typeof env;
