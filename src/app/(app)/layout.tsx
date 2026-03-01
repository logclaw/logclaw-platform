export const runtime = "edge";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db/client";
import { tenants } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import TenantSidebar from "../../../components/dashboard/TenantSidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { orgId } = await auth();

  const tenantList = orgId
    ? await db.select().from(tenants).where(eq(tenants.orgId, orgId))
    : [];

  const sidebarTenants = tenantList.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    health: "healthy" as const,
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <TenantSidebar tenants={sidebarTenants} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
