"use client";

import { PlusCircle, Utensils, Search, Trash2, FileText, Save, CheckCircle2 } from "lucide-react";
import { Patient } from "@/data/mockData";
import { getPatientNutrientGoals, nutritionService } from "@/services/nutritionService";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface NutritionTabProps {
  patient: Patient;
  patientId: string;
  nutritionPlan: any;
  setNutritionPlan: (plan: any) => void;
  nutritionLoading: boolean;
  nutritionGuidelines: string;
  setNutritionGuidelines: (v: string) => void;
  nutritionSchedule: Array<{ day: string; title: string; desc: string; mealId?: string }>;
  setNutritionSchedule: (schedule: any[]) => void;
  savingNutrition: boolean;
  setSavingNutrition: (v: boolean) => void;
  nutritionDayTab: string;
  setNutritionDayTab: (v: string) => void;
  plannerSelectedDay: string;
  setPlannerSelectedDay: (v: string) => void;
  allMeals: any[];
  mealsLoading: boolean;
  catalogSearchTerm: string;
  setCatalogSearchTerm: (v: string) => void;
  plannerSuccessMsg: string;
  setPlannerSuccessMsg: (v: string) => void;
  savingGuidelines: boolean;
  handleSaveGuidelines: () => void;
  handleRemoveMealFromDay: (index: number) => void;
}

export default function NutritionTab({
  patient,
  patientId,
  nutritionPlan,
  setNutritionPlan,
  nutritionLoading,
  nutritionGuidelines,
  setNutritionGuidelines,
  nutritionSchedule,
  setNutritionSchedule,
  savingNutrition,
  setSavingNutrition,
  nutritionDayTab,
  setNutritionDayTab,
  plannerSelectedDay,
  setPlannerSelectedDay,
  allMeals,
  mealsLoading,
  catalogSearchTerm,
  setCatalogSearchTerm,
  plannerSuccessMsg,
  setPlannerSuccessMsg,
  savingGuidelines,
  handleSaveGuidelines,
  handleRemoveMealFromDay,
}: NutritionTabProps) {
  // Calculate dynamic nutrient totals based on actual assigned meals
  const summary = (() => {
    const goals = getPatientNutrientGoals(patient);
    const activeMeals = nutritionSchedule.filter((s) => {
      if (!s.title || s.title.trim() === "") return false;
      if (nutritionDayTab === "All Days") return true;
      return s.day.toLowerCase() === nutritionDayTab.toLowerCase();
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;

    activeMeals.forEach((s) => {
      const meal = allMeals.find((m) => (m._id || m.id) === s.mealId);
      if (meal && meal.nutritionalInfo) {
        totalCalories += Number(meal.nutritionalInfo.calories || 0);
        totalProtein += Number(meal.nutritionalInfo.protein || 0);
        totalFat += Number(meal.nutritionalInfo.fat || 0);
      } else {
        totalCalories += 140;
        totalProtein += 3.5;
        totalFat += 2.5;
      }
    });

    const factor = nutritionDayTab === "All Days" ? 7 : 1;
    const avgCalories = Math.round(totalCalories / factor);
    const avgProtein = Math.round((totalProtein / factor) * 10) / 10;
    const avgFat = Math.round((totalFat / factor) * 10) / 10;

    const calPercent = Math.min(100, Math.round((avgCalories / goals.targetCalories) * 100));
    const proteinPercent = Math.min(100, Math.round((avgProtein / goals.targetProtein) * 100));
    const fatPercent = Math.min(100, Math.round((avgFat / 10) * 100));

    return {
      avgCalories,
      avgProtein,
      avgFat,
      calPercent,
      proteinPercent,
      fatPercent,
      targetCalories: goals.targetCalories,
      targetProtein: goals.targetProtein,
      targetFat: 10,
    };
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Nutrient Targets & Weaning Catalog */}
      <div className="lg:col-span-4 space-y-4">
        {/* Dynamic WHO Nutrient Target Progress Card */}
        <div className="bg-[#1E4E70] text-white rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider">Nutrient Targets</h3>
              <p className="text-[10px] text-slate-300 font-medium">Assigned plan vs WHO Goals</p>
            </div>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded border border-white/30">
              {nutritionDayTab}
            </span>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* Calories */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>Daily Target Calories</span>
                <span>
                  {summary.avgCalories} / {summary.targetCalories} kcal
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${summary.calPercent}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>Daily Target Protein</span>
                <span>
                  {summary.avgProtein} / {summary.targetProtein} g
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${summary.proteinPercent}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>Healthy Dietary Fats</span>
                <span>
                  {summary.avgFat} / {summary.targetFat} g
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${summary.fatPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Weaning Foods Catalog Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
          <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between gap-2">
            <span className="font-bold text-slate-800 uppercase block tracking-wider text-[10px]">Weaning Catalog</span>
            <span className="bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded text-[9px] border border-slate-200">
              {allMeals.length} Items
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search catalog meals..."
              value={catalogSearchTerm}
              onChange={(e) => setCatalogSearchTerm(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#1E4E70]"
            />
          </div>

          <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {mealsLoading ? (
              <p className="text-center text-slate-400 text-[10px] py-4">Loading catalog...</p>
            ) : allMeals.filter((m) => m.name.toLowerCase().includes(catalogSearchTerm.toLowerCase())).length === 0 ? (
              <p className="text-center text-slate-400 text-[10px] py-4 italic">No matching catalog meals.</p>
            ) : (
              allMeals
                .filter((m) => m.name.toLowerCase().includes(catalogSearchTerm.toLowerCase()))
                .map((m) => (
                  <div
                    key={m._id || m.id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-all flex items-start justify-between gap-3 text-left"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 text-[11px] truncate">{m.name}</span>
                        <span className="text-[9px] font-extrabold text-[#1E4E70] bg-[#F0F7FF] px-1.5 py-0.5 rounded border border-[#BEE0FF] shrink-0 capitalize">
                          {m.suitableForAgeGroup || "6-12m"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{m.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        setSavingNutrition(true);
                        setPlannerSuccessMsg("");
                        try {
                          const newScheduleItem = {
                            day: plannerSelectedDay,
                            mealId: m._id || m.id,
                          };
                          const scheduleItems = nutritionSchedule
                            .filter((s) => s.mealId && s.mealId.trim() !== "")
                            .map((s) => ({
                              day: s.day,
                              mealId: s.mealId,
                            }));
                          scheduleItems.push(newScheduleItem);

                          let res;
                          if (nutritionPlan && (nutritionPlan.id || nutritionPlan._id)) {
                            res = await nutritionService.updateNutritionPlan(nutritionPlan.id || nutritionPlan._id, {
                              babyId: patientId,
                              guidelines: nutritionGuidelines.trim(),
                              weeklySchedule: scheduleItems,
                            });
                          } else {
                            res = await nutritionService.createNutritionPlan({
                              babyId: patientId,
                              guidelines: nutritionGuidelines.trim(),
                              weeklySchedule: scheduleItems,
                            });
                          }

                          if (res.success && res.data) {
                            setNutritionPlan(res.data);
                            setPlannerSuccessMsg(`Added ${m.name} to ${plannerSelectedDay}!`);
                            setTimeout(() => setPlannerSuccessMsg(""), 4000);
                          }
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setSavingNutrition(false);
                        }
                      }}
                      disabled={savingNutrition}
                      className="bg-[#1E4E70] text-white hover:bg-[#153852] font-bold text-[9px] px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer disabled:opacity-50 mt-0.5"
                    >
                      + Add
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Planner & Weekly Active Board */}
      <div className="lg:col-span-8 space-y-6">
        {/* Day-Wise Meal Plan Assigner Form Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
                <PlusCircle className="w-4.5 h-4.5 text-[#1E4E70]" />
                <span>Configure Day-Wise Meal Target</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Select a week day below to view and assign multiple weaning foods</p>
            </div>
          </div>

          {/* Day selector button row */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Target Week Day</label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-[11px] font-bold">
              {DAYS_OF_WEEK.map((day) => {
                const dayMealsCount = nutritionSchedule.filter((s) => s.day.toLowerCase() === day.toLowerCase()).length;
                const isSelected = plannerSelectedDay === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setPlannerSelectedDay(day)}
                    className={`px-3 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#1E4E70] text-white border-[#1E4E70] shadow-2xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80"
                    }`}
                  >
                    <span>{day}</span>
                    {dayMealsCount > 0 && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          isSelected ? "bg-white text-[#1E4E70]" : "bg-[#1E4E70] text-white"
                        }`}
                      >
                        {dayMealsCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of currently assigned meals for selected day */}
          <div className="space-y-2 border-t border-slate-100 pt-3.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Currently Assigned for {plannerSelectedDay}
            </label>
            {(() => {
              const assigned = nutritionSchedule
                .map((s, idx) => ({ ...s, originalIdx: idx }))
                .filter((s) => s.day.toLowerCase() === plannerSelectedDay.toLowerCase());

              if (assigned.length === 0) {
                return (
                  <p className="text-slate-400 text-[11px] italic font-medium py-1">
                    No weaning foods assigned for {plannerSelectedDay} yet. Click Weaning Catalog meals on the left to assign.
                  </p>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {assigned.map((s) => (
                    <div
                      key={s.originalIdx}
                      className="flex items-start justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 animate-fadeIn"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-xs block truncate">{s.title}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1 leading-normal font-sans">
                          {s.desc || "Assigned weaning meal."}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMealFromDay(s.originalIdx)}
                        disabled={savingNutrition}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                        title="Remove meal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Special Diet Guidelines & Focus Instructions Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-[#1E4E70]" />
              <span>Special Diet Guidelines & Focus Instructions</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              This note is shared directly on the parent's dashboard (e.g. weaning precautions, allergens, hydration guidelines).
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              rows={2}
              value={nutritionGuidelines}
              onChange={(e) => setNutritionGuidelines(e.target.value)}
              placeholder="e.g. Focus on iron-rich foods. Introduce variety of pureed vegetables. Continue formula/breast milk..."
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70] font-medium leading-relaxed"
            />
            <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <p className="text-[10px] text-slate-500 font-medium italic">
                Click save to publish these instructions to the parent's mobile app.
              </p>
              <button
                type="button"
                onClick={handleSaveGuidelines}
                disabled={savingGuidelines}
                className="bg-[#1E4E70] hover:bg-[#153852] text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-3xs shrink-0 ml-auto"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingGuidelines ? "Saving Guidelines..." : "Save Diet Guidelines"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Feeding Schedule board */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 font-sans">
          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
                <Utensils className="w-4.5 h-4.5 text-[#1E4E70]" />
                <span>Weekly Feeding Schedule (Current Active Plan)</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Meals logged/assigned to {patient.name} by doctors and parents</p>
            </div>
          </div>

          {/* Day tabs Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-[11px] font-bold">
            {["All Days", ...DAYS_OF_WEEK].map((day) => {
              const count =
                day === "All Days"
                  ? nutritionSchedule.filter((s) => s.title && s.title.trim() !== "").length
                  : nutritionSchedule.filter((s) => s.day.toLowerCase() === day.toLowerCase() && s.title && s.title.trim() !== "").length;
              const isSelected = nutritionDayTab === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setNutritionDayTab(day)}
                  className={`px-3 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-[#1E4E70] text-white border-[#1E4E70] shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80"
                  }`}
                >
                  {day} {count > 0 ? `(${count})` : ""}
                </button>
              );
            })}
          </div>

          {/* Meal Cards grid */}
          {nutritionLoading ? (
            <p className="text-center text-xs text-slate-400 py-8">Loading schedule...</p>
          ) : nutritionSchedule.filter((s) => {
              if (!s.title || s.title.trim() === "") return false;
              if (nutritionDayTab === "All Days") return true;
              return s.day.toLowerCase() === nutritionDayTab.toLowerCase();
            }).length === 0 ? (
            <div className="text-center py-8 text-slate-400 italic text-xs">
              No active meals scheduled for {nutritionDayTab === "All Days" ? "any day" : nutritionDayTab}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nutritionSchedule
                .map((s, idx) => ({ ...s, originalIdx: idx }))
                .filter((s) => {
                  if (!s.title || s.title.trim() === "") return false;
                  if (nutritionDayTab === "All Days") return true;
                  return s.day.toLowerCase() === nutritionDayTab.toLowerCase();
                })
                .map((s) => (
                  <div
                    key={s.originalIdx}
                    className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-xs transition-shadow relative overflow-hidden"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0 shadow-2xs">
                            <Utensils className="w-4.5 h-4.5 text-amber-700" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-slate-800 text-sm tracking-tight leading-snug truncate">{s.title}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold block">{s.day}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            08:00 AM
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMealFromDay(s.originalIdx)}
                            disabled={savingNutrition}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                            title="Delete from schedule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans min-h-[48px] line-clamp-3">
                        {s.desc || "Assigned weaning meals recommendations."}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[9px] font-bold text-[#1E4E70] bg-[#F0F7FF] border border-[#BEE0FF] px-2 py-0.5 rounded-md">
                        NUTRITION
                      </span>
                      <span className="text-[9px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        PEDIATRIC
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
