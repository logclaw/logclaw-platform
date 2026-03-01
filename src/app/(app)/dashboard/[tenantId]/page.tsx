import { auth } from "@clerk/nextjs/server";
import { db } from "~/lib/db/client";
import { tenants, metrics, integrations } from "~/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import HealthRing from "~/components/dashboard/HealthRing";
import MetricCard from "~/components/dashboard/MetricCard";
import ComponentStatusGrid from "~/components/dashboard/ComponentStatusGrid";

export default async function TenantOverviewPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  const { orgId } = await auth();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  if (!tenant || tenant.orgId !== orgId) notFound();

  const [latestMetric] = await db.select().from(metrics)
    .where(eq(metrics.tenantId, tenantId))
    .orderBy(desc(metrics.collectedAt))
    .limit(1);

  const kafkaLag = latestMetric?.kafkaLagJson as Record<string, number> ?? {};
  const totalLag = Object.values(kafkaLag).reduce((a, b) => a + b, 0);
  const flinkStatus = latestMetric?.flinkStatusJson as Array<{ state: string }> ?? [];
  const runningJobs = flinkStatus.filter((j) => j.state === "RUNNING").length;
  const osHealth = latestMetric?.osHealthJson as { status: string } ?? { status: "unknown" };

  const componentStatuses = [
    { name: "Kafka", key: "kafka", status: (totalLag < 100000 ? "running" : "degraded") as "running" | "degraded", detail: `lag: ${totalLag.toLocaleString()}` },
    { name: "Flink", key: "flink", status: (flinkStatus.length > 0 && runningJobs === flinkStatus.length ? "running" : "unknown") as "running" | "unknown", detail: `${runningJobs}/${flinkStatus.length} jobs` },
    { name: "OpenSearch", key: "opensearch", status: (osHealth.status === "green" ? "running" : osHealth.status === "yellow" ? "degraded" : "unknown") as "running" | "degraded" | "unknown", detail: osHealth.status },
    { name: "Ticketing Agent", key: "ticketingAgent", status: "running" as const },
    { name: "ML Engine", key: "mlEngine", status: "running" as const },
  ];

  const overallHealth = componentStatuses.some((c) => c.status === "degraded") ? "degraded" : "healthy";

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-mono text-gray-500 mb-1">{tenant.slug}</p>
          <h1 className="text-2xl font-bold">{tenant.name}</h1>
          <p className="text-sm text-text-secondary mt-1">{tenant.tier.toUpperCase()} · {tenant.cloudProvider.toUpperCase()}</p>
        </div>
        <HealthRing health={overallHealth} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Kafka Lag (total)" value={totalLag.toLocaleString()} trend={totalLag > 10000 ? "up" : "flat"} trendLabel={totalLag > 10000 ? "High" : "Normal"} />
        <MetricCard label="Flink Jobs" value={`${runningJobs}/${flinkStatus.length}`} status={runningJobs === flinkStatus.length ? "healthy" : "degraded"} />
        <MetricCard label="OpenSearch" value={osHealth.status || "—"} status={osHealth.status === "green" ? "healthy" : osHealth.status === "yellow" ? "degraded" : "critical"} />
        <MetricCard label="Last Metric" value={latestMetric ? new Date(latestMetric.collectedAt).toLocaleTimeString() : "—"} />
      </div>

      <div className="mb-8">
        <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-500">Components</h2>
        <ComponentStatusGrid components={componentStatuses} />
      </div>
    </div>
  );
}
