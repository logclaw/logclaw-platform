"use client";
import { useState } from "react";
import { Bell, FileText, Settings2, Activity, MessageSquare, Building2, Loader2 } from "lucide-react";

export interface Integration {
  platform: string;
  enabled: boolean;
  lastTicket?: string;
  ticketCount?: number;
}

const PLATFORM_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pagerduty: { label: "PagerDuty", icon: Bell, color: "text-green-600" },
  jira: { label: "Jira", icon: FileText, color: "text-blue-600" },
  servicenow: { label: "ServiceNow", icon: Settings2, color: "text-purple-600" },
  opsgenie: { label: "OpsGenie", icon: Activity, color: "text-teal-600" },
  zammad: { label: "Zammad", icon: Building2, color: "text-orange-600" },
  slack: { label: "Slack", icon: MessageSquare, color: "text-yellow-600" },
};

interface Props {
  integrations: Integration[];
  onToggle: (platform: string, enabled: boolean) => Promise<void>;
}

export default function IntegrationToggle({ integrations, onToggle }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleToggle(platform: string, current: boolean) {
    setLoading(platform);
    try {
      await onToggle(platform, !current);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-2">
      {integrations.map((integration) => {
        const meta = PLATFORM_META[integration.platform] ?? { label: integration.platform, icon: Settings2, color: "text-gray-600" };
        const Icon = meta.icon;
        const isLoading = loading === integration.platform;

        return (
          <div key={integration.platform} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
            <div className={`w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center ${meta.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{meta.label}</p>
              {integration.lastTicket && (
                <p className="text-xs text-gray-400 font-mono">Last: {integration.lastTicket} · {integration.ticketCount ?? 0} total</p>
              )}
            </div>
            <button
              onClick={() => handleToggle(integration.platform, integration.enabled)}
              disabled={isLoading}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 flex-shrink-0 ${integration.enabled ? "bg-brand-accent" : "bg-gray-200"}`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white mx-auto" />
              ) : (
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${integration.enabled ? "translate-x-5" : "translate-x-0"}`} />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
