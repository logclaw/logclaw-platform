"use client";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import YamlPreview from "../YamlPreview";

const TIMELINE = [
  { time: "T+02:00", label: "Namespace + NetworkPolicy created" },
  { time: "T+05:00", label: "Secrets synced from cloud secret manager" },
  { time: "T+06:00", label: "Kafka 3-broker KRaft cluster online" },
  { time: "T+15:00", label: "OpenSearch cluster green" },
  { time: "T+22:00", label: "Flink anomaly scoring pipeline running" },
  { time: "T+27:00", label: "Ticketing agent consuming from anomaly topic" },
  { time: "T+30:00", label: "Full stack operational" },
];

interface Props {
  yaml: string;
  errors: string[];
}

export default function Step6Review({ yaml, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Review configuration</h2>
        <p className="mt-2 text-text-secondary text-sm">This YAML will be committed to your GitOps repo as a pull request.</p>
      </div>

      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm font-semibold text-red-700">Validation errors</p>
          </div>
          {errors.map((e) => <p key={e} className="text-xs text-red-600 font-mono">{e}</p>)}
        </div>
      )}

      {errors.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <p className="text-sm font-semibold text-green-700">Configuration valid</p>
        </div>
      )}

      <YamlPreview yaml={yaml} />

      {/* Deployment timeline */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-text-secondary" />
          <p className="text-sm font-semibold">Deployment timeline (~30 min)</p>
        </div>
        <div className="space-y-2">
          {TIMELINE.map((t, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span className="font-mono text-brand-accent w-16 flex-shrink-0">{t.time}</span>
              <span className="text-text-secondary">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
