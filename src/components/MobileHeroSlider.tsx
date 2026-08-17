"use client";

import { Stethoscope, ArrowRight, User } from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function MobileHeroSlider() {
  const { setShowLoginModal } = useDoctorData();

  return (
    <div className="relative pt-18 sm:pt-22 font-sans">
      {/* 3D Overlapping Card Container (Overflow Visible allows doctor head to pop out top edge) */}
      <div className="relative bg-gradient-to-br from-[#1E4E70] via-[#153852] to-[#0F293D] rounded-xl p-4.5 sm:p-6 text-white shadow-xl overflow-visible border border-[#A5D8FF]/30 min-h-[185px] sm:min-h-[205px] flex items-center justify-between">
        {/* Background Decorative Mesh Blur */}
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#A5D8FF]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Clean Professional Content & Compact Action Button */}
        <div className="w-[54%] sm:w-[58%] min-w-0 space-y-2 z-10">
          {/* Top OPD Badge */}
          <span className="inline-flex items-center gap-1.5 bg-[#A5D8FF]/20 text-[#A5D8FF] font-bold text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full border border-[#A5D8FF]/40 backdrop-blur-md uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5 shrink-0 text-[#A5D8FF]" />
            <span>Pediatric OPD</span>
          </span>

          {/* Main Headline */}
          <h2 className="text-sm sm:text-base font-bold text-white leading-snug tracking-tight">
            WHO Growth & OPD Suite
          </h2>

          {/* Subtitle Text */}
          <p className="text-[10px] sm:text-xs text-slate-200/90 leading-tight line-clamp-2">
            Growth velocity, e-prescriptions & z-score analytics.
          </p>

          {/* Compact Action CTA Button (Zero Overlap with Doctor Image) */}
          <div className="pt-1">
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#C53030] to-[#E53E3E] hover:from-[#A82828] hover:to-[#C53030] text-white font-bold text-[10px] sm:text-xs px-3 py-1.5 rounded-lg shadow-md cursor-pointer active:scale-95 transition-all border border-rose-400/30 whitespace-nowrap"
            >
              <User className="w-3 h-3 shrink-0" />
              <span>Login</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </button>
          </div>
        </div>

        {/* Right Side: 3D Doctor Image (Shifted -right-3 for Extra Clearance) */}
        <div className="absolute -right-3 sm:-right-4 bottom-0 z-20 pointer-events-none flex items-end justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/heroimg1.png"
            alt="Pediatrician Doctor"
            className="h-[275px] sm:h-[330px] w-auto object-contain object-bottom drop-shadow-2xl transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
