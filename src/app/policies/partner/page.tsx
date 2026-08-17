"use client";

import { useRouter } from "next/navigation";
import { Users, ArrowLeft, CheckCircle2, Award, Zap, HeartPulse } from "lucide-react";

export default function DoctorProgramPage() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/profile");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-24 font-sans">
      <div className="bg-white rounded-xl p-5 sm:p-7 border border-slate-200/80 shadow-card space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-lg bg-[#F8F9FA] hover:bg-[#A5D8FF]/30 text-slate-700 hover:text-[#1E4E70] flex items-center justify-center transition-all shrink-0 cursor-pointer border border-slate-200/60"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-semibold text-slate-900 tracking-tight leading-snug truncate">
                Doctor Partner Program
              </h1>
              <p className="text-xs font-medium text-slate-500 truncate">
                Empowering 2,500+ pediatricians across India
              </p>
            </div>
          </div>

          <span className="bg-purple-50 text-purple-700 border border-purple-200/80 px-3 py-1 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>Verified Network</span>
          </span>
        </div>

        {/* Clean Partner Benefits List */}
        <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
          <div className="border-l-2 border-[#1E4E70] pl-4 space-y-1">
            <p className="font-semibold text-[#1E4E70] flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#1E4E70]" />
              <span>WHO Percentile Analytics</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated z-score engine for length, weight, and head circumference velocity tracking against WHO standards.
            </p>
          </div>

          <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
            <p className="font-semibold text-emerald-700 flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Digital e-Prescriptions</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Formats liquid medicine dosages automatically and dispatches digital prescription PDFs directly to parent's WhatsApp.
            </p>
          </div>

          <div className="border-l-2 border-purple-500 pl-4 space-y-1">
            <p className="font-semibold text-purple-700 flex items-center gap-2 text-xs sm:text-sm">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>PWA Offline Convenience</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Record SOAP notes during busy OPD consultations with zero latency, even when Wi-Fi is disconnected.
            </p>
          </div>

          <div className="border-l-2 border-amber-500 pl-4 space-y-1">
            <p className="font-semibold text-amber-700 flex items-center gap-2 text-xs sm:text-sm">
              <HeartPulse className="w-4 h-4 text-amber-600" />
              <span>Cloud Kitchen Sync</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prescribe hygienic weaning meals prepared by certified nutritionists to support undernourished infants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
