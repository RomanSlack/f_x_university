"use client";

const colorMap: Record<string, string> = {
  critical: "text-[var(--critical)]",
  high: "text-[var(--high)]",
  moderate: "text-[var(--moderate)]",
  low: "text-[var(--low)]",
  safe: "text-[var(--safe)]",
};

const dotMap: Record<string, string> = {
  critical: "bg-[var(--critical)]",
  high: "bg-[var(--high)]",
  moderate: "bg-[var(--moderate)]",
  low: "bg-[var(--low)]",
  safe: "bg-[var(--safe)]",
};

export function ScoreBadge({
  score,
  color,
  size = "md",
}: {
  score: number;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-5xl",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-semibold ${colorMap[color] || ""} ${sizeClasses[size]}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotMap[color] || ""} ${size === "lg" ? "w-3 h-3" : ""}`} />
      {score}
    </span>
  );
}
