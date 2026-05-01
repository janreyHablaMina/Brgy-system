"use client";

import { useMemo, useState, type MouseEvent } from "react";
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
  const points = useMemo(
    () =>
      series.map((d, i) => {
        const x = series.length === 1 ? 50 : (i / (series.length - 1)) * innerW;
        const y = CHART_PADDING.top + innerH - ((d.value - min) / range) * innerH;
        return { x, y, ...d };
      }),
    [series, innerH, range]
  );

  // Build SVG path
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartH - CHART_PADDING.bottom} L ${points[0].x} ${chartH - CHART_PADDING.bottom} Z`;

  // Y-axis labels
  const yLabels = [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0];

  function handleChartHover(event: MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || points.length === 0) {
      return;
    }

    const ratio = (event.clientX - rect.left) / rect.width;
    const xInViewBox = -46 + ratio * (innerW + 64);

    let nearestIndex = 0;
    let nearestDistance = Math.abs(points[0].x - xInViewBox);

    for (let i = 1; i < points.length; i += 1) {
      const distance = Math.abs(points[i].x - xInViewBox);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    setHovered(nearestIndex);
  }

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
          className="w-full overflow-hidden"
          style={{ height: chartH }}
          onMouseMove={handleChartHover}
          onMouseLeave={() => setHovered(null)}
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
              {(() => {
                const previous = i > 0 ? points[i - 1].value : p.value;
                const isUp = p.value > previous;
                const isDown = p.value < previous;
                const trendSymbol = isUp ? "↑" : isDown ? "↓" : "•";
                const trendColor = isUp ? "#22C55E" : isDown ? "#EF4444" : "#94A3B8";

                return (
                  <>
              <circle
                cx={p.x}
                cy={p.y}
                r={hovered === i ? 5.5 : 4}
                fill={hovered === i ? "var(--primary)" : "#fff"}
                stroke="var(--primary)"
                strokeWidth={2}
                className="cursor-pointer transition-all"
              />
              {hovered === i && (
                <g>
                  <rect
                    x={p.x - 27}
                    y={p.y - 40}
                    width={54}
                    height={6}
                    rx={3}
                    fill="rgba(2, 6, 23, 0.35)"
                  />
                  <rect
                    x={p.x - 30}
                    y={p.y - 46}
                    width={60}
                    height={34}
                    rx={8}
                    fill="#0F172A"
                    stroke="#334155"
                    strokeWidth={1}
                  />
                  <text
                    x={p.x}
                    y={p.y - 31}
                    fontSize={8.5}
                    fill="#fff"
                    textAnchor="middle"
                    fontWeight="700"
                  >
                    {p.day}
                  </text>
                  <text
                    x={p.x - 8}
                    y={p.y - 19}
                    fontSize={9}
                    fill={trendColor}
                    textAnchor="middle"
                    fontWeight="700"
                  >
                    {trendSymbol}
                  </text>
                  <text
                    x={p.x + 7}
                    y={p.y - 19}
                    fontSize={9}
                    fill="#E2E8F0"
                    textAnchor="middle"
                    fontWeight="700"
                  >
                    {p.value}
                  </text>
                </g>
              )}
                  </>
                );
              })()}
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

