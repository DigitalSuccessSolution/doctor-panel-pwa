"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Stethoscope,
  UserPlus,
  Edit3,
  Utensils,
  FileText,
  CheckCircle2,
  Sparkles,
  Calendar,
  Pill,
  Apple,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDoctorData } from "@/context/DoctorDataContext";
import { appointmentService } from "@/services/appointmentService";
import { babyService } from "@/services/babyService";
import { prescriptionService } from "@/services/prescriptionService";
import { nutritionService } from "@/services/nutritionService";

type ModalTab = "consultation" | "patient" | "note" | "nutrition" | "prescription";

export default function QuickAddModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>("consultation");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const { patients, setAppointments, addPatient, addAppointment, addMedicalNote, addPrescription, updateNutritionPlan } =
    useDoctorData();

  // Shared Patient selector state
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || "1");

  // Tab 1: Intake / Consultation states
  const [intakeType, setIntakeType] = useState<"OPD Checkup" | "Vaccination" | "Follow-up" | "Diet Plan">("OPD Checkup");
  const [intakeTime, setIntakeTime] = useState("10:30 AM");
  const [intakeDate, setIntakeDate] = useState("2026-07-31");
  const [intakeNotes, setIntakeNotes] = useState("");

  // Tab 2: Patient Registration states
  const [patientName, setPatientName] = useState("");
  const [patientGender, setPatientGender] = useState<"Boy" | "Girl">("Boy");
  const [patientAge, setPatientAge] = useState("");
  const [patientWeight, setPatientWeight] = useState("");
  const [patientHeight, setPatientHeight] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [allergies, setAllergies] = useState("");
  const [bloodType, setBloodType] = useState("O+");

  // Tab 3: Medical Note (SOAP) states
  const [noteCategory, setNoteCategory] = useState<"SOAP Note" | "Follow-up" | "Dietary Advisory">("SOAP Note");
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [planText, setPlanText] = useState("");

  // Tab 4: Diet & Nutrition states
  const [targetCalories, setTargetCalories] = useState("1800");
  const [targetProtein, setTargetProtein] = useState("60");
  const [targetIron, setTargetIron] = useState("12");
  const [focusText, setFocusText] = useState("High protein and iron bioavailability for developmental milestone support.");
  const [mealTitle, setMealTitle] = useState("Iron-fortified oat porridge with banana purée");

  // Tab 5: Prescription states
  const [diagnosis, setDiagnosis] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [duration, setDuration] = useState("7 Days");
  const [rxInstructions, setRxInstructions] = useState("Take after morning feed.");

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.tab) {
        setActiveTab(customEvent.detail.tab);
      }
      setIsOpen(true);
    };
    window.addEventListener("open-quick-add", handleOpen);
    return () => window.removeEventListener("open-quick-add", handleOpen);
  }, []);

  if (!isOpen || typeof document === "undefined") return null;

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "consultation") {
      addAppointment({
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        patientAvatar: currentPatient.avatar,
        parentName: currentPatient.parentName,
        time: intakeTime,
        date: intakeDate,
        type: intakeType,
        notes: intakeNotes || "Clinical intake created via Quick Action",
      });

      // Async backend REST API call
      appointmentService.createAppointment({
        babyId: currentPatient.id,
        date: intakeDate,
        timeSlot: intakeTime,
        type: intakeType.toLowerCase().includes("online") ? "online" : "clinic",
      }).catch(() => {});

      setSuccessMessage(`Consultation scheduled for ${currentPatient.name}!`);
    } else if (activeTab === "patient") {
      const created = addPatient({
        name: patientName || "Baby Infant",
        gender: patientGender,
        age: patientAge ? `${patientAge} Months` : "4 Months",
        ageInMonths: Number(patientAge) || 4,
        weight: patientWeight ? `${patientWeight} kg` : "6.2 kg",
        weightKg: Number(patientWeight) || 6.2,
        height: patientHeight ? `${patientHeight} cm` : "61 cm",
        heightCm: Number(patientHeight) || 61,
        parentName: parentName || "Parent",
        parentPhone: parentPhone || "+1 (555) 234-5678",
        allergies: allergies ? [allergies] : ["None"],
        bloodType: bloodType,
      });

      // Async backend REST API call
      babyService.createBaby({
        name: patientName || "Baby Infant",
        gender: patientGender.toLowerCase(),
        ageInMonths: Number(patientAge) || 4,
        weight: Number(patientWeight) || 6.2,
        height: Number(patientHeight) || 61,
        bloodType: bloodType,
        allergies: allergies ? [allergies] : [],
      }).catch(() => {});

      setSuccessMessage(`Patient ${created.name} registered successfully!`);
    } else if (activeTab === "note") {
      addMedicalNote({
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        category: noteCategory,
        subjective: subjective || "Parent reports baby is eating & sleeping well.",
        objective: objective || "Vitals within normal limits for age.",
        assessment: assessment || "Age-appropriate development.",
        plan: planText || "Continue feeding schedule.",
      });

      // Async backend REST API call
      prescriptionService.createPrescription({
        babyId: currentPatient.id,
        medicalNotes: `[${noteCategory}] ${subjective || "SOAP Note"} ${assessment || ""}`,
        nutritionRecommendations: planText || "Continue feeding schedule.",
      }).catch(() => {});

      setSuccessMessage(`Medical note saved for ${currentPatient.name}!`);
    } else if (activeTab === "nutrition") {
      updateNutritionPlan(currentPatient.id, {
        targetCalories: Number(targetCalories) || 1800,
        targetProtein: Number(targetProtein) || 60,
        targetIron: Number(targetIron) || 12,
        focusText: focusText,
        meals: [
          {
            id: `meal-${Date.now()}`,
            meal: "Breakfast",
            time: "08:00 AM",
            title: mealTitle || "Nutritional Meal",
            description: "Custom diet meal assigned by doctor.",
            tags: ["CLINICAL", "NUTRITION"],
            iconType: "sun",
          },
        ],
      });

      // Async backend REST API call
      nutritionService.createNutritionPlan({
        babyId: currentPatient.id,
        guidelines: focusText || mealTitle,
      }).catch(() => {});

      setSuccessMessage(`Nutrition plan updated for ${currentPatient.name}!`);
    } else if (activeTab === "prescription") {
      addPrescription({
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        diagnosis: diagnosis || "Routine clinical prescription",
        items: [
          {
            medicineName: medicineName || "Pediatric Multivitamin Syrup",
            dosage: dosage || "2.5 ml",
            frequency: frequency,
            duration: duration,
            instructions: rxInstructions,
          },
        ],
      });

      // Async backend REST API call
      prescriptionService.createPrescription({
        babyId: currentPatient.id,
        medicines: [
          {
            name: medicineName || "Pediatric Syrup",
            dosage: dosage || "2.5 ml",
            timing: frequency || "Morning",
            duration: duration || "7 days",
          },
        ],
        advice: rxInstructions || "Take after feed",
      }).catch(() => {});

      setSuccessMessage(`Prescription issued for ${currentPatient.name}!`);
    }

    setTimeout(() => {
      setSuccessMessage("");
      setIsOpen(false);
      if (activeTab === "patient") router.push("/patients");
      if (activeTab === "nutrition") router.push("/nutrition");
      if (activeTab === "prescription") router.push("/prescriptions");
      if (activeTab === "note") router.push("/medical-notes");
      if (activeTab === "consultation") router.push("/appointments");
    }, 1100);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200 animate-slideLeft font-sans relative z-10" onClick={e => e.stopPropagation()}>
        {/* Soft-Tone Clean Header Banner */}
        <div
          className={`px-5 sm:px-6 py-4 flex items-center justify-between border-b transition-colors shrink-0 ${
            activeTab === "consultation"
              ? "bg-[#F0F7FF] border-[#BEE0FF] text-[#1E4E70]"
              : activeTab === "patient"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : activeTab === "note"
              ? "bg-purple-50 border-purple-200 text-purple-900"
              : activeTab === "nutrition"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-sky-50 border-sky-200 text-sky-900"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center text-current font-semibold shrink-0 border border-slate-200/60">
              {activeTab === "consultation" && <Stethoscope className="w-5 h-5 text-[#1E4E70]" />}
              {activeTab === "patient" && <UserPlus className="w-5 h-5 text-emerald-600" />}
              {activeTab === "note" && <Edit3 className="w-5 h-5 text-purple-600" />}
              {activeTab === "nutrition" && <Utensils className="w-5 h-5 text-amber-600" />}
              {activeTab === "prescription" && <Pill className="w-5 h-5 text-sky-600" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base leading-tight truncate">
                {activeTab === "consultation" && "Quick Clinical Intake"}
                {activeTab === "patient" && "Register New Patient"}
                {activeTab === "note" && "Write Clinical SOAP Note"}
                {activeTab === "nutrition" && "Create Diet & Nutrition Plan"}
                {activeTab === "prescription" && "Generate e-Prescription"}
              </h3>
              <p className="text-[11px] sm:text-xs opacity-80 mt-0.5 truncate">
                {activeTab === "consultation" && "Schedule or log immediate intake"}
                {activeTab === "patient" && "Add a newborn to pediatric directory"}
                {activeTab === "note" && "Add SOAP clinical observations"}
                {activeTab === "nutrition" && "Configure target macros & meals"}
                {activeTab === "prescription" && "Issue digital dosage instructions"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white/80 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Strip (Responsive 5 Columns) */}
        <div className="grid grid-cols-5 gap-1 p-2 bg-slate-50 border-b border-slate-200/80 text-xs font-medium shrink-0">
          {[
            { id: "consultation", label: "Intake", icon: Stethoscope },
            { id: "patient", label: "Patient", icon: UserPlus },
            { id: "note", label: "Note", icon: Edit3 },
            { id: "nutrition", label: "Diet", icon: Utensils },
            { id: "prescription", label: "Rx", icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as ModalTab)}
                className={`flex flex-col items-center gap-1 py-1.5 sm:py-2 rounded-xl transition-all ${
                  isSelected
                    ? "bg-white text-[#1E4E70] font-semibold shadow-xs border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
          {successMessage ? (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 animate-bounce" />
              <p className="font-semibold text-slate-900 text-lg sm:text-xl">{successMessage}</p>
              <p className="text-xs text-slate-500">Updating doctor portal records...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: INTAKE / CONSULTATION */}
              {activeTab === "consultation" && (
                <div className="space-y-3.5">
                  <div className="bg-[#A5D8FF]/20 border border-[#A5D8FF]/40 rounded-lg p-3 flex items-center gap-3 text-xs text-[#1E4E70]">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#1E4E70] flex items-center justify-center shrink-0 shadow-xs">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold">Fast Pediatric Consultation Intake</p>
                      <p className="text-[11px] opacity-80">Log vitals, appointment type, and consultation notes</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Select Patient
                    </label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1E4E70] focus:outline-none focus:ring-2 focus:ring-[#A5D8FF]"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} • {p.age}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                        Consultation Type
                      </label>
                      <select
                        value={intakeType}
                        onChange={(e) => setIntakeType(e.target.value as any)}
                        className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="OPD Checkup">OPD Checkup</option>
                        <option value="Vaccination">Vaccination</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Diet Plan">Diet Plan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                        Time Slot
                      </label>
                      <input
                        type="text"
                        value={intakeTime}
                        onChange={(e) => setIntakeTime(e.target.value)}
                        placeholder="e.g. 10:30 AM"
                        className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Consultation Notes / Chief Complaint
                    </label>
                    <textarea
                      rows={3}
                      value={intakeNotes}
                      onChange={(e) => setIntakeNotes(e.target.value)}
                      placeholder="Enter chief complaint, growth progress, or observations..."
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A5D8FF]"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* TAB 2: ADMIN CONTROLLED PATIENT NOTICE */}
              {activeTab === "patient" && (
                <div className="p-6 text-center space-y-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="w-16 h-16 rounded-lg bg-sky-100 text-[#1E4E70] flex items-center justify-center mx-auto border border-sky-200">
                    <ShieldCheck className="w-8 h-8 text-[#1E4E70]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-900 text-base">Baby & Parent Accounts Managed by Admin</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Doctor panel does not allow manual baby or parent registration. All newborn records and Parent IDs are strictly assigned by Super Admin.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      window.dispatchEvent(new CustomEvent("open-raise-request"));
                    }}
                    className="bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs px-6 py-3 rounded-lg shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    Raise Admin Ticket for Baby Assignment
                  </button>
                </div>
              )}

              {/* TAB 3: MEDICAL SOAP NOTE */}
              {activeTab === "note" && (
                <div className="space-y-3.5">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-3 text-xs text-purple-900">
                    <div className="w-9 h-9 rounded-xl bg-white text-purple-600 flex items-center justify-center shrink-0 shadow-xs">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold">SOAP Clinical Documentation</p>
                      <p className="text-[11px] opacity-80">Log Subjective, Objective, Assessment & Treatment plan</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Select Patient
                    </label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1E4E70] focus:outline-none"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Assessment (Diagnosis) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Healthy infant, age-appropriate growth velocity"
                      value={assessment}
                      onChange={(e) => setAssessment(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Treatment Plan & Follow-up
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Continue iron fortified cereals. Schedule 6-month checkup."
                      value={planText}
                      onChange={(e) => setPlanText(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg p-3 text-xs focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* TAB 4: DIET & NUTRITION */}
              {activeTab === "nutrition" && (
                <div className="space-y-3.5">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 text-xs text-amber-900">
                    <div className="w-9 h-9 rounded-xl bg-white text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                      <Apple className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold">Pediatric Nutrition Generator</p>
                      <p className="text-[11px] opacity-80">Configure target macros & daily iron/protein meals</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Select Patient
                    </label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1E4E70] focus:outline-none"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Calories
                      </label>
                      <input
                        type="number"
                        value={targetCalories}
                        onChange={(e) => setTargetCalories(e.target.value)}
                        className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        value={targetProtein}
                        onChange={(e) => setTargetProtein(e.target.value)}
                        className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Iron (mg)
                      </label>
                      <input
                        type="number"
                        value={targetIron}
                        onChange={(e) => setTargetIron(e.target.value)}
                        className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Recommended Meal Schedule
                    </label>
                    <input
                      type="text"
                      value={mealTitle}
                      onChange={(e) => setMealTitle(e.target.value)}
                      placeholder="e.g. Fortified cereal + avocado puree"
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: PRESCRIPTION (Rx) */}
              {activeTab === "prescription" && (
                <div className="space-y-3.5">
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 flex items-center gap-3 text-xs text-sky-900">
                    <div className="w-9 h-9 rounded-xl bg-white text-sky-600 flex items-center justify-center shrink-0 shadow-xs">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold">Digital Prescription Generator</p>
                      <p className="text-[11px] opacity-80">Issue signed digital dosage & medical guidance</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Select Patient
                    </label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1E4E70] focus:outline-none"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Diagnosis *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mild upper respiratory congestion"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Medicine
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Syrup Paracetamol"
                        value={medicineName}
                        onChange={(e) => setMedicineName(e.target.value)}
                        className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1.5 ml"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        className="w-full bg-[#F8F9FA] border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#1E4E70] text-white rounded-lg shadow-sm hover:bg-[#153852] transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Record</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
}
