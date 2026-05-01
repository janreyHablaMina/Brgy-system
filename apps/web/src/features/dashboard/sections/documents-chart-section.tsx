"use client";

import { useState } from "react";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardOverviewData } from "@/features/dashboard/types";

type DocumentsChartSectionProps = {
  series: DashboardOverviewData["documentSeries"];
};

const CHART_H = 360;
const CHART_PADDING = { top: 16, bottom: 34, left: 8, right: 8 };

export function DocumentsChartSection({ series }: DocumentsChartSectionProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const values = series.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const chartH = CHART_H;
  const innerH = chartH - CHART_PADDING.top - CHART_PADDING.bottom;
  const innerW = 700;

  // Convert data to SVG points
  const points = series.map((d, i) => {
    const x = series.length === 1 ? 50 : (i / (series.length - 1)) * innerW;
    const y = CHART_PADDING.top + innerH - ((d.value - min) / range) * innerH;
    return { x, y, ...d };
  });

  // Build SVG path
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartH - CHART_PADDING.bottom} L ${points[0].x} ${chartH - CHART_PADDING.bottom} Z`;

  // Y-axis labels
  const yLabels = [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0];

  return (
    <WidgetCard
      title="Documents Issued This Week"
      
      action={
        <span className="text-xs font-semibold text-[var(--muted)]">This Week v</span>
      }
    >
      <div className="relative" style={{ height: chartH }}>
        <svg
          viewBox={`-46 0 ${innerW + 64} ${chartH}`}
          className="w-full overflow-visible"
          style={{ height: chartH }}
        >
          {/* Y gridlines */}
          {yLabels.map((label, i) => {
            const y = CHART_PADDING.top + ((max - label) / range) * innerH;
            return (
              <g key={i}>
                <line
                  x1={0}
                  x2={innerW}
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth={0.8}
                  strokeDasharray="4 3"
                />
                <text
                  x={-4}
                  y={y + 4}
                  fontSize={10}
                  fill="var(--muted)"
                  textAnchor="end"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <defs>
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#area-grad)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points + tooltips */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hovered === i ? 5.5 : 4}
                fill={hovered === i ? "var(--primary)" : "#fff"}
                stroke="var(--primary)"
                strokeWidth={2}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              {hovered === i && (
                <g>
                  <rect
                    x={p.x - 24}
                    y={p.y - 34}
                    width={48}
                    height={24}
                    rx={5}
                    fill="var(--primary)"
                  />
                  <text
                    x={p.x}
                    y={p.y - 18}
                    fontSize={9}
                    fill="#fff"
                    textAnchor="middle"
                    fontWeight="700"
                  >
                    {p.day} - {p.value}
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* X axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={chartH - 4}
              fontSize={10}
              fill="var(--muted)"
              textAnchor="middle"
            >
              {p.day}
            </text>
          ))}
        </svg>
      </div>
    </WidgetCard>
  );
}

