import { Check, X } from "lucide-react";

const rows = [
  { problem: "Manual log tracing takes hours", logclaw: "Journey Map + AI RCA in seconds", others: false },
  { problem: "Vendor lock-in, data egress", logclaw: "Self-hosted, air-gapped mode", others: false },
  { problem: "Expensive SaaS pricing at scale", logclaw: "Open-source core, pay for support only", others: false },
  { problem: "Alerts without root cause", logclaw: "LLM RCA + ticket with suggested fix", others: false },
  { problem: "Fragmented tools (5+ dashboards)", logclaw: "Single enterprise portal", others: false },
  { problem: "No compliance for fintech/health", logclaw: "HIPAA-ready, SOC 2, zero data egress", others: false },
];

export default function ComparisonTable() {
  return (
    <section className="py-24 bg-background-secondary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
            Why enterprises choose LogClaw
          </h2>
        </div>

        <div className="overflow-hidden border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black text-white">
                <th className="text-left p-4 font-semibold">Problem</th>
                <th className="text-center p-4 font-semibold text-brand-accent">LogClaw</th>
                <th className="text-center p-4 font-semibold text-gray-400">Splunk / Datadog</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-4 text-text-secondary">{row.problem}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-left hidden sm:block">{row.logclaw}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <X className="h-4 w-4 text-red-400 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
