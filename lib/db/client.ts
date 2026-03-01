// Uses postgres-js (standard TCP) so it works with Supabase on port 5432
// in both local dev and Node.js server environments.
// For Cloudflare edge deployment, swap to neon-http + a Neon database URL.
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
