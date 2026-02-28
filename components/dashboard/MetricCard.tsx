"use client";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  status?: "healthy" | "degraded" | "critical";
}

export default function MetricCard({ label, value, unit, trend, trendLabel, status }: Props) {
  const statusColors = {
    healthy: "text-green-600 bg-green-50 border-green-200",
    degraded: "text-yellow-600 bg-yellow-50 border-yellow-200",
    critical: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-black transition-colors shadow-sm">
      <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black">{value}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        {status && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[status]}`}>
            {status}
          </span>
        )}
      </div>
      {trend && trendLabel && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          {trend === "up" ? <TrendingUp className="h-3 w-3 text-green-500" /> :
           trend === "down" ? <TrendingDown className="h-3 w-3 text-red-500" /> :
           <Minus className="h-3 w-3" />}
          {trendLabel}
        </div>
      )}
    </div>
  );
}
