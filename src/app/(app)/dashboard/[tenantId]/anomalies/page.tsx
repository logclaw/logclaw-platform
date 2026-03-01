import AnomalyTimeline from "~/components/dashboard/AnomalyTimeline";
import type { AnomalyEvent } from "~/components/dashboard/AnomalyTimeline";

// Demo data — in production this comes from OpenSearch via the agent
const DEMO_EVENTS: AnomalyEvent[] = [
  { id: "1", score: 0.97, summary: "payment-svc: timeout spike — 142 requests failed", service: "payment-service", severity: "critical", ticketId: "SRE-4821", ticketPlatform: "Jira", timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: "2", score: 0.93, summary: "db-primary: replication lag > 10s", service: "postgres-primary", severity: "high", ticketId: "PD-10293", ticketPlatform: "PagerDuty", timestamp: new Date(Date.now() - 900000).toISOString() },
  { id: "3", score: 0.91, summary: "kafka raw-logs partition 7 lag: 48,231", service: "kafka-cluster", severity: "medium", timestamp: new Date(Date.now() - 1800000).toISOString() },
];

export default async function AnomaliesPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Anomalies</h1>
      <p className="text-text-secondary text-sm mb-8">AI-detected anomalies scoring ≥ 0.90. Tickets auto-created.</p>
      <AnomalyTimeline events={DEMO_EVENTS} />
    </div>
  );
}
