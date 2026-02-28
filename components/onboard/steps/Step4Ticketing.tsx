"use client";
import { useState } from "react";
import { Bell, FileText, Settings2, Activity, MessageSquare, Building2, ChevronDown, ChevronUp } from "lucide-react";

const PLATFORMS = [
  { key: "pagerduty", label: "PagerDuty", icon: Bell, desc: "Events API v2. P1/P2 immediate alerting with auto-resolve." },
  { key: "jira", label: "Jira", icon: FileText, desc: "REST API v3. Ticket creation for all severities." },
  { key: "servicenow", label: "ServiceNow", icon: Settings2, desc: "REST API. ITSM for regulated industries." },
  { key: "opsgenie", label: "OpsGenie", icon: Activity, desc: "Alerts API v2. Team-based alert routing." },
  { key: "zammad", label: "Zammad (in-cluster)", icon: Building2, desc: "Open-source ITSM deployed in your namespace. Zero data egress.", badge: "Air-gapped" },
  { key: "slack", label: "Slack", icon: MessageSquare, desc: "Incoming webhook notifications for critical/high." },
];

interface TicketingConfig {
  pagerduty: { enabled: boolean };
  jira: { enabled: boolean; baseUrl?: string; projectKey?: string };
  servicenow: { enabled: boolean };
  opsgenie: { enabled: boolean };
  zammad: { enabled: boolean; groupName?: string };
  slack: { enabled: boolean; channel?: string };
  routing: { critical: string[]; high: string[]; medium: string[]; low: string[] };
}

interface Props {
  config: TicketingConfig;
  onChange: (config: TicketingConfig) => void;
}

export default function Step4Ticketing({ config, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function togglePlatform(key: string) {
    const current = (config as any)[key];
    onChange({ ...config, [key]: { ...current, enabled: !current.enabled } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ticketing integrations</h2>
        <p className="mt-2 text-text-secondary text-sm">Enable any combination. Per-severity routing configured automatically.</p>
      </div>

      <div className="space-y-2">
        {PLATFORMS.map((p) => {
          const cfg = (config as any)[p.key];
          const isEnabled = cfg?.enabled ?? false;
          const isExpanded = expanded === p.key && isEnabled;
          return (
            <div key={p.key} className={`border-2 rounded-xl overflow-hidden transition-all ${isEnabled ? "border-black" : "border-gray-200"}`}>
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => {
                  togglePlatform(p.key);
                  if (!isEnabled) setExpanded(p.key);
                  else setExpanded(null);
                }}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isEnabled ? "bg-brand-accent/10 text-brand-accent" : "bg-gray-100 text-gray-400"}`}>
                  <p.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{p.label}</p>
                    {p.badge && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-mono">{p.badge}</span>}
                  </div>
                  <p className="text-xs text-text-secondary">{p.desc}</p>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${isEnabled ? "bg-brand-accent" : "bg-gray-200"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isEnabled ? "translate-x-4" : "translate-x-0"}`} />
                </div>
                {isEnabled && (
                  <button onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : p.key); }} className="p-1 text-gray-400">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                )}
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                  {p.key === "jira" && (
                    <>
                      <input placeholder="Base URL (https://yourco.atlassian.net)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono outline-none focus:border-black" defaultValue={(config.jira as any).baseUrl} onBlur={(e) => onChange({ ...config, jira: { ...config.jira, baseUrl: e.target.value } })} />
                      <input placeholder="Project Key (e.g. SRE)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono outline-none focus:border-black" defaultValue={(config.jira as any).projectKey} onBlur={(e) => onChange({ ...config, jira: { ...config.jira, projectKey: e.target.value } })} />
                    </>
                  )}
                  {p.key === "slack" && (
                    <input placeholder="Channel (e.g. #sre-incidents)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono outline-none focus:border-black" defaultValue={(config.slack as any).channel} onBlur={(e) => onChange({ ...config, slack: { ...config.slack, channel: e.target.value } })} />
                  )}
                  {p.key === "zammad" && (
                    <input placeholder='Group Name (e.g. "SRE Incidents")' className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-black" defaultValue={(config.zammad as any).groupName ?? "SRE Incidents"} onBlur={(e) => onChange({ ...config, zammad: { ...config.zammad, groupName: e.target.value } })} />
                  )}
                  {["pagerduty", "servicenow", "opsgenie"].includes(p.key) && (
                    <p className="text-xs text-text-secondary font-mono">API credentials will be fetched from your secret store at deploy time.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
