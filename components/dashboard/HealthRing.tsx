"use client";

interface Props {
  health: "healthy" | "degraded" | "critical";
  size?: number;
}

export default function HealthRing({ health, size = 80 }: Props) {
  const color = health === "healthy" ? "#22c55e" : health === "degraded" ? "#eab308" : "#ef4444";
  const label = health === "healthy" ? "Healthy" : health === "degraded" ? "Degraded" : "Critical";
  const radius = (size / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const percent = health === "healthy" ? 1 : health === "degraded" ? 0.6 : 0.25;
  const dash = circumference * percent;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
          {label}
        </text>
      </svg>
    </div>
  );
}
