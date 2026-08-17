"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit3, Plus, Save, FileText, CheckCircle2, Bookmark, User } from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { prescriptionService } from "@/services/prescriptionService";

export default function MedicalNotesPage() {
  const { patients, notes, addMedicalNote, selectedPatientId, setSelectedPatientId } = useDoctorData();

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const [noteCategory, setNoteCategory] = useState<"SOAP Note" | "Follow-up" | "Vaccination" | "Dietary Advisory">("SOAP Note");
  const [subjective, setSubjective] = useState("Parent reports baby is sleeping 8 hours uninterrupted, feeding 6 times daily.");
  const [objective, setObjective] = useState(`Weight: ${selectedPatient.weight} (${selectedPatient.growthScore}th percentile), Height: ${selectedPatient.height}. Clear lungs, normal heart sounds.`);
  const [assessment, setAssessment] = useState("Healthy infant, age-appropriate developmental milestone achievements.");
  const [plan, setPlan] = useState("Continue exclusive breastfeeding + iron fortified cereal. Next visit at 6 months.");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const applyTemplate = (type: string) => {
    if (type === "fever") {
      setNoteCategory("Vaccination");
      setSubjective("Low grade fever reported since yesterday following DTaP immunization.");
      setObjective("Temp: 99.8 F. No lethargy. Mild swelling at injection site.");
      setAssessment("Normal post-vaccination febrile reaction.");
      setPlan("Prescribed Paracetamol syrup 1.5 ml. Cold compress for thigh.");
    } else if (type === "growth") {
      setNoteCategory("Dietary Advisory");
      setSubjective("Parent concerned about slow weight velocity.");
      setObjective(`Weight: ${selectedPatient.weight}. Percentile dropped over 3 weeks.`);
      setAssessment("Mild nutritional insufficiency / latch issue.");
      setPlan("Lactation consultation referral + calorie dense formula supplement.");
    } else if (type === "routine") {
      setNoteCategory("SOAP Note");
      setSubjective("Standard 4-month development checkup. No acute distress.");
      setObjective("Vitals stable. Reflexes active and age appropriate.");
      setAssessment("Normal infant growth and development.");
      setPlan("Continue iron-fortified cereals & schedule next visit.");
    }
  };

  const handleSaveNote = () => {
    addMedicalNote({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      category: noteCategory,
      subjective,
      objective,
      assessment,
      plan,
    });

    // Sync note to backend REST API POST /api/prescriptions
    prescriptionService.createPrescription({
      babyId: selectedPatient.id,
      medicalNotes: `[${noteCategory}] ${subjective} ${assessment}`,
      nutritionRecommendations: plan,
    }).catch(() => {});

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const filteredNotes = notes.filter((n) => n.patientId === selectedPatient.id || n.patientName === selectedPatient.name);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn pb-24 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Medical Notes & SOAP Editor
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Rich clinical documentation & pediatric templates
          </p>
        </div>
        <button
          onClick={handleSaveNote}
          className="flex items-center justify-center gap-1.5 bg-[#1E4E70] text-white font-semibold text-xs px-5 py-2.5 rounded-2xl shadow-xs hover:bg-[#153852] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? "Note Saved to History!" : "Save Clinical Note"}</span>
        </button>
      </div>

      {/* Top Patient Selector Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center gap-3 overflow-x-auto scrollbar-none font-sans">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 pl-1 whitespace-nowrap">
          Select Patient File:
        </span>
        <div className="flex items-center gap-2">
          {patients.map((p) => {
            const isSelected = selectedPatientId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? "bg-[#1E4E70] text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70"
                }`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden relative shrink-0 border border-white">
                  <Image src={p.avatar || "/child_care.png"} alt={p.name} fill className="object-cover" unoptimized />
                </div>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Layout (12 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: SOAP Form Pad (7 Cols on Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5 font-sans">
            {/* Subjective */}
            <div>
              <label className="block text-xs font-semibold text-[#1E4E70] uppercase tracking-wider mb-1.5">
                Subjective Notes <span className="text-slate-400 font-normal lowercase">• parent report & symptoms</span>
              </label>
              <textarea
                rows={3}
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                className="w-full bg-[#F8F9FA] border border-slate-200/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF] min-h-[85px] leading-relaxed"
              ></textarea>
            </div>

            {/* Objective */}
            <div>
              <label className="block text-xs font-semibold text-[#1E4E70] uppercase tracking-wider mb-1.5">
                Objective Observations <span className="text-slate-400 font-normal lowercase">• physical exam & vitals</span>
              </label>
              <textarea
                rows={3}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full bg-[#F8F9FA] border border-slate-200/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF] min-h-[85px] leading-relaxed"
              ></textarea>
            </div>

            {/* Assessment */}
            <div>
              <label className="block text-xs font-semibold text-[#1E4E70] uppercase tracking-wider mb-1.5">
                Clinical Assessment <span className="text-slate-400 font-normal lowercase">• diagnosis & evaluation</span>
              </label>
              <textarea
                rows={3}
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                className="w-full bg-[#F8F9FA] border border-slate-200/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF] min-h-[85px] leading-relaxed"
              ></textarea>
            </div>

            {/* Plan */}
            <div>
              <label className="block text-xs font-semibold text-[#1E4E70] uppercase tracking-wider mb-1.5">
                Treatment Plan <span className="text-slate-400 font-normal lowercase">• prescription & follow-up</span>
              </label>
              <textarea
                rows={3}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full bg-[#F8F9FA] border border-slate-200/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF] min-h-[85px] leading-relaxed"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Side: Clinical Notes History (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Previous Clinical Notes History */}
          <div className="space-y-3 font-sans">
            <h3 className="font-semibold text-slate-800 text-base">
              Clinical Notes History ({filteredNotes.length})
            </h3>
            {filteredNotes.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-slate-400 text-xs">
                No notes saved yet for {selectedPatient.name}. Fill in the form and click &quot;Save Clinical Note&quot;.
              </div>
            ) : (
              filteredNotes.map((n) => (
                <div
                  key={n.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-800 text-sm leading-snug">
                        {n.patientName} <span className="text-slate-400 font-normal">•</span> <span className="text-[#1E4E70]">{n.category}</span>
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/70 whitespace-nowrap shrink-0">
                      {n.date}
                    </span>
                  </div>
                  <div className="space-y-1 pt-1 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                    <p><span className="font-semibold text-slate-800">Subjective:</span> {n.subjective}</p>
                    <p><span className="font-semibold text-slate-800">Assessment:</span> {n.assessment}</p>
                    <p><span className="font-semibold text-slate-800">Plan:</span> {n.plan}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
