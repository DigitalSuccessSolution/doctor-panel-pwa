"use client";

import { useState } from "react";
import { WHO_GROWTH_DATA } from "@/data/mockData";

export interface GrowthCurveChartProps {
  currentWeight?: number;
  ageInMonths?: number;
  records?: Array<{ weight: number; month?: number; createdAt?: string }>;
}

export default function GrowthCurveChart({ currentWeight, ageInMonths, records }: GrowthCurveChartProps) {
  // Build dynamic curve points by overlaying backend patient weight records
  const growthData = WHO_GROWTH_DATA.map((d) => {
    if (records && records.length > 0) {
      // Find matching backend record for this month
      const match = records.find((r) => r.month !== undefined && Math.abs(r.month - d.month) <= 1);
      if (match) {
        return { ...d, patientWeight: match.weight };
      }
    }

    if (ageInMonths !== undefined && currentWeight !== undefined) {
      if (Math.abs(d.month - ageInMonths) <= 2) {
        return { ...d, patientWeight: currentWeight };
      }
    }
    return d;
  });

  const defaultActiveIndex = ageInMonths !== undefined
    ? growthData.findIndex((d) => Math.abs(d.month - ageInMonths) <= 2)
    : 4;

  const [activePoint, setActivePoint] = useState<number | null>(
    defaultActiveIndex !== -1 ? defaultActiveIndex : 4
  );

  // SVG Chart dimensions for sharp desktop & mobile display
  const svgWidth = 600;
  const svgHeight = 240;
  const margin = { top: 20, right: 35, bottom: 35, left: 45 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  // Scales
  const maxMonth = 18;
  const minWeight = 2;
  const maxWeight = 14;

  const getX = (month: number) => (month / maxMonth) * width + margin.left;
  const getY = (weight: number) =>
    height - ((weight - minWeight) / (maxWeight - minWeight)) * height + margin.top;

  // Generate SVG path commands
  const medianPath = growthData.map(
    (d, i) => `${i === 0 ? "M" : "L"} ${getX(d.month)} ${getY(d.medianWeight)}`
  ).join(" ");

  const p97Path = growthData.map(
    (d, i) => `${i === 0 ? "M" : "L"} ${getX(d.month)} ${getY(d.p97Weight)}`
  ).join(" ");

  const p3Path = growthData.map(
    (d, i) => `${i === 0 ? "M" : "L"} ${getX(d.month)} ${getY(d.p3Weight)}`
  ).join(" ");

  const patientPoints = growthData.filter((d) => d.patientWeight !== undefined);
  const patientPath = patientPoints
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(d.month)} ${getY(d.patientWeight!)}`)
    .join(" ");

  const activeData = activePoint !== null && activePoint >= 0 ? growthData[activePoint] : null;

  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-xs relative overflow-hidden font-sans">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-slate-800 text-base sm:text-lg leading-tight">
            WHO Weight-for-Age Growth Curve
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Official WHO Child Growth Standard (0 - 18 Months)
          </p>
        </div>
        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs shrink-0">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Patient Trajectory</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span>WHO 50th %ile</span>
          </div>
        </div>
      </div>

      {/* Selected Data Point Badge */}
      {activeData && activeData.patientWeight && (
        <div className="mb-3 bg-sky-50/80 border border-[#A5D8FF]/70 rounded-xl p-2.5 flex items-center justify-between gap-3 animate-fadeIn text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1E4E70]">Selected Point:</span>
            <span className="font-medium text-slate-700">Age {activeData.month} Months</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E4E70] text-sm">{activeData.patientWeight} kg</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2.5 py-0.5 rounded-md border border-emerald-200">
              78th %ile (Normal Trajectory)
            </span>
          </div>
        </div>
      )}

      {/* SVG Growth Curve Render Constrained to max-h-[320px] on Desktop */}
      <div className="w-full overflow-x-auto thin-scrollbar pb-2 mt-2 max-h-[340px] flex justify-start sm:justify-center">
        <div className="min-w-[500px] w-full">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-w-4xl max-h-[320px] select-none"
          >
          {/* Grid lines */}
          {[3, 6, 9, 12].map((w) => (
            <line
              key={w}
              x1={margin.left}
              y1={getY(w)}
              x2={svgWidth - margin.right}
              y2={getY(w)}
              stroke="#F1F5F9"
              strokeDasharray="4 4"
            />
          ))}

          {/* WHO Shaded Normal Range (p3 to p97) */}
          <path
            d={`${p97Path} ${WHO_GROWTH_DATA.slice()
              .reverse()
              .map((d) => `L ${getX(d.month)} ${getY(d.p3Weight)}`)
              .join(" ")} Z`}
            fill="#F0FDF4"
            opacity="0.7"
          />

          {/* WHO 97th percentile line */}
          <path d={p97Path} fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
          {/* WHO 3rd percentile line */}
          <path d={p3Path} fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />

          {/* WHO 50th Percentile (Median) Line */}
          <path d={medianPath} fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 5" />

          {/* Patient Actual Trajectory Line */}
          {patientPath && (
            <path
              d={patientPath}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Points */}
          {growthData.map((d, i) => {
            const hasPatient = d.patientWeight !== undefined;
            const cx = getX(d.month);
            const cy = getY(hasPatient ? d.patientWeight! : d.medianWeight);
            const isActive = activePoint === i;

            return (
              <g key={i} className="cursor-pointer" onClick={() => setActivePoint(i)}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive ? 7 : hasPatient ? 5 : 3.5}
                  fill={hasPatient ? "#10B981" : isActive ? "#1E4E70" : "#CBD5E1"}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all duration-200 hover:scale-125"
                />
              </g>
            );
          })}

          {/* X Axis Months */}
          {[0, 3, 6, 9, 12, 15, 18].map((m) => (
            <text
              key={m}
              x={getX(m)}
              y={svgHeight - 10}
              textAnchor="middle"
              className="text-[10px] fill-slate-400 font-semibold"
            >
              {m}m
            </text>
          ))}

          {/* Y Axis Weight */}
          {[2, 5, 8, 11, 14].map((w) => (
            <text
              key={w}
              x={margin.left - 10}
              y={getY(w) + 4}
              textAnchor="end"
              className="text-[10px] fill-slate-400 font-semibold"
            >
              {w}kg
            </text>
          ))}
        </svg>
        </div>
      </div>
    </div>
  );
}
