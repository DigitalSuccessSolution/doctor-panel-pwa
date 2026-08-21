"use client";

import { useState } from "react";
import { WHO_GROWTH_DATA } from "@/data/mockData";

export interface GrowthCurveChartProps {
  chartType: "weight" | "height";
  currentWeight?: number;
  currentHeight?: number;
  ageInMonths?: number;
  records?: Array<{ weight: number; height?: number; month?: number; createdAt?: string }>;
}

export default function GrowthCurveChart({ chartType, currentWeight, currentHeight, ageInMonths, records }: GrowthCurveChartProps) {

  // Static WHO curve points
  const growthData = WHO_GROWTH_DATA;
  
  // Sort patient records by month so the path draws correctly from left to right
  const patientRecords = (records || []).slice().sort((a, b) => (a.month || 0) - (b.month || 0));

  // If we have actual records, select the latest one by default.
  const defaultActiveIndex = patientRecords.length > 0
    ? patientRecords.length - 1
    : ageInMonths !== undefined
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

  const medianKey = chartType === "weight" ? "medianWeight" : "medianHeight";
  const p97Key = chartType === "weight" ? "p97Weight" : "p97Height";
  const p3Key = chartType === "weight" ? "p3Weight" : "p3Height";
  const patientKey = chartType === "weight" ? "weight" : "height";
  const unit = chartType === "weight" ? "kg" : "cm";

  const validPatientRecords = patientRecords.filter(r => r[patientKey] !== undefined && r.month !== undefined);

  // Scales
  const maxMonth = 18;
  const minY = chartType === "weight" ? 2 : 45;
  
  // Dynamically adjust maxY if patient data exceeds standard bounds
  let maxY = chartType === "weight" ? 14 : 85;
  if (validPatientRecords.length > 0) {
    const maxPatientVal = Math.max(...validPatientRecords.map(r => r[patientKey] as number));
    if (maxPatientVal > maxY) {
      maxY = Math.ceil(maxPatientVal * 1.15); // Add 15% top padding so dot is fully visible
    }
  }

  const getX = (month: number) => (month / maxMonth) * width + margin.left;
  const getY = (val: number) =>
    height - ((val - minY) / (maxY - minY)) * height + margin.top;

  // Generate SVG path commands
  const medianPath = growthData.map(
    (d, i) => `${i === 0 ? "M" : "L"} ${getX(d.month)} ${getY(d[medianKey] as number)}`
  ).join(" ");

  const p97Path = growthData.map(
    (d, i) => `${i === 0 ? "M" : "L"} ${getX(d.month)} ${getY(d[p97Key] as number)}`
  ).join(" ");

  const p3Path = growthData.map(
    (d, i) => `${i === 0 ? "M" : "L"} ${getX(d.month)} ${getY(d[p3Key] as number)}`
  ).join(" ");
  const patientPath = validPatientRecords
    .map((r, i) => `${i === 0 ? "M" : "L"} ${getX(r.month as number)} ${getY(r[patientKey] as number)}`)
    .join(" ");

  // Active data could be a patient record OR a WHO point if no records exist
  const activeData = validPatientRecords.length > 0 
    ? (activePoint !== null && activePoint >= 0 && activePoint < validPatientRecords.length ? validPatientRecords[activePoint] : null)
    : (activePoint !== null && activePoint >= 0 && activePoint < growthData.length ? growthData[activePoint] : null);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden font-sans w-full">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mb-8 text-[11px] font-semibold text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
          <span>Baby's Growth</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#D1FAE5]"></span>
          <span>WHO Normal Range (3rd - 97th)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold tracking-widest leading-none">--</span>
          <span>WHO Average (50th)</span>
        </div>
      </div>

      {/* Selected Data Point Badge */}
      {activeData && (
        <div className="mb-3 bg-sky-50/80 border border-[#A5D8FF]/70 rounded-xl p-2.5 flex items-center justify-between gap-3 animate-fadeIn text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1E4E70]">Selected Point:</span>
            <span className="font-medium text-slate-700">Age {Math.round(activeData.month as number)} Months</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E4E70] text-sm">
              {validPatientRecords.length > 0 
                 ? activeData[patientKey] 
                 : activeData[medianKey as keyof typeof activeData]} {unit}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2.5 py-0.5 rounded-md border border-emerald-200">
              {validPatientRecords.length > 0 ? "Patient Record" : "WHO 50th %ile"}
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
              .map((d) => `L ${getX(d.month)} ${getY(d[p3Key] as number)}`)
              .join(" ")} Z`}
            fill="#D1FAE5"
            opacity="0.6"
          />

          {/* WHO 50th Percentile (Median) Line */}
          <path d={medianPath} fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />

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
          {validPatientRecords.length > 0 ? (
            // Plot actual patient records from API
            validPatientRecords.map((r, i) => {
              const cx = getX(r.month as number);
              const cy = getY(r[patientKey] as number);
              const isActive = activePoint === i;

              return (
                <g key={`patient-${i}`} className="cursor-pointer" onClick={() => setActivePoint(i)}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isActive ? 7 : 5}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-200 hover:scale-125"
                  />
                </g>
              );
            })
          ) : (
            // Fallback to WHO standard median points if no records
            growthData.map((d, i) => {
              const cx = getX(d.month);
              const cy = getY(d[medianKey] as number);
              const isActive = activePoint === i;

              return (
                <g key={`who-${i}`} className="cursor-pointer" onClick={() => setActivePoint(i)}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isActive ? 7 : 3.5}
                    fill={isActive ? "#1E4E70" : "#CBD5E1"}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-200 hover:scale-125"
                  />
                </g>
              );
            })
          )}

          {/* X Axis Months */}
          {[0, 2, 4, 6, 9, 12, 18].map((m) => (
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

          {/* Y Axis Range */}
          {Array.from({ length: 5 }).map((_, idx) => {
            const val = minY + (idx * (maxY - minY)) / 4;
            return (
              <text
                key={val}
                x={margin.left - 10}
                y={getY(val) + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-semibold"
              >
                {Math.round(val)} {unit}
              </text>
            );
          })}
        </svg>
        </div>
      </div>
    </div>
  );
}
