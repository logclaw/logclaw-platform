"use client";
import { AlertTriangle, Ticket, Clock } from "lucide-react";

export interface AnomalyEvent {
  id: string;
  score: number;
  summary: string;
  service: string;
  ticketId?: string;
  ticketPlatform?: string;
  timestamp: string;
  severity: "critical" | "high" | "medium" | "low";
}

const SEVERITY_COLORS = {
  critical: "border-red-400 bg-red-50",
  high: "border-orange-400 bg-orange-50",
  medium: "border-yellow-400 bg-yellow-50",
  low: "border-blue-400 bg-blue-50",
};

const SEVERITY_BADGE = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-blue-100 text-blue-700",
};

interface Props {
  events: AnomalyEvent[];
}

export default function AnomalyTimeline({ events }: Props) {
  if (!events.length) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-sm text-gray-400 font-mono">No anomalies detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className={`p-4 border-l-4 rounded-r-xl border border-l-4 ${SEVERITY_COLORS[event.severity]}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <AlertTriangle className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{event.summary}</p>
                <p className="text-xs text-gray-500 font-mono">{event.service}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SEVERITY_BADGE[event.severity]}`}>
                {event.severity}
              </span>
              <span className="text-xs text-gray-400 font-mono">score: {event.score.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(event.timestamp).toLocaleTimeString()}
            </div>
            {event.ticketId && (
              <div className="flex items-center gap-1">
                <Ticket className="h-3 w-3" />
                <span className="font-mono">{event.ticketPlatform}: {event.ticketId}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
