"use client";

import { useRouter } from "next/navigation";
import { Users, ArrowLeft, CheckCircle2, Award, Zap, HeartPulse } from "lucide-react";

export default function DoctorProgramPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/policies");
  };

  return (
    <div className="-mx-4 -mt-6 -mb-6 sm:-mx-6 sm:-mt-6 sm:-mb-6 lg:-mx-8 animate-fadeIn pb-24 font-sans bg-white min-h-screen">

      {/* Clean Partner Benefits List */}
      <div className="space-y-5 text-xs text-slate-700 leading-relaxed px-4 py-6 sm:px-6">
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
  );
}
