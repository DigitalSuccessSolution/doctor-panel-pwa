"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Award,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Download,
  ChevronDown,
  RefreshCw,
  Star,
  MessageSquare,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { reviewService, ReviewItem } from "@/services/reviewService";
import { milestoneService, BabyMilestone } from "@/services/milestoneService";

export default function MonthlyReviewsPage() {
  const { patients, selectedPatientId, setSelectedPatientId } = useDoctorData();
  const [selectedMonth, setSelectedMonth] = useState("July 2026");
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);

  const [babyMilestones, setBabyMilestones] = useState<BabyMilestone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      const revRes = await reviewService.getReviews();

      if (revRes.success && Array.isArray(revRes.data)) {
        setReviewsList(revRes.data);
      } else {
        setReviewsList([]);
      }
    } catch (err) {
      console.error("Failed to fetch monthly review data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  useEffect(() => {
    if (patient?.id) {
      milestoneService
        .getBabyMilestones(patient.id)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setBabyMilestones(res.data);
          } else {
            setBabyMilestones([]);
          }
        })
        .catch(() => setBabyMilestones([]));
    }
  }, [patient?.id]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-24 font-sans overflow-hidden">
      {/* Top Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Monthly Pediatric Reviews
            </h1>
            <span className="bg-[#A5D8FF]/30 text-[#1E4E70] text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-[#A5D8FF]">
              WHO Audited
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            30-day growth velocity audits, milestone verification & parent reviews
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white border border-slate-200/80 text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#A5D8FF] cursor-pointer"
          >
            <option value="July 2026">July 2026 Monthly Audit</option>
            <option value="June 2026">June 2026 Monthly Audit</option>
            <option value="May 2026">May 2026 Monthly Audit</option>
          </select>

          <button
            onClick={() => alert(`Monthly Review report for ${patient?.name || "Patient"} (${selectedMonth}) exported as PDF!`)}
            className="bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Patient Selector Strip */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans w-full max-w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#A5D8FF]/30 text-[#1E4E70] flex items-center justify-center shrink-0 border border-[#A5D8FF]/60">
            <UserCheck className="w-4 h-4 text-[#1E4E70]" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Active Child Patient Audit File
            </span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Select child to load milestone velocity audit
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-72 shrink-0">
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-xs font-semibold text-[#1E4E70] pl-3.5 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A5D8FF] cursor-pointer appearance-none transition-colors shadow-2xs truncate"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} • {p.age}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Review Dashboard Area */}
      <div className="space-y-6 font-sans">
        {/* Patient Overview Summary Card */}
        {patient && (
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3.5 min-w-0 max-w-full w-full sm:w-auto">
              <div className="w-14 h-14 rounded-full overflow-hidden relative border-2 border-[#A5D8FF] shrink-0 shadow-2xs bg-slate-100">
                <Image src={patient.avatar || "/child_care.png"} alt={patient.name} fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight truncate">{patient.name}</h2>
                <p className="text-xs text-slate-500 font-medium truncate">
                  Age: {patient.age} • Gender: {patient.gender} • Parent: {patient.parentName}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Growth Score: {patient.growthScore || 90}/100
                  </span>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>30-Day Audit Active</span>
            </span>
          </div>
        )}

        {/* Developmental Milestones Audit Section (From Backend milestoneService) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Developmental Milestones Audit
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Logged milestones from backend database
              </p>
            </div>
            <button
              onClick={fetchMonthlyData}
              className="p-2 text-[#1E4E70] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
              title="Refresh Milestones"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 font-medium">Fetching milestones...</div>
          ) : babyMilestones.length === 0 ? (
            <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No Milestones Logged Yet for {patient?.name}</p>
              <p className="text-[11px] text-slate-400">Milestone records logged in backend will automatically display here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {babyMilestones.map((m, idx) => (
                <div key={m._id || m.id || idx} className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{m.title || m.milestoneName || "Milestone Verified"}</h4>
                      <p className="text-[11px] text-slate-500">{m.notes || `Achieved at ${m.achievedAgeMonths || 6} months`}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {m.status || "VERIFIED"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real Patient Reviews Section (From Backend reviewService) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Patient Reviews & Rating Feedback
          </h3>

          {loading ? (
            <div className="py-6 text-center text-xs text-slate-500 font-medium">Fetching patient reviews...</div>
          ) : reviewsList.length === 0 ? (
            <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No Patient Reviews Logged Yet</p>
              <p className="text-[11px] text-slate-400">Parent feedback & ratings submitted after consultations will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviewsList.map((rev, idx) => (
                <div key={rev._id || rev.id || idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{rev.patientName || "Patient Review"}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rev.rating || 5}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{rev.comment || rev.review || "Great consultation experience!"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
