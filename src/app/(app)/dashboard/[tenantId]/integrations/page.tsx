"use client";
import { useState } from "react";
import IntegrationToggle from "../../../../../components/dashboard/IntegrationToggle";
import type { Integration } from "../../../../../components/dashboard/IntegrationToggle";

const DEFAULT_INTEGRATIONS: Integration[] = [
  { platform: "pagerduty", enabled: true, lastTicket: "PD-10293", ticketCount: 47 },
  { platform: "jira", enabled: true, lastTicket: "SRE-4821", ticketCount: 183 },
  { platform: "zammad", enabled: true, lastTicket: "#2041", ticketCount: 12 },
  { platform: "slack", enabled: true },
  { platform: "servicenow", enabled: false },
  { platform: "opsgenie", enabled: false },
];

export default function IntegrationsPage({ params }: { params: { tenantId: string } }) {
  const [integrations, setIntegrations] = useState(DEFAULT_INTEGRATIONS);

  async function handleToggle(platform: string, enabled: boolean) {
    // In production: PATCH /api/tenants/{tenantId}/integrations/{platform}
    setIntegrations((prev) => prev.map((i) => i.platform === platform ? { ...i, enabled } : i));
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Integrations</h1>
      <p className="text-text-secondary text-sm mb-8">Toggle ticketing platforms. Changes apply on next anomaly event.</p>
      <div className="max-w-lg">
        <IntegrationToggle integrations={integrations} onToggle={handleToggle} />
      </div>
    </div>
  );
}
