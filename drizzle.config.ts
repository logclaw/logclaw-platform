import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Uses postgres-js (TCP) for migrations — @neondatabase/serverless is WebSocket-only
  // and cannot reach Supabase from local drizzle-kit CLI.
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
