import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

import { db } from "~/lib/db/client";
import { tenants, metrics } from "~/lib/db/schema";
import { summarizeHealth, AgentMetricsPayload } from "~/lib/metrics/aggregator";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  // Verify Bearer JWT
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = auth.slice(7);
  if (token !== process.env.LOGCLAW_AGENT_JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: AgentMetricsPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.tenantId) {
    return NextResponse.json({ error: "tenantId required" }, { status: 400 });
  }

  // Look up tenant by slug
  const [tenant] = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, body.tenantId))
    .limit(1);

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  // Persist metrics row
  await db.insert(metrics).values({
    tenantId: tenant.id,
    collectedAt: new Date(body.collectedAt),
    kafkaLagJson: body.kafkaLag,
    flinkStatusJson: body.flinkJobs,
    osHealthJson: body.osHealth,
    esoStatusJson: body.esoStatus,
  });

  const health = summarizeHealth(body);

  return NextResponse.json({ ok: true, health }, { status: 200 });
}

// Latest metrics for a tenant (used by dashboard SWR)
export async function GET(req: NextRequest) {
  const tenantSlug = req.nextUrl.searchParams.get("tenantId");
  if (!tenantSlug) {
    return NextResponse.json({ error: "tenantId required" }, { status: 400 });
  }

  const [tenant] = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, tenantSlug))
    .limit(1);

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const rows = await db
    .select()
    .from(metrics)
    .where(eq(metrics.tenantId, tenant.id))
    .orderBy(metrics.collectedAt)
    .limit(120); // ~1 hour at 30s intervals

  return NextResponse.json({ rows }, { status: 200 });
}
