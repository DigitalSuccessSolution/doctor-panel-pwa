"use client";

import { useRouter } from "next/navigation";
import { FileText, ArrowLeft, CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";

export default function TermsOfServicePage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/policies");
  };

  return (
    <div className="-mx-4 -mt-6 -mb-6 sm:-mx-6 sm:-mt-6 sm:-mb-6 lg:-mx-8 animate-fadeIn pb-24 font-sans bg-white min-h-screen">

      {/* Clean Terms Content */}
      <div className="space-y-6 text-xs text-slate-700 leading-relaxed px-4 py-6 sm:px-6">
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
  );
}
