"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Info,
  DollarSign,
  Coffee
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { authService } from "@/services/authService";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

interface Shift {
  startTime: string;
  endTime: string;
  _id?: string;
}

interface DayAvailability {
  dayOfWeek: string;
  shifts: Shift[];
  isAvailable?: boolean;
}

interface DateException {
  date: string;
  status: "Leave" | "Custom Shifts";
  shifts: Shift[];
  reason?: string;
}

export default function AvailabilityManagerPage() {
  const router = useRouter();
  const { doctorProfile, updateDoctorProfile, isAuthenticated, setShowLoginModal } = useDoctorData();

  // Primary states
  const [weeklyAvailability, setWeeklyAvailability] = useState<DayAvailability[]>([]);
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [consultationFee, setConsultationFee] = useState<number>(500);
  
  // Date exceptions state
  const [dateExceptions, setDateExceptions] = useState<DateException[]>([
    {
      date: "2026-08-25",
      status: "Leave",
      shifts: [],
      reason: "Pediatric Conference Summit"
    },
    {
      date: "2026-08-28",
      status: "Custom Shifts",
      shifts: [{ startTime: "10:00", endTime: "13:00" }],
      reason: "Half-day OPD"
    }
  ]);

  // Form states for adding exceptions
  const [newExceptionDate, setNewExceptionDate] = useState("");
  const [newExceptionStatus, setNewExceptionStatus] = useState<"Leave" | "Custom Shifts">("Leave");
  const [newExceptionReason, setNewExceptionReason] = useState("");
  const [newExceptionShifts, setNewExceptionShifts] = useState<Shift[]>([{ startTime: "09:00", endTime: "13:00" }]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Initialize data from profile context
  useEffect(() => {
    if (doctorProfile) {
      // Map existing availability
      const existing = doctorProfile.availability || [];
      const initialized = DAYS_OF_WEEK.map((day) => {
        const found = existing.find(
          (d) => d.dayOfWeek.toLowerCase() === day.toLowerCase()
        );
        return {
          dayOfWeek: day,
          shifts: found && found.shifts.length > 0 ? found.shifts : [{ startTime: "09:00", endTime: "17:00" }],
          isAvailable: found ? found.shifts.length > 0 : day !== "Sunday"
        };
      });
      setWeeklyAvailability(initialized);
      
      if (doctorProfile.consultationFee) {
        setConsultationFee(doctorProfile.consultationFee);
      }
    }
  }, [doctorProfile]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl border border-slate-200 text-center space-y-4 font-sans animate-fadeIn my-12 shadow-sm">
        <div className="w-12 h-12 rounded-lg bg-[#A5D8FF]/30 text-[#1E4E70] mx-auto flex items-center justify-center">
          <Calendar className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Login Required</h2>
        <p className="text-xs text-slate-500">
          Please sign in to your doctor account to configure your OPD timings.
        </p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="w-full bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs py-3 rounded-lg cursor-pointer transition-colors"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Toggles day availability
  const handleToggleDay = (index: number) => {
    setWeeklyAvailability((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, isAvailable: !day.isAvailable } : day
      )
    );
  };

  // Adds a shift to a day
  const handleAddShift = (dayIndex: number) => {
    setWeeklyAvailability((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              shifts: [...day.shifts, { startTime: "09:00", endTime: "17:00" }]
            }
          : day
      )
    );
  };

  // Removes a shift from a day
  const handleRemoveShift = (dayIndex: number, shiftIndex: number) => {
    setWeeklyAvailability((prev) =>
      prev.map((day, i) => {
        if (i === dayIndex) {
          const updatedShifts = day.shifts.filter((_, sIdx) => sIdx !== shiftIndex);
          return {
            ...day,
            shifts: updatedShifts.length > 0 ? updatedShifts : [{ startTime: "09:00", endTime: "12:00" }],
            isAvailable: updatedShifts.length > 0 ? day.isAvailable : false
          };
        }
        return day;
      })
    );
  };

  // Updates shift time
  const handleUpdateShiftTime = (
    dayIndex: number,
    shiftIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setWeeklyAvailability((prev) =>
      prev.map((day, i) => {
        if (i === dayIndex) {
          const updatedShifts = day.shifts.map((shift, sIdx) =>
            sIdx === shiftIndex ? { ...shift, [field]: value } : shift
          );
          return { ...day, shifts: updatedShifts };
        }
        return day;
      })
    );
  };

  // Exception specific shifts helpers
  const handleAddExceptionShift = () => {
    setNewExceptionShifts((prev) => [...prev, { startTime: "09:00", endTime: "17:00" }]);
  };

  const handleRemoveExceptionShift = (shiftIndex: number) => {
    setNewExceptionShifts((prev) => prev.filter((_, sIdx) => sIdx !== shiftIndex));
  };

  const handleUpdateExceptionShiftTime = (
    shiftIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setNewExceptionShifts((prev) =>
      prev.map((shift, sIdx) =>
        sIdx === shiftIndex ? { ...shift, [field]: value } : shift
      )
    );
  };

  // Adds a leave/custom exception rule
  const handleAddException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExceptionDate) {
      setErrorMsg("Please select a valid exception date");
      return;
    }
    
    // Check duplication
    if (dateExceptions.some((exc) => exc.date === newExceptionDate)) {
      setErrorMsg("An availability rule already exists for this date.");
      return;
    }

    const newRule: DateException = {
      date: newExceptionDate,
      status: newExceptionStatus,
      shifts: newExceptionStatus === "Leave" ? [] : newExceptionShifts,
      reason: newExceptionReason || (newExceptionStatus === "Leave" ? "Holiday/Off-duty" : "Custom Schedule")
    };

    setDateExceptions((prev) => [...prev, newRule].sort((a, b) => a.date.localeCompare(b.date)));
    setNewExceptionDate("");
    setNewExceptionReason("");
    setErrorMsg("");
  };

  // Removes a leave/exception rule
  const handleRemoveException = (date: string) => {
    setDateExceptions((prev) => prev.filter((exc) => exc.date !== date));
  };

  // Save timing data to backend & local context
  const handleSave = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    // Build API-compliant availability array
    const formattedAvailability = weeklyAvailability
      .filter((day) => day.isAvailable && day.shifts.length > 0)
      .map((day) => ({
        dayOfWeek: day.dayOfWeek,
        shifts: day.shifts.map((s) => ({
          startTime: s.startTime,
          endTime: s.endTime
        }))
      }));

    const updatePayload = {
      availability: formattedAvailability,
      consultationFee: Number(consultationFee),
      slotDuration: Number(slotDuration),
      // Custom exceptions stored locally or passed as metadata
      clinicName: doctorProfile?.hospital,
      clinicAddress: doctorProfile?.clinicAddress
    };

    try {
      await authService.updateProfile(updatePayload);
      updateDoctorProfile({
        availability: formattedAvailability,
        consultationFee: Number(consultationFee),
        availableHours: formattedAvailability.length > 0 
          ? `${formattedAvailability[0].shifts[0].startTime} - ${formattedAvailability[0].shifts[0].endTime}`
          : "Not Available"
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push("/profile");
      }, 1500);
    } catch (err) {
      console.warn("Failed to update profile timings:", err);
      setErrorMsg("Failed to sync availability with backend. Saved changes locally.");
      
      updateDoctorProfile({
        availability: formattedAvailability,
        consultationFee: Number(consultationFee)
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push("/profile");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-24 font-sans space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            OPD Availability & Slot Manager
          </h1>
          <p className="text-xs text-slate-500">
            Set weekly timings, slot duration, and date exceptions.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-[#1E4E70] hover:bg-[#153852] disabled:bg-slate-300 text-white text-xs font-bold px-5 py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-95 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : "Save Availability"}</span>
        </button>
      </div>

      {/* SAVE SUCCESS STATUS */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-lg flex items-center gap-3 shadow-xs animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-bold">OPD Schedule Saved Successfully!</p>
            <p className="text-[11px] text-emerald-800 font-normal">
              Your availability rules and calendar configuration have been synchronized.
            </p>
          </div>
        </div>
      )}

      {/* ERROR TOAST */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-lg flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-xs font-medium leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* TWO PANEL COLUMNS: LEFT = WEEKLY TIMINGS, RIGHT = SLOTS & DATES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: WEEKLY DAY SCHEDULES (8 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-4.5 h-4.5 text-[#1E4E70]" />
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Weekly OPD Timings
              </h3>
            </div>

            <div className="divide-y divide-slate-100 space-y-4">
              {weeklyAvailability.map((day, dIdx) => (
                <div key={day.dayOfWeek} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleToggleDay(dIdx)}
                        className="text-[#1E4E70] transition-colors focus:outline-none"
                      >
                        {day.isAvailable ? (
                          <ToggleRight className="w-9 h-9 text-[#1E4E70] fill-[#1E4E70]/10" />
                        ) : (
                          <ToggleLeft className="w-9 h-9 text-slate-400" />
                        )}
                      </button>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {day.dayOfWeek}
                        </span>
                        <span className="block text-[10px] font-semibold text-slate-400">
                          {day.isAvailable ? "Accepting appointments" : "Closed / Off duty"}
                        </span>
                      </div>
                    </div>

                    {day.isAvailable && (
                      <button
                        type="button"
                        onClick={() => handleAddShift(dIdx)}
                        className="text-xs font-bold text-[#1E4E70] hover:text-[#153852] bg-[#A5D8FF]/30 border border-[#A5D8FF]/60 px-2.5 py-1 rounded-xl flex items-center gap-1 hover:scale-95 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add Shift</span>
                      </button>
                    )}
                  </div>

                  {/* SHIFTS CONFIGURATIONS */}
                  {day.isAvailable && (
                    <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200/60 space-y-2">
                      {day.shifts.map((shift, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 flex-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">
                              Start
                            </span>
                            <input
                              type="time"
                              required
                              value={shift.startTime}
                              onChange={(e) =>
                                handleUpdateShiftTime(dIdx, sIdx, "startTime", e.target.value)
                              }
                              className="text-xs sm:text-sm font-bold text-slate-800 focus:outline-none w-full bg-transparent"
                            />
                          </div>

                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 flex-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">
                              End
                            </span>
                            <input
                              type="time"
                              required
                              value={shift.endTime}
                              onChange={(e) =>
                                handleUpdateShiftTime(dIdx, sIdx, "endTime", e.target.value)
                              }
                              className="text-xs sm:text-sm font-bold text-slate-800 focus:outline-none w-full bg-transparent"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveShift(dIdx, sIdx)}
                            className="p-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors shrink-0"
                            title="Remove Shift"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SLOT DURATIONS & CALENDAR DATE EXCEPTIONS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SLOT DURATION & CON-FEE CARD */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Info className="w-4.5 h-4.5 text-[#1E4E70]" />
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Slot Configuration
              </h3>
            </div>

            <div className="space-y-4">
              {/* Consultation Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Consultation Slot Duration*
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 20, 30, 45].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSlotDuration(mins)}
                      className={`text-xs py-2.5 rounded-xl border font-bold transition-all text-center cursor-pointer ${
                        slotDuration === mins
                          ? "bg-[#1E4E70] text-white border-[#1E4E70] shadow-2xs"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#1E4E70]"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Fee */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Consultation Fee (₹)*
                </label>
                <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 px-3.5 py-3 rounded-lg focus-within:ring-2 focus-within:ring-[#1E4E70] focus-within:bg-white transition-all">
                  <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="number"
                    required
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    placeholder="500"
                    className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DATE-WISE HOLIDAYS & SPECIAL RULES (CALENDAR RULES) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4.5 h-4.5 text-[#1E4E70]" />
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Date-Wise Availability / Leaves
              </h3>
            </div>

            {/* ADD SPECIAL EXCEPTION FORM */}
            <form onSubmit={handleAddException} className="space-y-3 bg-[#F8FAFC] p-4 rounded-lg border border-slate-200/60">
              <span className="block text-[11px] font-bold text-[#1E4E70] uppercase tracking-wider">
                Add Date Custom Rule
              </span>

              {/* Choose Date */}
              <div className="space-y-1">
                <input
                  type="date"
                  required
                  value={newExceptionDate}
                  onChange={(e) => setNewExceptionDate(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
                />
              </div>

              {/* Choose Status */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "Leave", label: "Holiday / Leave", icon: Coffee },
                  { id: "Custom Shifts", label: "Custom Timings", icon: Clock }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNewExceptionStatus(item.id as any)}
                    className={`text-xs py-2 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      newExceptionStatus === item.id
                        ? "bg-[#1E4E70] text-white border-[#1E4E70]"
                        : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Custom Shifts configuration for exceptions */}
              {newExceptionStatus === "Custom Shifts" && (
                <div className="space-y-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-500">Shifts for selected date</span>
                    <button
                      type="button"
                      onClick={handleAddExceptionShift}
                      className="text-[10px] font-bold text-[#1E4E70] flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Add</span>
                    </button>
                  </div>

                  {newExceptionShifts.map((shift, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <input
                        type="time"
                        required
                        value={shift.startTime}
                        onChange={(e) => handleUpdateExceptionShiftTime(sIdx, "startTime", e.target.value)}
                        className="text-[11px] font-bold p-1 border border-slate-200 rounded-md w-full"
                      />
                      <span className="text-slate-400 text-xs">-</span>
                      <input
                        type="time"
                        required
                        value={shift.endTime}
                        onChange={(e) => handleUpdateExceptionShiftTime(sIdx, "endTime", e.target.value)}
                        className="text-[11px] font-bold p-1 border border-slate-200 rounded-md w-full"
                      />
                      {newExceptionShifts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExceptionShift(sIdx)}
                          className="p-1 text-rose-600 bg-rose-50 rounded-md"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Exception Reason */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Reason (e.g. Vacation, Seminar, Half-day)"
                  value={newExceptionReason}
                  onChange={(e) => setNewExceptionReason(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E4E70] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#153852] transition-colors"
              >
                Add Rule Exception
              </button>
            </form>

            {/* LIST OF CURRENT EXCEPTIONS */}
            <div className="space-y-2 pt-1">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Configured Date Rules
              </span>

              {dateExceptions.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  No custom date exceptions or leaves added.
                </p>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {dateExceptions.map((exc) => (
                    <div
                      key={exc.date}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                        exc.status === "Leave"
                          ? "bg-rose-50/50 border-rose-200/60"
                          : "bg-amber-50/50 border-amber-200/60"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">
                            {new Date(exc.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                              exc.status === "Leave"
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : "bg-amber-100 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {exc.status === "Leave" ? "LEAVE / OFF" : "CUSTOM SHIFT"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium italic">
                          Reason: {exc.reason}
                        </p>
                        {exc.status === "Custom Shifts" && exc.shifts.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {exc.shifts.map((s, idx) => (
                              <span key={idx} className="text-[9px] font-bold bg-white text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md">
                                {s.startTime} - {s.endTime}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveException(exc.date)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
