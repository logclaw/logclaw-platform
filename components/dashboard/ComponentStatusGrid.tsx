"use client";
import { Database, Zap, Search, Brain, Ticket, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";

export interface ComponentStatus {
  name: string;
  key: string;
  status: "running" | "degraded" | "down" | "unknown";
  detail?: string;
}

const ICONS: Record<string, React.ElementType> = {
  kafka: Database,
  flink: Zap,
  opensearch: Search,
  mlEngine: Brain,
  ticketingAgent: Ticket,
};

const STATUS_CONFIG = {
  running: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-200", label: "Running" },
  degraded: { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", label: "Degraded" },
  down: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Down" },
  unknown: { icon: Loader2, color: "text-gray-400", bg: "bg-gray-50", border: "border-gray-200", label: "Unknown" },
};

interface Props {
  components: ComponentStatus[];
}

export default function ComponentStatusGrid({ components }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {components.map((c) => {
        const Icon = ICONS[c.key] ?? Database;
        const sc = STATUS_CONFIG[c.status];
        const StatusIcon = sc.icon;
        return (
          <div key={c.key} className={`p-4 border rounded-xl ${sc.bg} ${sc.border}`}>
            <div className="flex items-center justify-between mb-2">
              <Icon className={`h-4 w-4 ${sc.color}`} />
              <StatusIcon className={`h-3.5 w-3.5 ${sc.color} ${c.status === "unknown" ? "animate-spin" : ""}`} />
            </div>
            <p className="font-semibold text-xs">{c.name}</p>
            <p className={`text-xs ${sc.color} font-mono mt-0.5`}>{sc.label}</p>
            {c.detail && <p className="text-xs text-gray-500 mt-1 truncate">{c.detail}</p>}
          </div>
        );
      })}
    </div>
  );
}
