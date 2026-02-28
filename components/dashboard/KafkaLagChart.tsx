"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DataPoint {
  time: string;
  [topic: string]: string | number;
}

interface Props {
  data: DataPoint[];
  topics: string[];
}

const COLORS = ["#FF5722", "#2196F3", "#4CAF50", "#9C27B0", "#FF9800"];

export default function KafkaLagChart({ data, topics }: Props) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-sm text-gray-400 font-mono">No lag data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: "monospace" }} />
        <YAxis tick={{ fontSize: 10, fontFamily: "monospace" }} />
        <Tooltip
          contentStyle={{ fontSize: 11, fontFamily: "monospace", border: "2px solid black", borderRadius: 8 }}
          formatter={(val: number) => [val.toLocaleString(), "lag"]}
        />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
        {topics.map((topic, i) => (
          <Line
            key={topic}
            type="monotone"
            dataKey={topic}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
