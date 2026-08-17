"use client";

import { Scale, Trash2, Plus } from "lucide-react";
import { Patient } from "@/data/mockData";
import { GrowthRecord } from "@/services/growthService";
import GrowthCurveChart from "@/components/GrowthCurveChart";

interface GrowthTabProps {
  patient: Patient;
  growthRecords: GrowthRecord[];
  growthLoading: boolean;
  logWeight: string;
  setLogWeight: (v: string) => void;
  logHeight: string;
  setLogHeight: (v: string) => void;
  logHead: string;
  setLogHead: (v: string) => void;
  logNotes: string;
  setLogNotes: (v: string) => void;
  savingGrowth: boolean;
  handleLogVitals: (e: React.FormEvent) => void;
  handleDeleteGrowth: (id: string) => void;
}

export default function GrowthTab({
  patient,
  growthRecords,
  growthLoading,
  logWeight,
  setLogWeight,
  logHeight,
  setLogHeight,
  logHead,
  setLogHead,
  logNotes,
  setLogNotes,
  savingGrowth,
  handleLogVitals,
  handleDeleteGrowth,
}: GrowthTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left WHO Growth Curve Chart */}
      <div className="lg:col-span-7 space-y-6">
        <GrowthCurveChart
          currentWeight={patient.weight !== undefined ? Number(patient.weight) : undefined}
          ageInMonths={patient.ageInMonths !== undefined ? Number(patient.ageInMonths) : undefined}
          records={growthRecords.map((r) => ({ weight: r.weight, month: r.headCircumference }))}
        />

        {/* Table of previous growth logs */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Vitals & Growth History List
          </h3>

          {growthLoading ? (
            <p className="text-center text-xs text-slate-400 py-6">Loading logs...</p>
          ) : growthRecords.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6">No previous vitals records logged yet.</p>
          ) : (
            <div className="overflow-x-auto thin-scrollbar pb-2">
              <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Weight (kg)</th>
                    <th className="py-2.5 px-3">Height (cm)</th>
                    <th className="py-2.5 px-3">Head Circ. (cm)</th>
                    <th className="py-2.5 px-3 min-w-[150px]">Notes</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {growthRecords.map((rec) => (
                    <tr key={rec._id || rec.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3">
                        {rec.createdAt ? String(rec.createdAt).split("T")[0] : "N/A"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-900">{rec.weight} kg</td>
                      <td className="py-2.5 px-3">{rec.height} cm</td>
                      <td className="py-2.5 px-3">{rec.headCircumference ? `${rec.headCircumference} cm` : "—"}</td>
                      <td className="py-2.5 px-3 font-normal text-slate-500 max-w-[200px] truncate">
                        {rec.notes || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteGrowth(rec._id || rec.id!)}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Log Vitals Form */}
      <div className="lg:col-span-5">
        <form
          onSubmit={handleLogVitals}
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-4"
        >
          <h3 className="font-bold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-2 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#1E4E70]" />
            <span>Log Vitals & Growth</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Weight (kg) *</label>
              <input
                required
                type="number"
                step="0.01"
                value={logWeight}
                onChange={(e) => setLogWeight(e.target.value)}
                placeholder="e.g. 7.2"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Height (cm) *</label>
              <input
                required
                type="number"
                step="0.1"
                value={logHeight}
                onChange={(e) => setLogHeight(e.target.value)}
                placeholder="e.g. 64"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700">Head Circumference (cm, optional)</label>
            <input
              type="number"
              step="0.1"
              value={logHead}
              onChange={(e) => setLogHead(e.target.value)}
              placeholder="e.g. 42.5"
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
            />
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700">Consultation Observations / Notes</label>
            <textarea
              rows={2}
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              placeholder="Growth comments..."
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
            />
          </div>

          <button
            type="submit"
            disabled={savingGrowth || !logWeight || !logHeight}
            className="w-full bg-[#1E4E70] text-white hover:bg-[#153852] text-xs font-semibold py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{savingGrowth ? "Logging Vital..." : "Log Growth Record"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
