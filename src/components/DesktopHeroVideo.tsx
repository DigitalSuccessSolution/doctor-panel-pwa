"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Pause, ArrowRight, Download, Baby, CheckCircle2, ShieldCheck, Sparkles, Activity, TrendingUp } from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function DesktopHeroVideo({ onOpenApk }: { onOpenApk: () => void }) {
  const { setShowLoginModal } = useDoctorData();
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative w-full py-10 xl:py-14 grid grid-cols-12 gap-10 items-center">
      {/* Background Soft Mesh Glow Gradient (Apple Light Aesthetic) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-sky-100/60 via-[#F5F5F7] to-indigo-100/50 rounded-3xl blur-3xl" />

      {/* LEFT COLUMN: Typography & CTAs */}
      <div className="col-span-12 lg:col-span-6 space-y-6">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-[#0071E3] text-xs font-semibold px-4 py-1.5 rounded-full border border-sky-200/80 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#0071E3]" />
          <span>PEDIATRIC CLINICAL SUITE • WHO 2026 ENGINE</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl xl:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.12]">
          Empowering Pediatricians With{" "}
          <span className="bg-gradient-to-r from-[#1E4E70] via-[#0071E3] to-emerald-600 bg-clip-text text-transparent block mt-1">
            Automated WHO Growth Curves
          </span>
        </h1>

        <p className="text-base text-slate-600 leading-relaxed font-normal max-w-lg">
          Seamlessly manage newborn files, calculate WHO z-score growth percentiles, generate signed e-prescriptions, and work offline with cloud sync.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-[#0071E3]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
          >
            <span>ACCESS PATIENT DIRECTORY</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={onOpenApk}
            className="bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-800 font-semibold text-sm px-6 py-3.5 rounded-full transition-all cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#0071E3]" />
            <span>Download APK</span>
          </button>
        </div>

        {/* Stat Indicators */}
        <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80">
          <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/60 shadow-2xs">
            <p className="text-2xl font-semibold text-[#1E4E70]">2,500+</p>
            <p className="text-[11px] text-slate-500 font-semibold">Active Doctors</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/60 shadow-2xs">
            <p className="text-2xl font-semibold text-emerald-600">WHO 2026</p>
            <p className="text-[11px] text-slate-500 font-semibold">Z-Score Engine</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/60 shadow-2xs">
            <p className="text-2xl font-semibold text-[#0071E3]">100% Secure</p>
            <p className="text-[11px] text-slate-500 font-semibold">Offline Ready</p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Live Video Canvas & Floating Glass Widgets */}
      <div className="col-span-12 lg:col-span-6 relative">
        {/* Device Canvas Frame */}
        <div className="bg-white/90 backdrop-blur-2xl p-3 rounded-3xl border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] relative group">
          {/* Inner Video / Photography Frame */}
          <div className="relative h-[430px] rounded-2xl overflow-hidden bg-slate-950">
            <Image
              src="/hero_doctor.png"
              alt="Clinical Pediatric OPD Demonstration Video"
              fill
              className={`object-cover transition-all duration-700 ${
                isPlaying ? "scale-105 contrast-[1.05]" : "brightness-75 filter grayscale-[20%]"
              }`}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

            {/* Video Play / Pause Center Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md border-2 border-white text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl cursor-pointer group-hover:bg-white/50"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white pl-1" />}
              </button>
            </div>

            {/* FLOATING GLASS WIDGET 1: Top Left Assigned Patient */}
            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-xl rounded-2xl p-3 border border-white/80 shadow-xl flex items-center gap-3 animate-slideDown">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=150"
                  alt="Leo Henderson"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-xs">Leo Henderson (4m)</p>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  WHO 85th Percentile ✓
                </p>
              </div>
            </div>

            {/* FLOATING GLASS WIDGET 2: Bottom Right Real-Time Z-Score */}
            <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 backdrop-blur-xl text-white rounded-2xl p-3.5 border border-white/20 shadow-2xl flex items-center gap-3 animate-slideUp">
              <div className="w-9 h-9 rounded-xl bg-[#0071E3] flex items-center justify-center shrink-0 shadow-sm">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-xs">WHO Z-Score Velocity</p>
                <p className="text-[11px] text-emerald-400 font-semibold">+1.8 SD • Faltering Alert: Normal</p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
