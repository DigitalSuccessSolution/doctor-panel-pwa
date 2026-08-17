"use client";

import { useRouter } from "next/navigation";
import { FileText, ArrowLeft, CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";

export default function TermsOfServicePage() {
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
                Terms of Service
              </h1>
              <p className="text-xs font-medium text-slate-500 truncate">
                Practitioner agreement & clinical guidelines
              </p>
            </div>
          </div>

          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-3 py-1 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Agreement</span>
          </span>
        </div>

        {/* Clean Terms Content */}
        <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="border-l-2 border-[#1E4E70] pl-4 space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
              <UserCheck className="w-4 h-4 text-[#1E4E70]" />
              <span>1. Practitioner Verification & Council Registration</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Doctors registering on Moncradel must possess a valid Medical Council registration (MD / DCH / MBBS / DNB) for issuing digital prescriptions and conducting consultations.
            </p>
          </div>

          <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Clinical Care Responsibility</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Moncradel provides WHO growth velocity calculators, diet planners, and digital prescription software to streamline OPD workflows. Final clinical diagnosis and treatment remain the sole responsibility of the physician.
            </p>
          </div>

          <div className="border-l-2 border-purple-500 pl-4 space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>3. Digital e-Prescriptions Guidelines</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Digital e-prescriptions generated via the portal must conform to liquid medicine dosing standards and reflect genuine clinical evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
