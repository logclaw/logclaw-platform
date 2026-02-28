import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/client";
import { tenants, metrics } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// List tenants for the current org
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = req.nextUrl.searchParams.get("id");

  if (tenantId) {
    // Single tenant with latest metrics
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1);

    if (!tenant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [latestMetric] = await db
      .select()
      .from(metrics)
      .where(eq(metrics.tenantId, tenantId))
      .orderBy(desc(metrics.collectedAt))
      .limit(1);

    return NextResponse.json({ tenant, latestMetric: latestMetric ?? null });
  }

  // List all tenants for org
  const orgFilter = orgId ?? userId;
  const rows = await db
    .select()
    .from(tenants)
    .where(eq(tenants.orgId, orgFilter))
    .orderBy(desc(tenants.createdAt));

  return NextResponse.json({ tenants: rows });
}

// Create tenant directly (for CLI / API; wizard uses /api/onboard/pr instead)
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, name, tier = "ha", cloudProvider = "aws" } = body;

  if (!slug || !name) {
    return NextResponse.json({ error: "slug and name required" }, { status: 400 });
  }

  const [tenant] = await db
    .insert(tenants)
    .values({
      slug,
      name,
      tier,
      cloudProvider,
      orgId: orgId ?? userId,
    })
    .returning();

  return NextResponse.json({ tenant }, { status: 201 });
}
