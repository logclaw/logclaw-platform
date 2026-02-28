import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/client";
import { tenants, onboardSessions } from "@/lib/db/schema";
import { createTenantPR } from "@/lib/github-app/client";
import { eq } from "drizzle-orm";
import { z } from "zod";

const prRequestSchema = z.object({
  installationId: z.number(),
  owner: z.string(),
  repo: z.string(),
  tenantId: z.string().regex(/^[a-z0-9-]+$/),
  tenantName: z.string().min(1),
  yamlContent: z.string().min(1),
  tier: z.string().default("ha"),
  cloudProvider: z.string().default("aws"),
});

export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof prRequestSchema>;
  try {
    body = prRequestSchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid request", detail: err }, { status: 400 });
  }

  // Check tenant slug uniqueness
  const existing = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, body.tenantId))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Tenant slug already exists" },
      { status: 409 }
    );
  }

  // Create PR via GitHub App
  let prUrl: string;
  try {
    prUrl = await createTenantPR({
      installationId: body.installationId,
      owner: body.owner,
      repo: body.repo,
      tenantId: body.tenantId,
      tenantName: body.tenantName,
      yamlContent: body.yamlContent,
    });
  } catch (err) {
    console.error("GitHub PR creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create GitHub PR" },
      { status: 500 }
    );
  }

  // Persist tenant record
  const [tenant] = await db
    .insert(tenants)
    .values({
      slug: body.tenantId,
      name: body.tenantName,
      tier: body.tier,
      cloudProvider: body.cloudProvider,
      orgId: orgId ?? userId,
      repoFullName: `${body.owner}/${body.repo}`,
      githubInstallationId: String(body.installationId),
    })
    .returning();

  // Update onboard session with PR URL + completion
  await db
    .update(onboardSessions)
    .set({
      tenantId: tenant.id,
      prUrl,
      completedAt: new Date(),
      currentStep: 7,
      updatedAt: new Date(),
    })
    .where(eq(onboardSessions.userId, userId));

  return NextResponse.json({ prUrl, tenantId: tenant.id }, { status: 201 });
}
