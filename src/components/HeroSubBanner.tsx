"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function HeroSubBanner({ onOpenApk }: { onOpenApk: () => void }) {
  const { setShowLoginModal } = useDoctorData();

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-gradient-to-r from-slate-900 via-[#1E4E70] to-[#0071E3] text-white p-6 xl:p-8 transition-all duration-300">
      <div className="absolute inset-0 z-0">
        <Image
          src="/opd_banner.png"
          alt="Pediatric OPD Consultation Banner"
          fill
          className="object-cover opacity-20 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/50" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 bg-[#0071E3] text-white font-semibold text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            <Zap className="w-3 h-3 fill-white" />
            Child Patient Network
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Instant OPD Intake & WHO Percentile Alerts
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Pre-loaded child birth records, 15th/85th z-score triggers, and direct WhatsApp e-prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Access Children</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
