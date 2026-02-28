"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  { n: "01", title: "Log Ingestion", desc: "Vector & OpenTelemetry at Tbps. Kafka 3-broker KRaft cluster with 12-partition raw-logs topic.", color: "bg-blue-500/20 text-blue-300" },
  { n: "02", title: "Enrichment", desc: "Apache Flink ETL: parse, validate, enrich with feature vectors. Drain3 log template clustering.", color: "bg-purple-500/20 text-purple-300" },
  { n: "03", title: "Anomaly Detection", desc: "KServe + TorchServe scoring pipeline. <200ms SLA. Score threshold 0.90+ triggers incident.", color: "bg-brand-accent/20 text-brand-accent" },
  { n: "04", title: "RCA + Ticket", desc: "LLM-powered root cause analysis. Autonomous ticket creation across 6 platforms simultaneously.", color: "bg-green-500/20 text-green-300" },
  { n: "05", title: "Alert + Resolve", desc: "PagerDuty P1 paging, Slack threads, auto-resolve timeout. Full lifecycle tracked in Zammad.", color: "bg-yellow-500/20 text-yellow-300" },
];

export default function Architecture() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
            From raw logs to resolved incident
          </h2>
          <p className="mt-4 text-text-secondary text-lg">
            In under 30 minutes from initial deployment. Fully automated pipeline.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex-1 flex flex-col items-start"
            >
              <div className="w-full p-5 border-2 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold font-mono mb-3 ${step.color}`}>
                  {step.n}
                </div>
                <h3 className="font-bold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:flex w-full justify-end pr-2 mt-5">
                  <ArrowRight className="h-4 w-4 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
