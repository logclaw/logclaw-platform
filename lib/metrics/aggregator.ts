export interface AgentMetricsPayload {
  tenantId: string;
  collectedAt: string;
  kafkaLag: Record<string, number>;
  flinkJobs: Array<{ name: string; state: string; restarts: number }>;
  osHealth: { status: string; numberOfNodes: number; numberOfDataNodes: number };
  esoStatus: Array<{ name: string; ready: boolean; lastSync: string }>;
}

export function summarizeHealth(payload: AgentMetricsPayload): "healthy" | "degraded" | "critical" {
  const maxLag = Math.max(...Object.values(payload.kafkaLag), 0);
  const failedFlink = payload.flinkJobs.filter((j) => j.state !== "RUNNING").length;
  const osOk = payload.osHealth.status === "green";
  const failedEso = payload.esoStatus.filter((e) => !e.ready).length;

  if (maxLag > 100000 || failedFlink > 0 || !osOk || failedEso > 0) return "critical";
  if (maxLag > 10000 || payload.flinkJobs.some((j) => j.restarts > 3)) return "degraded";
  return "healthy";
}
