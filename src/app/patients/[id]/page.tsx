"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  Printer,
  Share2,
  Calendar,
  Gift,
  Activity,
  ChevronLeft,
  User,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Plus,
  Trash2,
  CheckCircle2,
  Video,
  PlusCircle,
  Edit3,
  Save,
  Clock,
  ChevronRight,
  Scale,
  FileText,
  X,
  Award,
  BookOpen,
  Utensils,
  Search,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { Patient, maskPhoneNumber } from "@/data/mockData";
import { apiFetch } from "@/services/apiClient";
import { babyService, transformBackendBabyToPatient } from "@/services/babyService";
import { growthService, GrowthRecord } from "@/services/growthService";
import { prescriptionService, transformBackendPrescriptionToFrontend } from "@/services/prescriptionService";
import { nutritionService, transformBackendNutritionPlanToFrontend, getPatientNutrientGoals } from "@/services/nutritionService";
import { milestoneService, BabyMilestone } from "@/services/milestoneService";
import GrowthCurveChart from "@/components/GrowthCurveChart";
import PrintableMedicalModal from "@/components/PrintableMedicalModal";
import ProfileTab from "./components/ProfileTab";
import GrowthTab from "./components/GrowthTab";
import PrescriptionsTab from "./components/PrescriptionsTab";
import NutritionTab from "./components/NutritionTab";
import MilestonesTab from "./components/MilestonesTab";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PatientProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const patientId = params.id as string;

  const { patients, setSelectedPatientId } = useDoctorData();
  const contextPatient = patients.find((p) => p.id === patientId) || patients[0];

  const [liveBaby, setLiveBaby] = useState<Patient | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  const initialTab = (searchParams.get("tab") as "profile" | "growth" | "prescriptions" | "nutrition" | "milestones") || "profile";
  const [activeTab, setActiveTab] = useState<"profile" | "growth" | "prescriptions" | "nutrition" | "milestones">(initialTab);

  // Tab 2: Growth Records State
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [growthLoading, setGrowthLoading] = useState(false);
  const [logWeight, setLogWeight] = useState("");
  const [logHeight, setLogHeight] = useState("");
  const [logHead, setLogHead] = useState("");
  const [logNotes, setLogNotes] = useState("");
  const [savingGrowth, setSavingGrowth] = useState(false);

  // Tab 3: Prescription Composer State
  const [prescriptionList, setPrescriptionList] = useState<any[]>([]);
  const [rxLoading, setRxLoading] = useState(false);
  const [rxDiagNotes, setRxDiagNotes] = useState("");
  const [rxWeight, setRxWeight] = useState("");
  const [rxTemp, setRxTemp] = useState("");
  const [rxBP, setRxBP] = useState("");
  const [rxNutrition, setRxNutrition] = useState("");
  const [rxNextVisit, setRxNextVisit] = useState("");
  const [rxMedicines, setRxMedicines] = useState<Array<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }>>([
    { name: "", dosage: "1.25 ml", frequency: "1-0-1", duration: "5 Days", instructions: "After feeding" }
  ]);
  const [savingRx, setSavingRx] = useState(false);
  const [editingRxId, setEditingRxId] = useState<string | null>(null);

  // Tab 4: Nutrition Planner State
  const [nutritionPlan, setNutritionPlan] = useState<any | null>(null);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [nutritionGuidelines, setNutritionGuidelines] = useState("");
  const [nutritionSchedule, setNutritionSchedule] = useState<Array<{ day: string; title: string; desc: string; mealId?: string; originalTitle?: string; originalDesc?: string }>>([
    { day: "Monday", title: "", desc: "", mealId: "", originalTitle: "", originalDesc: "" },
    { day: "Tuesday", title: "", desc: "", mealId: "", originalTitle: "", originalDesc: "" },
    { day: "Wednesday", title: "", desc: "", mealId: "", originalTitle: "", originalDesc: "" },
    { day: "Thursday", title: "", desc: "", mealId: "", originalTitle: "", originalDesc: "" },
    { day: "Friday", title: "", desc: "", mealId: "", originalTitle: "", originalDesc: "" },
    { day: "Saturday", title: "", desc: "", mealId: "", originalTitle: "", originalDesc: "" },
    { day: "Sunday", title: "", desc: "", mealId: "", originalTitle: "", originalDesc: "" },
  ]);
  const [savingNutrition, setSavingNutrition] = useState(false);
  const [nutritionDayTab, setNutritionDayTab] = useState<string>("All Days");
  const [plannerSelectedDay, setPlannerSelectedDay] = useState<string>("Monday");
  const [plannerSelectedMealId, setPlannerSelectedMealId] = useState<string>("");
  const [allMeals, setAllMeals] = useState<any[]>([]);
  const [mealsLoading, setMealsLoading] = useState(false);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState<string>("");
  const [plannerSuccessMsg, setPlannerSuccessMsg] = useState<string>("");
  const [savingGuidelines, setSavingGuidelines] = useState<boolean>(false);

  // Tab 5: Milestones State
  const [babyMilestones, setBabyMilestones] = useState<BabyMilestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);


  // Fetch Baby details initially
  useEffect(() => {
    if (patientId) {
      setSelectedPatientId(patientId);
      babyService
        .fetchBabyById(patientId)
        .then((res: any) => {
          if (res.success && res.data) {
            setLiveBaby(transformBackendBabyToPatient(res.data));
          }
        })
        .catch(() => { });
    }
  }, [patientId, setSelectedPatientId]);

  useEffect(() => {
    const found = nutritionSchedule.find(s => s.day === plannerSelectedDay);
    if (found) {
      setPlannerSelectedMealId(found.mealId || "");
    } else {
      setPlannerSelectedMealId("");
    }
  }, [nutritionSchedule, plannerSelectedDay]);

  const patient = liveBaby || contextPatient;

  // Load Tab Specific Data
  useEffect(() => {
    if (!patientId) return;

    if (activeTab === "growth") {
      setGrowthLoading(true);
      growthService.getGrowthRecords(patientId)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setGrowthRecords(res.data);
          }
        })
        .finally(() => setGrowthLoading(false));
    }

    if (activeTab === "prescriptions") {
      setRxLoading(true);
      prescriptionService.getPrescriptionsByBaby(patientId)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setPrescriptionList(res.data.map(transformBackendPrescriptionToFrontend));
          }
        })
        .finally(() => setRxLoading(false));
    }

    if (activeTab === "nutrition") {
      setNutritionLoading(true);
      nutritionService.getNutritionPlanByBaby(patientId)
        .then((res) => {
          if (res.success && res.data) {
            const plan = Array.isArray(res.data) ? res.data[0] : res.data;
            if (plan) {
              setNutritionPlan(plan);
              setNutritionGuidelines(plan.guidelines || "");
            }
          }
        })
        .finally(() => setNutritionLoading(false));

      // Fetch all system meals
      setMealsLoading(true);
      apiFetch<any>("/api/meals?limit=100")
        .then((res) => {
          if (res.success && res.data) {
            setAllMeals(Array.isArray(res.data) ? res.data : res.data.meals || []);
          }
        })
        .catch((err) => console.error("Failed to load meals catalog:", err))
        .finally(() => setMealsLoading(false));
    }

    if (activeTab === "milestones") {
      setMilestonesLoading(true);
      milestoneService.getBabyMilestones(patientId)
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setBabyMilestones(res.data);
          }
        })
        .finally(() => setMilestonesLoading(false));
    }
  }, [activeTab, patientId]);

  // Re-resolve meal details whenever allMeals or nutritionPlan updates
  useEffect(() => {
    if (nutritionPlan && Array.isArray(nutritionPlan.weeklySchedule)) {
      const mapped = nutritionPlan.weeklySchedule.map((item: any) => {
        const id = typeof item.mealId === "string"
          ? item.mealId
          : (item.mealId?._id || item.mealId?.id || "");
        
        // Find in local catalog
        const found = allMeals.find(m => (m._id || m.id) === id);
        if (found) {
          return {
            day: item.day,
            title: found.name,
            desc: found.description,
            mealId: id,
          };
        }
        
        // Fallback to populated object
        if (item.mealId && typeof item.mealId === "object") {
          return {
            day: item.day,
            title: item.mealId.name || item.mealId.title || "Standard Baby Weaning Meal",
            desc: item.mealId.description || "Recommended soft puree / weaning guidance.",
            mealId: id,
          };
        }
        
        // Final fallback
        return {
          day: item.day,
          title: "Standard Baby Weaning Meal",
          desc: "Recommended soft puree / weaning guidance.",
          mealId: id || "6a7b113d4c971486e4fc4a48",
        };
      });
      setNutritionSchedule(mapped);
    }
  }, [allMeals, nutritionPlan]);

  // Log Vitals Handler
  const handleLogVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logWeight || !logHeight) return;

    setSavingGrowth(true);
    try {
      const res = await growthService.addGrowthRecord({
        babyId: patientId,
        weight: parseFloat(logWeight),
        height: parseFloat(logHeight),
        headCircumference: logHead ? parseFloat(logHead) : undefined,
        notes: logNotes.trim(),
      });

      if (res.success && res.data) {
        setGrowthRecords((prev) => [res.data!, ...prev]);
        setLogWeight("");
        setLogHeight("");
        setLogHead("");
        setLogNotes("");

        // Refresh baby details weight/height
        if (liveBaby) {
          setLiveBaby({
            ...liveBaby,
            weight: res.data!.weight,
            height: res.data!.height,
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingGrowth(false);
    }
  };

  // Add Vital record delete handler
  const handleDeleteGrowth = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vital log?")) return;
    try {
      const res = await growthService.deleteGrowthRecord(id);
      if (res.success) {
        setGrowthRecords((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Medicines Builder Helpers
  const handleAddMedicineRow = () => {
    setRxMedicines([
      ...rxMedicines,
      { name: "", dosage: "1.25 ml", frequency: "1-0-1", duration: "5 Days", instructions: "After feeding" }
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setRxMedicines(rxMedicines.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index: number, field: string, val: string) => {
    const updated = [...rxMedicines];
    updated[index] = { ...updated[index], [field]: val };
    setRxMedicines(updated);
  };

  // Start Editing Prescription
  const handleStartEditPrescription = (rx: any) => {
    setEditingRxId(rx.id);
    setRxDiagNotes(rx.diagnosis || "");
    setRxWeight(rx.vitals?.weight || "");
    setRxTemp(rx.vitals?.temperature || "");
    setRxBP(rx.vitals?.bp || "");
    setRxNutrition(rx.nutritionRecommendations || "");
    setRxNextVisit(rx.nextVisitDate || "");
    if (Array.isArray(rx.medicines) && rx.medicines.length > 0) {
      setRxMedicines(rx.medicines.map((m: any) => ({
        name: m.medicineName || m.name || "",
        dosage: m.dosage || "1 ml",
        frequency: m.frequency || "1-0-1",
        duration: m.duration || "5 Days",
        instructions: m.instructions || "After meals"
      })));
    } else {
      setRxMedicines([{ name: "", dosage: "1.25 ml", frequency: "1-0-1", duration: "5 Days", instructions: "After feeding" }]);
    }
  };

  const handleCancelEditPrescription = () => {
    setEditingRxId(null);
    setRxDiagNotes("");
    setRxWeight("");
    setRxTemp("");
    setRxBP("");
    setRxNutrition("");
    setRxNextVisit("");
    setRxMedicines([{ name: "", dosage: "1.25 ml", frequency: "1-0-1", duration: "5 Days", instructions: "After feeding" }]);
  };

  const handleDeletePrescription = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prescription log?")) return;
    try {
      const res = await prescriptionService.deletePrescription(id);
      if (res.success) {
        setPrescriptionList((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Issue / Update Prescription
  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRx(true);
    try {
      const formattedMeds = rxMedicines.filter(m => m.name.trim()).map(m => ({
        name: m.name.trim(),
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        instructions: m.instructions
      }));

      let res;
      if (editingRxId) {
        res = await prescriptionService.updatePrescription(editingRxId, {
          medicalNotes: rxDiagNotes.trim(),
          nutritionRecommendations: rxNutrition.trim(),
          vitals: {
            weight: rxWeight || `${patient.weight || 6.8} kg`,
            temperature: rxTemp || "98.6 F",
            bp: rxBP || "N/A"
          },
          medicines: formattedMeds,
          nextVisitDate: rxNextVisit || undefined,
        });
      } else {
        res = await prescriptionService.createPrescription({
          babyId: patientId,
          medicalNotes: rxDiagNotes.trim(),
          nutritionRecommendations: rxNutrition.trim(),
          vitals: {
            weight: rxWeight || `${patient.weight || 6.8} kg`,
            temperature: rxTemp || "98.6 F",
            bp: rxBP || "N/A"
          },
          medicines: formattedMeds,
          nextVisitDate: rxNextVisit || undefined,
        });
      }

      if (res.success && res.data) {
        const transformed = transformBackendPrescriptionToFrontend(res.data);
        if (editingRxId) {
          setPrescriptionList((prev) => prev.map((r) => r.id === editingRxId ? transformed : r));
        } else {
          setPrescriptionList((prev) => [transformed, ...prev]);
        }
        handleCancelEditPrescription();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRx(false);
    }
  };

  // Save Guidelines Focus Text
  const handleSaveGuidelines = async () => {
    setSavingGuidelines(true);
    setPlannerSuccessMsg("");
    try {
      const scheduleItems = [];
      for (const s of nutritionSchedule) {
        if (s.title.trim() !== "" && s.mealId) {
          scheduleItems.push({
            day: s.day,
            mealId: s.mealId
          });
        }
      }
      if (scheduleItems.length === 0) {
        scheduleItems.push({
          day: "Monday",
          mealId: "64f719d3f1a2b3c4d5e6f7a8"
        });
      }

      let res;
      if (nutritionPlan && (nutritionPlan.id || nutritionPlan._id)) {
        res = await nutritionService.updateNutritionPlan(nutritionPlan.id || nutritionPlan._id, {
          babyId: patientId,
          guidelines: nutritionGuidelines.trim(),
          weeklySchedule: scheduleItems
        });
      } else {
        res = await nutritionService.createNutritionPlan({
          babyId: patientId,
          guidelines: nutritionGuidelines.trim(),
          weeklySchedule: scheduleItems
        });
      }

      if (res.success && res.data) {
        setNutritionPlan(res.data);
        setPlannerSuccessMsg("Guidelines saved successfully!");
        setTimeout(() => setPlannerSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingGuidelines(false);
    }
  };

  // Save/Update Nutrition Plan Schedule for a single day - Appends a new meal to the selected day
  const handleUpdateSingleDayMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plannerSelectedMealId) return;
    setSavingNutrition(true);
    setPlannerSuccessMsg("");
    try {
      const selectedMealObj = allMeals.find(m => (m._id || m.id) === plannerSelectedMealId);
      const newScheduleItem = {
        day: plannerSelectedDay,
        mealId: plannerSelectedMealId
      };

      // Get all current schedule items
      const scheduleItems = nutritionSchedule
        .filter(s => s.mealId && s.mealId.trim() !== "")
        .map(s => ({
          day: s.day,
          mealId: s.mealId
        }));

      // Append the new one
      scheduleItems.push(newScheduleItem);

      let res;
      if (nutritionPlan && (nutritionPlan.id || nutritionPlan._id)) {
        res = await nutritionService.updateNutritionPlan(nutritionPlan.id || nutritionPlan._id, {
          babyId: patientId,
          guidelines: nutritionGuidelines.trim(),
          weeklySchedule: scheduleItems
        });
      } else {
        res = await nutritionService.createNutritionPlan({
          babyId: patientId,
          guidelines: nutritionGuidelines.trim(),
          weeklySchedule: scheduleItems
        });
      }

      if (res.success && res.data) {
        setNutritionPlan(res.data);
        setPlannerSuccessMsg(`Added meal for ${plannerSelectedDay} successfully!`);
        setPlannerSelectedMealId(""); // reset dropdown
        setTimeout(() => setPlannerSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Failed to update schedule:", err);
    } finally {
      setSavingNutrition(false);
    }
  };

  // Remove a specific meal from the schedule by its index
  const handleRemoveMealFromDay = async (indexToRemove: number) => {
    setSavingNutrition(true);
    setPlannerSuccessMsg("");
    try {
      const updatedSchedule = nutritionSchedule.filter((_, idx) => idx !== indexToRemove);
      const scheduleItems = updatedSchedule
        .filter(s => s.mealId && s.mealId.trim() !== "")
        .map(s => ({
          day: s.day,
          mealId: s.mealId
        }));

      // Fallback standard meal to pass validation if empty
      if (scheduleItems.length === 0) {
        scheduleItems.push({
          day: "Monday",
          mealId: "64f719d3f1a2b3c4d5e6f7a8"
        });
      }

      const res = await nutritionService.updateNutritionPlan(nutritionPlan.id || nutritionPlan._id, {
        babyId: patientId,
        guidelines: nutritionGuidelines.trim(),
        weeklySchedule: scheduleItems
      });

      if (res.success && res.data) {
        setNutritionPlan(res.data);
        setPlannerSuccessMsg("Meal removed successfully!");
        setTimeout(() => setPlannerSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Failed to remove meal:", err);
    } finally {
      setSavingNutrition(false);
    }
  };



  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-sans max-w-7xl mx-auto overflow-hidden">
      {/* 0. Navigation Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4E70] bg-[#F0F7FF] hover:bg-[#E0F0FF] px-3.5 py-2.5 rounded-xl border border-[#BEE0FF] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Patient Directory</span>
        </Link>
      </div>

      {/* 1. Top Patient Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#A5D8FF] shadow-2xs relative bg-slate-100">
              <Image
                src={patient.avatar || "/child_avatar_1.png"}
                alt={patient.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-2xs">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {patient.name}
              </h1>
              <span className="bg-[#A5D8FF]/25 text-[#1E4E70] font-bold text-xs px-2.5 py-0.5 rounded-lg border border-[#A5D8FF]/60 capitalize">
                {patient.gender}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs text-slate-500 font-medium">
              <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-md border border-slate-200/60 font-semibold font-sans">
                Parent: {patient.parentName || "Parent"} ({patient.parentPhone || "N/A"})
              </span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.ageInMonths ? `${patient.ageInMonths} Months` : "Age N/A"}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 font-semibold">
                <Gift className="w-3.5 h-3.5 text-slate-400" />
                <span>DOB: {patient.dateOfBirth}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 bg-[#A5D8FF]/25 hover:bg-[#A5D8FF]/40 text-[#1E4E70] font-bold text-xs px-4 py-2.5 rounded-xl transition-all border border-[#A5D8FF]/60 shadow-2xs cursor-pointer"
            title="Print Patient File"
          >
            <Printer className="w-4 h-4" />
            <span>Print Chart</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/60">
        {[
          { id: "profile", label: "Profile & Contacts", icon: User },
          { id: "growth", label: "Growth Trajectory", icon: Scale },
          { id: "prescriptions", label: "Prescription Hub", icon: FileText },
          { id: "nutrition", label: "Nutrition Planner", icon: Utensils },
          { id: "milestones", label: "Milestones Checklists", icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer -mb-[1px] ${isActive
                ? "border-[#1E4E70] text-[#1E4E70] font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Area Content */}
      <div className="mt-4 animate-fadeIn">
        {activeTab === "profile" && <ProfileTab patient={patient} />}

        {activeTab === "growth" && (
          <GrowthTab
            patient={patient}
            growthRecords={growthRecords}
            growthLoading={growthLoading}
            logWeight={logWeight}
            setLogWeight={setLogWeight}
            logHeight={logHeight}
            setLogHeight={setLogHeight}
            logHead={logHead}
            setLogHead={setLogHead}
            logNotes={logNotes}
            setLogNotes={setLogNotes}
            savingGrowth={savingGrowth}
            handleLogVitals={handleLogVitals}
            handleDeleteGrowth={handleDeleteGrowth}
          />
        )}

        {activeTab === "prescriptions" && (
          <PrescriptionsTab
            patient={patient}
            prescriptionList={prescriptionList}
            rxLoading={rxLoading}
            rxWeight={rxWeight}
            setRxWeight={setRxWeight}
            rxTemp={rxTemp}
            setRxTemp={setRxTemp}
            rxBP={rxBP}
            setRxBP={setRxBP}
            rxDiagNotes={rxDiagNotes}
            setRxDiagNotes={setRxDiagNotes}
            rxNutrition={rxNutrition}
            setRxNutrition={setRxNutrition}
            rxNextVisit={rxNextVisit}
            setRxNextVisit={setRxNextVisit}
            rxMedicines={rxMedicines}
            setRxMedicines={setRxMedicines}
            savingRx={savingRx}
            editingRxId={editingRxId}
            handleCreatePrescription={handleCreatePrescription}
            handleAddMedicineRow={handleAddMedicineRow}
            handleRemoveMedicineRow={handleRemoveMedicineRow}
            handleMedicineChange={handleMedicineChange}
            handleStartEditPrescription={handleStartEditPrescription}
            handleCancelEditPrescription={handleCancelEditPrescription}
            handleDeletePrescription={handleDeletePrescription}
          />
        )}

        {activeTab === "nutrition" && (
          <NutritionTab
            patient={patient}
            patientId={patientId}
            nutritionPlan={nutritionPlan}
            setNutritionPlan={setNutritionPlan}
            nutritionLoading={nutritionLoading}
            nutritionGuidelines={nutritionGuidelines}
            setNutritionGuidelines={setNutritionGuidelines}
            nutritionSchedule={nutritionSchedule}
            setNutritionSchedule={setNutritionSchedule}
            savingNutrition={savingNutrition}
            setSavingNutrition={setSavingNutrition}
            nutritionDayTab={nutritionDayTab}
            setNutritionDayTab={setNutritionDayTab}
            plannerSelectedDay={plannerSelectedDay}
            setPlannerSelectedDay={setPlannerSelectedDay}
            allMeals={allMeals}
            mealsLoading={mealsLoading}
            catalogSearchTerm={catalogSearchTerm}
            setCatalogSearchTerm={setCatalogSearchTerm}
            plannerSuccessMsg={plannerSuccessMsg}
            setPlannerSuccessMsg={setPlannerSuccessMsg}
            savingGuidelines={savingGuidelines}
            handleSaveGuidelines={handleSaveGuidelines}
            handleRemoveMealFromDay={handleRemoveMealFromDay}
          />
        )}

        {activeTab === "milestones" && (
          <MilestonesTab
            babyMilestones={babyMilestones}
            milestonesLoading={milestonesLoading}
          />
        )}
      </div>

      {/* Printable Clinical Medical Modal */}
      <PrintableMedicalModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        patient={patient}
      />
    </div>
  );
}
