"use client";
import { motion } from "framer-motion";
import { Plug, Box, Map, Ticket, Lock, Bot } from "lucide-react";

const features = [
  {
    icon: Plug,
    title: "Parasitic Connectors",
    description: "Zero-migration adoption on top of Splunk, Datadog, New Relic, Dynatrace, and CloudWatch. No rip-and-replace.",
  },
  {
    icon: Box,
    title: "Open-Source Native Core",
    description: "Grafana Loki, Prometheus, Vector.dev, Apache Flink, and OpenSearch — no proprietary runtime lock-in.",
  },
  {
    icon: Map,
    title: "Journey Map, Not Log Lines",
    description: "Traces error blast radius end-to-end across services. See the full incident path, not isolated log entries.",
  },
  {
    icon: Ticket,
    title: "Autonomous Ticket Lifecycle",
    description: "Auto-creates PagerDuty, Jira, ServiceNow, and Zammad tickets with root cause context and suggested fixes.",
  },
  {
    icon: Lock,
    title: "Private AI, Zero Egress",
    description: "Fully air-gapped with Ollama in-cluster. Log data never leaves your VPC. Built for fintech and healthcare compliance.",
  },
  {
    icon: Bot,
    title: "Enterprise Portal",
    description: "GitHub App onboarding wizard, multi-tenant dashboard, integration health toggles — all in one enterprise-grade UI.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-black relative overflow-hidden py-24">
      {/* Background glow */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-brand-accent/3 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
            Everything an enterprise SRE team needs
          </h2>
          <p className="mt-4 text-text-inverted-secondary text-lg max-w-2xl mx-auto">
            From terascale log ingestion to autonomous incident resolution — deployed in your cluster, under your control.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-xl bg-brand-accent/20 text-brand-accent mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
