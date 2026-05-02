import { Users, User, Accessibility, Archive, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MetricProps = {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  color: "blue" | "emerald" | "violet" | "amber";
  sparklineData: number[];
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 30;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return { x, y };
  });

  // Create curved path using cubic bezier
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  // Create fill path closing at the bottom
  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const colorMap = {
    blue: { stroke: "#6366f1", rgb: "99, 102, 241" }, // Indigo for a vibrant look
    emerald: { stroke: "#10b981", rgb: "16, 185, 129" },
    violet: { stroke: "#8b5cf6", rgb: "139, 92, 246" },
    amber: { stroke: "#f97316", rgb: "249, 115, 22" }, // Orange
  };

  const theme = colorMap[color as keyof typeof colorMap] || colorMap.blue;
  const gradientId = `sparkline-gradient-${color}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`rgba(${theme.rgb}, 0.25)`} />
          <stop offset="100%" stopColor={`rgba(${theme.rgb}, 0)`} />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${gradientId})`} stroke="none" />
      <path
        d={pathD}
        fill="none"
        stroke={theme.stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetricCard({ label, value, description, icon: Icon, color, sparklineData }: MetricProps) {
  const colorStyles = {
    blue: "bg-blue-600 text-white",
    emerald: "bg-emerald-500 text-white",
    violet: "bg-violet-500 text-white",
    amber: "bg-amber-500 text-white",
  };

  return (
    <article className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5">
      <div className="flex items-center gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", colorStyles[color])}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{label}</h3>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[var(--text)]">{value}</span>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">{description}</p>
        </div>
      </div>
      <div className="ml-4 shrink-0 opacity-80">
        <Sparkline data={sparklineData} color={color} />
      </div>
    </article>
  );
}

type ResidentsMetricsProps = {
  metrics: {
    total: number;
    seniors: number;
    pwd: number;
    voters: number;
  };
};

export function ResidentsMetrics({ metrics }: ResidentsMetricsProps) {
  // Mock sparkline data to match the visual reference
  const sparklineData = {
    total: [4, 6, 5, 8, 7, 10, 9, 12],
    seniors: [2, 3, 2, 4, 3, 5, 4, 6],
    pwd: [1, 1, 2, 1, 2, 2, 3, 2],
    voters: [3, 4, 3, 5, 4, 6, 5, 7],
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Total Residents"
        value={metrics.total}
        description="All registered residents"
        icon={Users}
        color="blue"
        sparklineData={sparklineData.total}
      />
      <MetricCard
        label="Seniors (60+)"
        value={metrics.seniors}
        description="60 years old and above"
        icon={User}
        color="emerald"
        sparklineData={sparklineData.seniors}
      />
      <MetricCard
        label="PWD"
        value={metrics.pwd}
        description="Persons with Disability"
        icon={Accessibility}
        color="violet"
        sparklineData={sparklineData.pwd}
      />
      <MetricCard
        label="Registered Voters"
        value={metrics.voters}
        description="Registered voters"
        icon={Archive}
        color="amber"
        sparklineData={sparklineData.voters}
      />
    </div>
  );
}
