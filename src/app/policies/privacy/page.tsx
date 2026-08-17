"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, FileText, ArrowLeft, CheckCircle2, Server } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                Privacy & Data Security
              </h1>
              <p className="text-xs font-medium text-slate-500 truncate">
                AES-256 encrypted clinical data protection
              </p>
            </div>
          </div>

          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Compliant</span>
          </span>
        </div>

        {/* Clean Article Content */}
        <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="border-l-2 border-[#1E4E70] pl-4 space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
              <Lock className="w-4 h-4 text-[#1E4E70]" />
              <span>1. End-to-End Patient Data Encryption (PHI)</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              All child growth percentile records, SOAP clinical notes, and digital e-prescriptions are encrypted using industry-standard AES-256 bit encryption both in transit (TLS 1.3) and at rest.
            </p>
          </div>

          <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>2. Offline PWA Local Sandbox</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patient records cached offline during clinic OPD visits are isolated strictly to your browser local storage sandbox and automatically sync to cloud servers once network connection is restored.
            </p>
          </div>

          <div className="border-l-2 border-indigo-500 pl-4 space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>3. Exclusive Record Confidentiality</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Medical observations belong exclusively to the consulting doctor and registered parent. Moncradel never sells or monetizes patient health data with third-party advertisers.
            </p>
          </div>

          <div className="border-l-2 border-purple-500 pl-4 space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>4. Regulatory Compliance</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our clinical database infrastructure complies with Digital Personal Data Protection (DPDP) regulations and Telemedicine Practice Guidelines issued by the Medical Council.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
