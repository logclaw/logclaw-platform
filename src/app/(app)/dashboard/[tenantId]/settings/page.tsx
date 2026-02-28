import { auth } from "@clerk/nextjs/server";
import { db } from "../../../../../lib/db/client";
import { tenants } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Key } from "lucide-react";

export default async function SettingsPage({ params }: { params: { tenantId: string } }) {
  const { orgId } = await auth();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, params.tenantId));
  if (!tenant || tenant.orgId !== orgId) notFound();

  const agentJwt = `lc_agent_${tenant.slug}_xxxxxxxxxxxxxxxxxxxx`;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="p-6 bg-white border-2 border-gray-200 rounded-xl">
          <h2 className="font-bold mb-1">Tenant info</h2>
          <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-text-secondary">Tenant ID</span><span className="font-mono">{tenant.slug}</span>
            <span className="text-text-secondary">Name</span><span>{tenant.name}</span>
            <span className="text-text-secondary">Tier</span><span className="font-mono">{tenant.tier}</span>
            <span className="text-text-secondary">Cloud</span><span className="font-mono">{tenant.cloudProvider}</span>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Key className="h-4 w-4" />
            <h2 className="font-bold">Agent JWT</h2>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Set <code className="bg-gray-100 px-1 rounded text-xs">LOGCLAW_AGENT_JWT</code> in your cluster via the ESO secret store path <code className="bg-gray-100 px-1 rounded text-xs font-mono">logclaw/{tenant.slug}/agent/jwt</code>.
          </p>
          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <code className="flex-1 text-xs font-mono text-gray-600 truncate">{agentJwt}</code>
          </div>
          <p className="mt-2 text-xs text-text-secondary">Deploy the <code className="bg-gray-100 px-1 rounded">logclaw-agent</code> Helm chart to start receiving metrics.</p>
        </div>
      </div>
    </div>
  );
}
