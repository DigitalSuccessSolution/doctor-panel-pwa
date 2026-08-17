"use client";

import { User, Phone, Mail, MapPin, HeartPulse } from "lucide-react";
import { Patient, maskPhoneNumber } from "@/data/mockData";

interface ProfileTabProps {
  patient: Patient;
}

export default function ProfileTab({ patient }: ProfileTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Key stats cards */}
      <div className="lg:col-span-7 space-y-6">
        {/* Clinical summary */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-2 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#1E4E70]" />
            <span>Clinical Health Summary</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Medical Condition</p>
              <p className="font-bold text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                {patient.medicalCondition || "Healthy growth & progress"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Dietary Plan</p>
              <p className="font-bold text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                {patient.diet || "Standard feeding routine"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Allergies</p>
              <p className="font-bold text-rose-700 bg-rose-50/60 p-3 rounded-2xl border border-rose-200/60 font-sans">
                {patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(", ") : "None reported"}
              </p>
            </div>
          </div>
        </div>

        {/* Bio details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Weight</p>
            <p className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {patient.weight ? `${patient.weight} kg` : "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Height</p>
            <p className="text-2xl font-extrabold text-[#1E4E70] tracking-tight">
              {patient.height ? `${patient.height} cm` : "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Premature Days</p>
            <p className="text-2xl font-extrabold text-amber-600 tracking-tight">
              {patient.prematureDays || 0} Days
            </p>
          </div>
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Blood Type</p>
            <p className="text-2xl font-extrabold text-rose-600 tracking-tight">
              {patient.bloodType || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Parent account details */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-[#1E4E70]" />
            <span>Parent Account Details</span>
          </h3>

          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Parent Name: <strong className="text-slate-800 font-semibold">{patient.parentName || "Parent Account"}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Phone: <strong className="text-slate-800 font-semibold">{maskPhoneNumber(patient.parentPhone)}</strong></span>
            </div>
            {patient.parentEmail && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Email: <strong className="text-slate-800 font-semibold">{patient.parentEmail}</strong></span>
              </div>
            )}
            {patient.parentAddress && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Address: <strong className="text-slate-800 font-semibold">{patient.parentAddress}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
