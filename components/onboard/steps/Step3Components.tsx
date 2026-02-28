"use client";
import { Database, Zap, Search, Brain, Wind, Ticket } from "lucide-react";

const COMPONENTS = [
  { key: "kafka", label: "Kafka", icon: Database, desc: "3-broker KRaft cluster, 12-partition raw-logs topic", required: true },
  { key: "flink", label: "Flink", icon: Zap, desc: "ETL + enrichment + anomaly scoring pipelines", required: true },
  { key: "opensearch", label: "OpenSearch", icon: Search, desc: "3-node hot tier, ISM policy, 7-day retention", required: true },
  { key: "mlEngine", label: "ML Engine", icon: Brain, desc: "KServe InferenceService + Feast feature store", required: false },
  { key: "airflow", label: "Airflow", icon: Wind, desc: "ML pipeline orchestration, git-synced DAGs", required: false },
  { key: "ticketingAgent", label: "Ticketing Agent", icon: Ticket, desc: "RCA microservice + multi-platform ticket creation", required: false },
];

interface Props {
  enabled: Record<string, boolean>;
  onChange: (key: string, val: boolean) => void;
}

export default function Step3Components({ enabled, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Select components</h2>
        <p className="mt-2 text-text-secondary text-sm">Required components are always enabled. Optional ones can be added later.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {COMPONENTS.map((c) => (
          <div
            key={c.key}
            onClick={() => !c.required && onChange(c.key, !enabled[c.key])}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              enabled[c.key]
                ? "border-black bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "border-gray-200 bg-white hover:border-gray-400"
            } ${c.required ? "cursor-default" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${enabled[c.key] ? "bg-brand-accent/10 text-brand-accent" : "bg-gray-100 text-gray-400"}`}>
                  <c.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{c.label}</p>
                    {c.required && <span className="text-xs bg-black text-white px-1.5 py-0.5 rounded font-mono">required</span>}
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{c.desc}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${enabled[c.key] ? "bg-black border-black" : "border-gray-300"}`}>
                {enabled[c.key] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
