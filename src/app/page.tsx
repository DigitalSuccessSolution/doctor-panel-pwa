"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Calendar,
  TrendingUp,
  Briefcase,
  Edit3,
  ClipboardList,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Clock,
  Stethoscope,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function Dashboard() {
  const { doctorProfile, patients, appointments } = useDoctorData();

  const handleOpenQuickAddTab = (tabName: string) => {
    window.dispatchEvent(
      new CustomEvent("open-quick-add", { detail: { tab: tabName } })
    );
  };

  const todayAppointments = appointments.filter(
    (apt) => apt.date === "2026-07-31" || apt.status === "Upcoming"
  );
  const attentionPatient = patients.find((p) => p.status === "Attention");

  return (
    <div className="space-y-6 animate-fadeIn pb-6 font-sans">
      {/* 1. Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
            Good Morning, {doctorProfile.fullName || "Doctor"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            You have{" "}
            <span className="font-semibold text-[#1E4E70]">
              {todayAppointments.length}
            </span>{" "}
            appointments scheduled for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Sync Active
          </span>
        </div>
      </div>

      {/* 2. Quick Action Cards (Distinct Soft Baby Pastel Themes - Border-Free) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* New Consultation Card - Soft Baby Sky Blue */}
        <button
          onClick={() => handleOpenQuickAddTab("consultation")}
          className="bg-[#F0F7FF] hover:bg-[#E0F0FF] text-left p-5 rounded-3xl transition-colors group cursor-pointer flex flex-col justify-between min-h-[140px] border border-[#BEE0FF]/40"
        >
          <div className="mb-4">
            <Image
              src="/pediatric_consultation.png"
              alt="New Consultation"
              width={56}
              height={56}
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-semibold text-[#1E4E70] text-sm sm:text-base leading-tight">
              New Consultation
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Start patient intake
            </p>
          </div>
        </button>

        {/* Add Notes Card - Soft Baby Lavender */}
        <button
          onClick={() => handleOpenQuickAddTab("note")}
          className="bg-[#FBF7FF] hover:bg-[#F3E8FF] text-left p-5 rounded-3xl transition-colors group cursor-pointer flex flex-col justify-between min-h-[140px] border border-purple-200/30"
        >
          <div className="mb-4">
            <Image
              src="/pediatric_notes.png"
              alt="Add Notes"
              width={56}
              height={56}
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-semibold text-[#5B21B6] text-sm sm:text-base leading-tight">
              Add Notes
            </h3>
            <p className="text-xs text-purple-900/60 font-medium mt-1">
              Update clinical records
            </p>
          </div>
        </button>

        {/* Create Plan Card - Soft Baby Fresh Mint */}
        <button
          onClick={() => handleOpenQuickAddTab("nutrition")}
          className="bg-[#F0FDF4] hover:bg-[#DCFCE7] text-left p-5 rounded-3xl transition-colors group cursor-pointer flex flex-col justify-between min-h-[140px] border border-emerald-200/30"
        >
          <div className="mb-4">
            <Image
              src="/pediatric_diet.png"
              alt="Create Plan"
              width={56}
              height={56}
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-semibold text-[#166534] text-sm sm:text-base leading-tight">
              Create Plan
            </h3>
            <p className="text-xs text-emerald-950/60 font-medium mt-1">
              Pediatric diet & nutrition roadmap
            </p>
          </div>
        </button>
      </div>

      {/* 3. Patient Statistics Grid (Distinct Soft Baby Pastel Themes - Border-Free) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Patients - Soft Baby Warm Peach */}
        <Link
          href="/patients"
          className="bg-[#FFF7ED] hover:bg-[#FFEDD5] rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-colors group min-h-[160px] border border-orange-200/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <Image
                src="/icon_patients_3d.png"
                alt="Total Patients"
                width={56}
                height={56}
                className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                unoptimized
              />
            </div>
            <span className="text-[10px] font-bold text-orange-800 bg-orange-100/60 px-2 py-0.5 rounded-lg border border-orange-200/60">
              Active Directory
            </span>
          </div>
          <div>
            <p className="text-xs text-orange-950/60 font-semibold uppercase tracking-wider">Total Patients</p>
            <p className="text-2xl font-extrabold text-[#9A3412] tracking-tight mt-1">
              {patients.length} Active
            </p>
          </div>
        </Link>

        {/* Today's Appts - Soft Baby Turquoise / Sky */}
        <Link
          href="/appointments"
          className="bg-[#F0F9FF] hover:bg-[#E0F2FE] rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-colors group min-h-[160px] border border-sky-200/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <Image
                src="/icon_appointments_3d.png"
                alt="Today's Appointments"
                width={56}
                height={56}
                className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                unoptimized
              />
            </div>
            <span className="text-[10px] font-bold text-[#0369A1] bg-sky-100/60 px-2 py-0.5 rounded-lg border border-sky-200/60">
              Today's Queue
            </span>
          </div>
          <div>
            <p className="text-xs text-sky-950/60 font-semibold uppercase tracking-wider">Today's Appts</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#0369A1] tracking-tight">
                {todayAppointments.length}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-200">
                ↑20%
              </span>
            </div>
          </div>
        </Link>

        {/* Growth Score Full Card (Clickable Link to Growth Analysis) */}
        <Link
          href="/growth-analysis"
          className="bg-[#1E4E70] hover:bg-[#163852] text-white rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-colors group min-h-[160px] border border-[#1E4E70]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <Image
                src="/icon_growth_score_3d.png"
                alt="WHO Growth Score"
                width={56}
                height={56}
                className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                unoptimized
              />
            </div>
            <span className="text-[10px] font-bold text-[#A5D8FF] bg-white/10 px-2 py-0.5 rounded-lg border border-white/15">
              Clinical Index
            </span>
          </div>
          <div>
            <p className="text-xs text-sky-100/80 font-semibold uppercase tracking-wider">WHO Growth Score</p>
            <p className="text-2xl font-extrabold text-white tracking-tight mt-1">
              94%
            </p>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-2.5 overflow-hidden border border-white/5">
              <div
                className="bg-[#A5D8FF] h-full rounded-full transition-all duration-1000"
                style={{ width: "94%" }}
              ></div>
            </div>
          </div>
        </Link>
      </div>

      {/* Critical Alert Banner (Flat Solid Color, No Shadows) */}
      {attentionPatient && (
        <div className="bg-rose-50 border border-rose-200 border-l-4 border-l-rose-500 rounded-r-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-rose-900 text-xs sm:text-sm truncate">
                  Growth Alert: {attentionPatient.name}
                </span>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                  Score: {attentionPatient.growthScore}/100
                </span>
              </div>
              <p className="text-xs text-rose-800 font-medium leading-relaxed">
                Weight dropped to {attentionPatient.weight}. Immediate pediatric nutrition & diet review advised.
              </p>
            </div>
          </div>
          <Link
            href={`/patients/${attentionPatient.id}`}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shrink-0 whitespace-nowrap text-center self-end sm:self-auto flex items-center gap-1"
          >
            <span>Review Chart</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4. Upcoming Appointments Section (Flat Solid Color, No Gradients, No Shadows) */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">
            Upcoming Appointments
          </h2>
          <Link
            href="/appointments"
            className="text-xs font-semibold text-[#1E4E70] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {todayAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-[#F0F7FF] rounded-2xl p-5 border border-[#BEE0FF] hover:border-[#1E4E70]/40 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#BEE0FF] relative shrink-0 bg-white">
                    <Image
                      src={
                        apt.patientAvatar ||
                        `/child_avatar_${(parseInt(apt.id.replace(/\D/g, "") || "1") % 5) + 1
                        }.png`
                      }
                      alt={apt.patientName}
                      fill
                      className="object-cover object-center"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base leading-tight">
                      {apt.patientName}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Parent:{" "}
                      <span className="text-slate-800 font-semibold">
                        {apt.parentName}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#BEE0FF] text-[#1E4E70] font-semibold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-[#1E4E70]" />
                  <span>{apt.time}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#BEE0FF]/80 flex items-center justify-between gap-2.5">
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${apt.type === "Vaccination"
                    ? "bg-[#E0F2FE] text-[#1E4E70] border-[#BAE6FD]"
                    : apt.type === "Diet Plan"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : apt.type === "Follow-up"
                        ? "bg-sky-50 text-sky-800 border-sky-200"
                        : "bg-slate-100 text-slate-800 border-slate-200"
                    }`}
                >
                  <Activity className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">
                    {apt.type === ("General Checkup" as any)
                      ? "OPD Checkup"
                      : apt.type === ("Nutrition Consultation" as any)
                        ? "Diet Plan"
                        : apt.type}
                  </span>
                </span>

                <Link
                  href={`/patients/${apt.patientId}`}
                  className="bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Start Consultation</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
