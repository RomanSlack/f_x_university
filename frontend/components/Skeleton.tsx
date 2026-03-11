"use client";

export function Pulse({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded bg-gray-100 ${className}`} style={style} />
  );
}

export function StatsSkeleton() {
  return (
    <div className="mt-16 space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 text-center space-y-2">
            <Pulse className="h-8 w-16 mx-auto" />
            <Pulse className="h-3 w-24 mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        {[0, 1].map((col) => (
          <div key={col}>
            <Pulse className="h-3 w-20 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-[var(--border)]">
                  <Pulse className="h-4 w-40" />
                  <Pulse className="h-5 w-10" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-[350px] md:h-[480px] rounded-lg bg-gray-50 flex items-end justify-center gap-1 p-8">
        {[25, 30, 28, 35, 55, 40, 32, 45, 50, 38, 42, 48, 60, 52, 58, 65, 55, 70, 62, 75].map((h, i) => (
          <Pulse
            key={i}
            className="w-full"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <Pulse className="h-3 w-48" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Pulse className="h-10 w-full" />
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Pulse key={i} className="h-6 w-20" />
        ))}
      </div>
      <div className="space-y-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-[var(--border)]">
            <Pulse className="h-4 w-6" />
            <Pulse className="h-4 w-44" />
            <Pulse className="h-5 w-12 ml-auto" />
            <Pulse className="h-4 w-10" />
            <Pulse className="h-4 w-10" />
            <Pulse className="h-4 w-16" />
            <Pulse className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalculatorSkeleton() {
  return (
    <div className="space-y-10">
      <div className="text-center py-6 border border-[var(--border)] rounded-lg">
        <Pulse className="h-3 w-20 mx-auto mb-3" />
        <Pulse className="h-12 w-20 mx-auto mb-3" />
        <Pulse className="h-3 w-48 mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-3xl mx-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between">
              <Pulse className="h-4 w-32" />
              <Pulse className="h-4 w-12" />
            </div>
            <Pulse className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DebtClockSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-px bg-[var(--border)]">
      {[0, 1].map((i) => (
        <div key={i} className="bg-white p-8 text-center space-y-4">
          <Pulse className="h-3 w-36 mx-auto" />
          <Pulse className="h-6 w-48 mx-auto mt-4" />
          <Pulse className="h-12 w-56 mx-auto" />
          <Pulse className="h-3 w-40 mx-auto" />
        </div>
      ))}
    </div>
  );
}
