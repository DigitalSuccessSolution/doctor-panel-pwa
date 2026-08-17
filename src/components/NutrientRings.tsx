"use client";

import { Flame, Dumbbell, Droplet, Info } from "lucide-react";

interface NutrientRingsProps {
  calories?: number;
  protein?: number;
  iron?: number;
  achievementPercent?: number;
  percentage?: number;
}

export default function NutrientRings({
  calories = 1650,
  protein = 55,
  iron = 18,
  achievementPercent,
  percentage,
}: NutrientRingsProps) {
  const finalAchievement = achievementPercent ?? percentage ?? 88;
  const nutrients = [
    {
      label: "Calories",
      value: `${calories.toLocaleString()} `,
      unit: "Calories",
      percent: 85,
      color: "stroke-[#1E4E70]",
      bgRing: "stroke-[#E2E8F0]",
      icon: Flame,
      iconColor: "text-[#1E4E70]",
    },
    {
      label: "Protein",
      value: `${protein}g `,
      unit: "Protein",
      percent: 90,
      color: "stroke-[#2D6A4F]",
      bgRing: "stroke-[#E2E8F0]",
      icon: Dumbbell,
      iconColor: "text-[#2D6A4F]",
    },
    {
      label: "Iron",
      value: `${iron}mg `,
      unit: "Iron",
      percent: 75,
      color: "stroke-[#8B4513]",
      bgRing: "stroke-[#E2E8F0]",
      icon: Droplet,
      iconColor: "text-[#8B4513]",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-card space-y-5">
      <h3 className="font-semibold text-slate-800 text-lg leading-tight">
        Daily Nutrient Goals
      </h3>

      {/* 3 Circular Rings Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        {nutrients.map((item, index) => {
          const Icon = item.icon;
          const radius = 32;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset =
            circumference - (item.percent / 100) * circumference;

          return (
            <div key={index} className="flex flex-col items-center">
              {/* SVG Ring with centered icon */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    className={`${item.bgRing} stroke-[6] fill-none`}
                  />
                  {/* Progress Fill */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    className={`${item.color} stroke-[6] fill-none transition-all duration-1000 ease-out`}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Centered Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
              </div>

              {/* Label & Values */}
              <p className="font-semibold text-slate-800 text-sm leading-none">
                {item.value}
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {item.unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* Achievement Footer Subtext (Exact match to reference image 2!) */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500 italic">
        <span>&ldquo;Meeting {finalAchievement}% of target&rdquo;</span>
        <Info className="w-4 h-4 text-slate-400 not-italic" />
      </div>
    </div>
  );
}
