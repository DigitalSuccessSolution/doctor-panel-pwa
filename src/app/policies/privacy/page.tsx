"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, FileText, ArrowLeft, CheckCircle2, Server } from "lucide-react";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/policies");
  };

  return (
    <div className="-mx-4 -mt-6 -mb-6 sm:-mx-6 sm:-mt-6 sm:-mb-6 lg:-mx-8 animate-fadeIn pb-24 font-sans bg-white min-h-screen">

      {/* Clean Article Content */}
      <div className="space-y-6 text-xs text-slate-700 leading-relaxed px-4 py-6 sm:px-6">
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
  );
}
