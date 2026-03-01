"use client";
import { useEffect, useState } from "react";
import KafkaLagChart from "~/components/dashboard/KafkaLagChart";
import MetricCard from "~/components/dashboard/MetricCard";

export default async function KafkaPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  const [data, setData] = useState<Array<{ time: string;[k: string]: string | number }>>([]);
  const topics = ["raw-logs", "enriched-logs", "anomaly-events", "dead-letter-queue"];

  useEffect(() => {
    // Simulate initial demo data
    const now = Date.now();
    const mock = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(now - (20 - i) * 30000).toLocaleTimeString(),
      "raw-logs": Math.floor(Math.random() * 50000 + 1000),
      "enriched-logs": Math.floor(Math.random() * 30000 + 500),
      "anomaly-events": Math.floor(Math.random() * 5000),
      "dead-letter-queue": Math.floor(Math.random() * 100),
    }));
    setData(mock);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Kafka Consumer Lag</h1>
      <p className="text-text-secondary text-sm mb-8">Real-time consumer lag per topic. Updated every 30 seconds.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {topics.map((t) => {
          const latest = data[data.length - 1];
          const lag = latest ? (latest[t] as number) : 0;
          return <MetricCard key={t} label={t} value={lag.toLocaleString()} status={lag > 50000 ? "critical" : lag > 10000 ? "degraded" : "healthy"} />;
        })}
      </div>

      <div className="p-6 bg-white border-2 border-gray-200 rounded-xl">
        <h2 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-500">Lag Over Time</h2>
        <KafkaLagChart data={data} topics={topics} />
      </div>
    </div>
  );
}
