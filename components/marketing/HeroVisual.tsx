import { Activity, AlertTriangle, CheckCircle2, Terminal } from "lucide-react";

export default function HeroVisual() {
  return (
    <div className="relative block group">
      {/* Browser chrome */}
      <div className="bg-gray-900 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1">
        {/* Title bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="text-xs font-mono text-gray-400">app.logclaw.io/dashboard</span>
            <span className="flex items-center gap-1 text-xs text-brand-accent font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              LIVE
            </span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-4 space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Logs / sec", value: "1.2M", trend: "+12%" },
              { label: "Anomalies", value: "3", trend: "active" },
              { label: "Tickets", value: "14", trend: "today" },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-gray-400 font-mono">{stat.label}</p>
                <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
                <p className="text-xs text-brand-accent">{stat.trend}</p>
              </div>
            ))}
          </div>

          {/* Log stream */}
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs text-gray-400 font-mono">Live stream</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <p><span className="text-red-400">[ERROR]</span><span className="text-gray-300"> payment-svc: timeout after 30s — 142 affected</span></p>
              <p><span className="text-yellow-400">[WARN]</span><span className="text-gray-300"> kafka lag: raw-logs partition 7 → 48,231</span></p>
              <p><span className="text-green-400">[INFO]</span><span className="text-gray-300"> anomaly scored 0.97 → ticket SRE-4821 created</span></p>
              <p><span className="text-red-400">[ERROR]</span><span className="text-gray-300"> db-primary: replication lag 12.4s</span></p>
            </div>
          </div>

          {/* Ticket badge */}
          <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-lg p-3 flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-brand-accent flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">SRE-4821 created → PagerDuty + Jira</p>
              <p className="text-xs text-gray-400 font-mono">payment-svc timeout · score 0.97 · P1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating anomaly badge */}
      <div className="absolute -top-4 -right-4 bg-white border-2 border-black rounded-xl px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 text-xs font-semibold">
        <AlertTriangle className="h-3.5 w-3.5 text-brand-accent" />
        Anomaly Detected
      </div>
    </div>
  );
}
