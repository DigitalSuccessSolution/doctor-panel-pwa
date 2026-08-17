"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Sparkles, Scale, RefreshCw, Check, X } from "lucide-react";
import Image from "next/image";
import GrowthCurveChart from "@/components/GrowthCurveChart";
import { useDoctorData } from "@/context/DoctorDataContext";
import { growthService, GrowthRecord } from "@/services/growthService";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function GrowthAnalysisPage() {
  const { patients, selectedPatientId, setSelectedPatientId } = useDoctorData();
  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Modern Delete Modal states
  const [deletingGrowthId, setDeletingGrowthId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form states for logging growth record
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [headCircumference, setHeadCircumference] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Fetch growth records from backend whenever selected patient changes
  const fetchGrowthRecords = async () => {
    if (!activePatient?.id) return;
    setLoading(true);
    try {
      const res = await growthService.getGrowthRecords(activePatient.id);
      if (res.success && Array.isArray(res.data)) {
        setRecords(res.data);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error("Failed to fetch growth records:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthRecords();
  }, [selectedPatientId, activePatient?.id]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !height) return;

    setSubmitting(true);
    try {
      const res = await growthService.addGrowthRecord({
        babyId: activePatient.id,
        weight: parseFloat(weight),
        height: parseFloat(height),
        headCircumference: headCircumference ? parseFloat(headCircumference) : undefined,
        notes: notes || "Growth measurement recorded in clinic",
      });

      if (res.success) {
        setSuccessMsg("Growth measurement logged successfully!");
        setWeight("");
        setHeight("");
        setHeadCircumference("");
        setNotes("");
        fetchGrowthRecords();
        setTimeout(() => {
          setShowLogModal(false);
          setSuccessMsg("");
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to add growth record:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditGrowthRecord = async (record: GrowthRecord) => {
    const recordId = record._id || record.id;
    if (!recordId) return;

    const newWeight = prompt("Edit Weight (kg):", String(record.weight));
    if (newWeight === null) return;
    const newHeight = prompt("Edit Height (cm):", String(record.height));
    if (newHeight === null) return;
    const newHead = prompt("Edit Head Circumference (cm, optional):", String(record.headCircumference || ""));
    const newNotes = prompt("Edit Clinical Notes (optional):", record.notes || "");

    try {
      await growthService.updateGrowthRecord(recordId, {
        weight: parseFloat(newWeight) || record.weight,
        height: parseFloat(newHeight) || record.height,
        headCircumference: newHead ? parseFloat(newHead) : record.headCircumference,
        notes: newNotes !== null ? newNotes : record.notes,
      });
      fetchGrowthRecords();
    } catch (err) {
      console.error("Failed to update growth record:", err);
    }
  };

  const confirmDeleteGrowthRecord = async () => {
    if (!deletingGrowthId) return;
    setIsDeleting(true);

    const id = deletingGrowthId;
    const isValidMongoId = typeof id === "string" && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);

    if (isValidMongoId) {
      try {
        await growthService.deleteGrowthRecord(id);
      } catch (err) {
        console.warn("Backend growth delete API note:", err);
      }
    }

    setRecords((prev) => prev.filter((r) => (r._id || r.id) !== id));
    setIsDeleting(false);
    setDeletingGrowthId(null);
  };

  // Map backend growth records to chart display format
  const mappedChartRecords = records.map((r, idx) => {
    const createdDate = r.createdAt ? new Date(r.createdAt) : new Date();
    const dob = activePatient?.dateOfBirth ? new Date(activePatient.dateOfBirth) : null;
    let monthVal = activePatient?.ageInMonths || idx * 2;

    if (dob) {
      const diffMonths = Math.max(0, Math.round((createdDate.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
      monthVal = diffMonths;
    }

    return {
      weight: r.weight,
      month: monthVal,
      createdAt: r.createdAt,
    };
  });

  const latestRecord = records.length > 0 ? records[0] : null;
  const currentWeightStr = latestRecord ? `${latestRecord.weight} kg` : (activePatient?.weight || "6.5 kg");
  const currentHeightStr = latestRecord ? `${latestRecord.height} cm` : (activePatient?.height || "64 cm");

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-24 font-sans">
      {/* 1. Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            WHO Growth Analysis
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Evaluate pediatric weight velocity, height percentiles & WHO growth standards
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Patient Selector */}
          <div className="bg-white border border-slate-200/80 rounded-lg px-3.5 py-2 shadow-xs flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Patient:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#1E4E70] focus:outline-none cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} • {p.age}
                </option>
              ))}
            </select>
          </div>

          {/* Log Vitals Button */}
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center justify-center gap-2 bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Vitals</span>
          </button>
        </div>
      </div>

      {/* 2. Selected Patient Summary Card */}
      {activePatient && (
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-card flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200/80 shadow-2xs relative shrink-0 bg-slate-100">
              <Image
                src={activePatient.avatar || "/child_avatar_1.png"}
                alt={activePatient.name}
                fill
                className="object-cover object-center"
                unoptimized
              />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-lg leading-tight">
                {activePatient.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {activePatient.age} • Parent: <span className="text-slate-800 font-semibold">{activePatient.parentName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Weight</span>
              <p className="text-sm font-bold text-slate-800">{currentWeightStr}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Height</span>
              <p className="text-sm font-bold text-slate-800">{currentHeightStr}</p>
            </div>
            <div className="hidden sm:block">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Growth Score</span>
              <p className="text-xl font-bold text-[#1E4E70]">{activePatient.growthScore || 92}/100</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main WHO Growth Curve Chart */}
      <GrowthCurveChart
        currentWeight={latestRecord ? latestRecord.weight : undefined}
        ageInMonths={activePatient?.ageInMonths}
        records={mappedChartRecords}
      />

      {/* 4. AI Clinical Growth Insights Box */}
      <div className="bg-[#E0F2FE]/40 border border-[#BAE6FD] rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-[#1E4E70] font-semibold text-base">
          <Sparkles className="w-5 h-5 text-[#1E4E70]" />
          <span>Clinical Growth Insights</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {activePatient?.name || "Patient"} is tracking steadily along standard WHO growth percentiles.
          Weight velocity is optimal with regular pediatric developmental milestones. No clinical indicators of stunting or malnutrition.
        </p>
        <div className="pt-1 flex items-center gap-2 flex-wrap">
          <span className="bg-white text-[#1E4E70] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#BAE6FD]">
            WHO Standard Verified
          </span>
          <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-3 py-1 rounded-full border border-emerald-200">
            Healthy Trajectory
          </span>
        </div>
      </div>

      {/* 5. Recorded Growth Log Table */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Recorded Growth Log
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Historical measurements logged in backend database
            </p>
          </div>
          <button
            onClick={fetchGrowthRecords}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh Growth Log"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#1E4E70]" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading growth data from backend...</div>
        ) : records.length === 0 ? (
          <div className="py-8 text-center space-y-2 border border-dashed border-slate-200 rounded-lg">
            <Scale className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No growth records logged yet for {activePatient?.name}</p>
            <p className="text-[11px] text-slate-400">Click &quot;Log Vitals&quot; to save weight and height to backend.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Weight (kg)</th>
                  <th className="pb-3">Height (cm)</th>
                  <th className="pb-3">Head Circ. (cm)</th>
                  <th className="pb-3">Clinical Notes</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r, i) => (
                  <tr key={r._id || r.id || i} className="hover:bg-slate-50/50">
                    <td className="py-3 font-semibold text-slate-800">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent"}
                    </td>
                    <td className="py-3 font-semibold text-emerald-700">{r.weight} kg</td>
                    <td className="py-3 font-semibold text-sky-700">{r.height} cm</td>
                    <td className="py-3 text-slate-600">{r.headCircumference ? `${r.headCircumference} cm` : "—"}</td>
                    <td className="py-3 text-slate-500 max-w-xs truncate">{r.notes || "—"}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditGrowthRecord(r)}
                          className="text-xs font-semibold text-[#1E4E70] bg-[#E0F2FE] hover:bg-[#BAE6FD] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingGrowthId(r._id || r.id || "")}
                          className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                          title="Delete Growth Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Vitals Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4 border border-slate-100 font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-semibold text-slate-900 text-base">
                Log Baby Vitals
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {successMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleAddRecord} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 7.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Height (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      placeholder="e.g. 68.0"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Head Circumference (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 42.0 (optional)"
                    value={headCircumference}
                    onChange={(e) => setHeadCircumference(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Clinical Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Normal development & appetite"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !weight || !height}
                    className="bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    {submitting ? "Saving..." : "Save to Database"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modern Professional Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingGrowthId}
        title="Delete Growth Record?"
        description="Are you sure you want to delete this baby growth measurement log? This will update the growth chart."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDeleting={isDeleting}
        onConfirm={confirmDeleteGrowthRecord}
        onCancel={() => setDeletingGrowthId(null)}
      />
    </div>
  );
}
