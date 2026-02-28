import { auth } from "@clerk/nextjs/server";
import { db } from "../../../../lib/db/client";
import { tenants } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

export default async function DashboardPage() {
  const { orgId } = await auth();
  const tenantList = orgId
    ? await db.select().from(tenants).where(eq(tenants.orgId, orgId))
    : [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">{tenantList.length} tenant{tenantList.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/onboard"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </Link>
      </div>

      {tenantList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-300 rounded-2xl">
          <p className="text-lg font-bold mb-2">No tenants yet</p>
          <p className="text-text-secondary text-sm mb-6">Deploy your first LogClaw stack in 30 minutes.</p>
          <Link href="/onboard" className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
            Start onboarding <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tenantList.map((t) => (
            <Link key={t.id} href={`/dashboard/${t.id}`} className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-mono text-xs text-gray-500">{t.slug}</span>
                </div>
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full font-mono">{t.tier}</span>
              </div>
              <p className="font-bold text-lg">{t.name}</p>
              <p className="text-xs text-text-secondary mt-1">{t.cloudProvider.toUpperCase()} · {t.createdAt.toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
