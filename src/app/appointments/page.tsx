"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Plus,
  Check,
  X,
  FileText,
  Activity,
  Video,
  Edit3,
  Search,
  User,
  Phone,
  Filter,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { appointmentService, transformBackendAppointmentToFrontend } from "@/services/appointmentService";
import { babyService } from "@/services/babyService";

export default function AppointmentsPage() {
  const { appointments, setAppointments, patients } = useDoctorData();


  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Selected Patient Profile Drawer / Modal state
  const [selectedPatientModal, setSelectedPatientModal] = useState<any | null>(null);

  // Cancel / Reject Modal state
  const [cancelModalApt, setCancelModalApt] = useState<any | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState<boolean>(false);

  // Edit Notes / Meeting Link Modal state
  const [editModalApt, setEditModalApt] = useState<any | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);

  // Mobile Bottom Sheet Modal state
  const [selectedMobileApt, setSelectedMobileApt] = useState<any | null>(null);
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past">("upcoming");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchLiveAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.fetchAppointments();
      if (res.success && Array.isArray(res.data)) {
        const list = res.data.map((app: any) => {
          const transformed = transformBackendAppointmentToFrontend(app);
          const baby = typeof app.babyId === "object" && app.babyId !== null ? app.babyId : {};
          const parent = typeof app.parentId === "object" && app.parentId !== null ? app.parentId : {};
          const doctor = typeof app.doctorId === "object" && app.doctorId !== null ? app.doctorId : {};

          return {
            ...transformed,
            fee: doctor.consultationFee || 500,
            patientAge: baby.ageInMonths ? `${baby.ageInMonths} Months` : "Pediatric",
            parentPhone: parent.phone || app.parentPhone || "N/A",
            rawBabyData: baby,
            rawParentData: parent,
          };
        });
        setAppointments(list);
      }
    } catch (err) {
      console.warn("Failed to fetch live appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAppointments();
  }, []);

  // Lock body scroll when any modal/drawer is open
  useEffect(() => {
    if (selectedMobileApt || selectedPatientModal || cancelModalApt || editModalApt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMobileApt, selectedPatientModal, cancelModalApt, editModalApt]);

  const handleOpenQuickAdd = () => {
    window.dispatchEvent(new CustomEvent("open-quick-add", { detail: { tab: "consultation" } }));
  };

  // Submit Rejection / Cancellation with reason
  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalApt || !cancellationReason.trim()) return;

    setIsSubmittingCancel(true);
    try {
      const res = await appointmentService.updateStatus(cancelModalApt.id, "cancelled", {
        cancellationReason: cancellationReason.trim(),
      });

      if (res.success || res.data) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === cancelModalApt.id
              ? { ...a, status: "Cancelled" as any, cancellationReason: cancellationReason.trim() }
              : a
          )
        );
        setCancelModalApt(null);
        setCancellationReason("");
      } else {
        alert(res.message || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  // Submit Edit Notes & Video Link
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalApt) return;

    setIsSubmittingEdit(true);
    try {
      const res = await appointmentService.updateAppointment(editModalApt.id, {
        doctorId: editModalApt.doctorId,
        babyId: editModalApt.patientId, // In frontend it's mapped to patientId
        date: editModalApt.date,
        time: editModalApt.time,
        doctorNotes: editNotes.trim(),
      });

      if (res.success || res.data) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === editModalApt.id
              ? { ...a, doctorNotes: editNotes.trim() }
              : a
          )
        );
        setEditModalApt(null);
      }
    } catch (err) {
      console.error("Error saving appointment notes:", err);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Open Patient Profile Drawer
  const handleOpenPatientProfile = (apt: any) => {
    const fullPatient = patients.find((p) => p.id === apt.patientId) || {
      name: apt.patientName,
      avatar: apt.patientAvatar,
      age: apt.patientAge || "N/A",
      parentName: apt.parentName,
      phone: apt.parentPhone,
      gender: "Not specified",
      growthScore: "N/A",
    };
    setSelectedPatientModal(fullPatient);
  };

  // Filter appointments
  const filteredAppointments = [...appointments].filter((apt) => {
    const rawStatus = (apt.status || "scheduled").toLowerCase();
    
    // Time filter logic based on status
    const isPastStatus = rawStatus === "completed" || rawStatus === "cancelled";
    const isUpcomingStatus = !isPastStatus;
    
    if (timeFilter === "upcoming" && !isUpcomingStatus) return false;
    if (timeFilter === "past" && !isPastStatus) return false;

    const query = searchQuery.toLowerCase().trim();
    const searchMatch =
      !query ||
      apt.patientName?.toLowerCase().includes(query) ||
      apt.parentName?.toLowerCase().includes(query) ||
      apt.parentPhone?.toLowerCase().includes(query);

    return searchMatch;
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE));
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-sans">
      {/* 1. Page Header & Booking Trigger */}
      <div className="flex flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            Appointments
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time OPD & tele-consultation queue management dashboard
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchLiveAppointments}
            className="p-2.5 text-[#1E4E70] bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 shadow-2xs"
            title="Refresh Appointments"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Top Filter Controls & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Time Filter Toggle (Upcoming / Past) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setTimeFilter("upcoming")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${timeFilter === "upcoming" ? "bg-[#1E4E70] text-white shadow-xs" : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTimeFilter("past")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${timeFilter === "past" ? "bg-[#1E4E70] text-white shadow-xs" : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"}`}
          >
            Past
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient or parent..."
            className="w-full bg-[#F8FAFC] border border-slate-200/80 text-xs font-medium text-slate-900 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-[#1E4E70] transition-colors"
          />
        </div>
      </div>

      {/* 3. Dashboard Table View (Matching Screenshot 1) */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 font-medium space-y-2">
            <RefreshCw className="w-6 h-6 text-[#1E4E70] animate-spin mx-auto" />
            <p>Syncing appointment records from backend API...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-16 text-center space-y-3 p-6">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Appointments Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No appointments matching your current search and filter criteria.
            </p>
          </div>
        ) : (
          <>
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-5">Patient & Parent Profile</th>
                  <th className="py-4 px-4">Date & Time Slot</th>
                  <th className="py-4 px-4">Contact Phone</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Consultation Fee</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {paginatedAppointments.map((apt) => {
                  const rawStatus = (apt.status || "scheduled").toLowerCase();
                  let statusBadgeClass = "bg-sky-50 text-[#1E4E70] border-sky-200";
                  let statusText = "Active";

                  if (rawStatus === "completed") {
                    statusBadgeClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
                    statusText = "Completed";
                  } else if (rawStatus === "cancelled") {
                    statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                    statusText = "Cancelled";
                  }

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Patient & Profile Click */}
                      <td className="py-3.5 px-5">
                        <Link
                          href={`/patients/${apt.patientId}?tab=profile`}
                          className="flex items-center gap-3 text-left group cursor-pointer"
                          title="Click to view complete patient profile file"
                        >
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200/80 relative shrink-0 bg-slate-100 group-hover:scale-105 transition-transform">
                            <Image
                              src={apt.patientAvatar || "/child_avatar_1.png"}
                              alt={apt.patientName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-xs group-hover:text-[#1E4E70] transition-colors flex items-center gap-1">
                              {apt.patientName}
                              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                            <span className="text-[11px] text-slate-400 block font-normal">
                              Parent: {apt.parentName}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                          <Clock className="w-3.5 h-3.5 text-[#1E4E70] shrink-0" />
                          <span>{apt.date} • {apt.time}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {apt.parentPhone ? apt.parentPhone.slice(0, -4) + "XXXX" : "N/A"}
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${statusBadgeClass}`}>
                          {statusText}
                        </span>
                      </td>

                      {/* Price / Fee */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{(apt as any).fee || 500}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {rawStatus !== "cancelled" && (
                            <button
                              onClick={() => {
                                setCancelModalApt(apt);
                                setCancellationReason("");
                              }}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-rose-200 cursor-pointer transition-colors"
                              title="Reject / Cancel Appointment"
                            >
                              Reject
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setEditModalApt(apt);
                              setEditNotes(apt.doctorNotes || "");
                            }}
                            className="p-2 text-slate-600 hover:text-[#1E4E70] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200/80"
                            title="Edit Doctor Notes or Tele-Consult Link"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden flex flex-col gap-4">
            {paginatedAppointments.map((apt) => {
              const rawStatus = (apt.status || "scheduled").toLowerCase();
              let statusBadgeClass = "bg-sky-50 text-[#1E4E70] border-sky-200";
              let statusText = "Active";

              if (rawStatus === "completed") {
                statusBadgeClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
                statusText = "Completed";
              } else if (rawStatus === "cancelled") {
                statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                statusText = "Cancelled";
              }

              return (
                <div key={apt.id} className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-4 hover:border-slate-300 transition-colors">
                  {/* Top: Profile Info & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200/80 relative shrink-0 bg-slate-100">
                        <Image
                          src={apt.patientAvatar || "/child_avatar_1.png"}
                          alt={apt.patientName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm truncate max-w-[150px]">{apt.patientName}</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Parent: {apt.parentName}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${statusBadgeClass}`}>
                      {statusText}
                    </span>
                  </div>

                  {/* Date, Time & Quick Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-[#1E4E70] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[10px] leading-tight text-slate-500 font-medium">{apt.date}</span>
                        <span className="text-xs leading-tight">{apt.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{(apt as any).fee || 500}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedMobileApt(apt)}
                      className="bg-[#1E4E70] text-white hover:bg-[#153852] font-semibold text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer flex-1 text-center shadow-xs"
                    >
                      Details
                    </button>
                    {(!apt.status || apt.status.toLowerCase() !== "cancelled") && (
                      <button
                        onClick={() => {
                          setCancelModalApt(apt);
                          setCancellationReason("");
                        }}
                        className="text-rose-600 font-semibold text-xs py-2 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 text-center"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200/80 bg-slate-50/50 mt-4 rounded-b-xl">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
          </>
        )}
      </div>

      {/* 4. PATIENT PROFILE SIDE DRAWER / MODAL */}
      {selectedPatientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex justify-end animate-fadeIn">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between font-sans">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#A5D8FF] relative shrink-0 bg-slate-100">
                    <Image
                      src={selectedPatientModal.avatar || "/child_avatar_1.png"}
                      alt={selectedPatientModal.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedPatientModal.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Child Patient File</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPatientModal(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient Basic Details Grid */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Patient Health Details
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Age</span>
                    <span className="font-bold text-slate-900">{selectedPatientModal.age || "1 Months"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Gender</span>
                    <span className="font-bold text-slate-900 capitalize">{selectedPatientModal.gender || "girl"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Parent Name</span>
                    <span className="font-bold text-slate-900">{selectedPatientModal.parentName || "Parent Account"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Phone Number</span>
                    <span className="font-bold text-slate-900 font-mono">{selectedPatientModal.phone || "N/A"}</span>
                  </div>
                </div>

                {/* Additional Clinical Info */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-lg space-y-1 text-xs">
                  <span className="font-bold text-emerald-900 block">Growth Score & WHO Status</span>
                  <p className="text-emerald-800 font-medium">
                    Growth Velocity: <span className="font-bold">{selectedPatientModal.growthScore || 90}/100</span> (WHO 50th Percentile Normal)
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPatientModal(null)}
              className="w-full bg-[#1E4E70] text-white font-semibold text-xs py-3 rounded-lg cursor-pointer hover:bg-[#153852] transition-colors"
            >
              Close Patient Profile
            </button>
          </div>
        </div>
      )}

      {/* 5. REJECTION / CANCELLATION MODAL */}
      {cancelModalApt && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setCancelModalApt(null)} />
          <form
            onSubmit={handleConfirmReject}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 font-sans relative z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Reject / Cancel Appointment</h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Please enter the cancellation reason for <span className="font-bold text-slate-900">{cancelModalApt.patientName}</span>. This reason will be logged into backend API.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Cancellation Reason *</label>
              <textarea
                required
                rows={3}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g. Doctor emergency OPD duty at requested time slot..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingCancel || !cancellationReason.trim()}
                className="px-4 py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmittingCancel ? "Cancelling..." : "Confirm Rejection"}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* 6. EDIT NOTES MODAL */}
      {editModalApt && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setEditModalApt(null)} />
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 font-sans relative z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Edit Appointment Details</h3>
              <button
                type="button"
                onClick={() => setEditModalApt(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Patient's Booking Notes</label>
              <div className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-500 italic">
                {editModalApt.notes || "No notes provided by patient."}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Doctor Notes</label>
              <textarea
                rows={4}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Clinical consultation observations..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditModalApt(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingEdit}
                className="px-4 py-2.5 text-xs font-semibold bg-[#1E4E70] hover:bg-[#153852] text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmittingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* 7. MOBILE BOTTOM SHEET FOR APPOINTMENT DETAILS */}
      {selectedMobileApt && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center animate-fadeIn sm:p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setSelectedMobileApt(null)} />
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-slideUp transform transition-transform max-h-[85vh] flex flex-col font-sans" onClick={e => e.stopPropagation()}>
            {/* Grab handle for bottom sheet effect */}
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Appointment Details</h2>
              <button
                onClick={() => setSelectedMobileApt(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* Patient Banner */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs relative shrink-0">
                  <Image
                    src={selectedMobileApt.patientAvatar || "/child_avatar_1.png"}
                    alt={selectedMobileApt.patientName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate text-base">{selectedMobileApt.patientName}</h3>
                  <Link
                    href={`/patients/${selectedMobileApt.patientId}?tab=profile`}
                    className="text-xs text-[#1E4E70] font-semibold hover:underline flex items-center gap-1 mt-0.5"
                  >
                    View Full File <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100/60">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</span>
                  <span className="text-sm font-bold text-slate-800">{selectedMobileApt.date} • {selectedMobileApt.time}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100/60">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parent</span>
                  <span className="text-sm font-bold text-slate-800">{selectedMobileApt.parentName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100/60">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</span>
                  <a href={`tel:${selectedMobileApt.parentPhone}`} className="text-sm font-bold text-[#1E4E70] flex items-center gap-1.5 bg-[#A5D8FF]/20 px-3 py-1 rounded-lg">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedMobileApt.parentPhone ? selectedMobileApt.parentPhone.slice(0, -4) + "XXXX" : "N/A"}
                  </a>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100/60">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                  <span className="text-sm font-bold text-slate-800 capitalize">{selectedMobileApt.status}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100/60">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Consultation Fee</span>
                  <span className="text-sm font-bold text-slate-800">₹{selectedMobileApt.fee || 500}</span>
                </div>
                
                {selectedMobileApt.status?.toLowerCase() === "cancelled" && selectedMobileApt.cancellationReason && (
                  <div className="flex justify-between items-start py-2 border-b border-slate-100/60">
                    <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider mt-0.5">Reason</span>
                    <span className="text-sm font-bold text-rose-600 text-right max-w-[200px]">{selectedMobileApt.cancellationReason}</span>
                  </div>
                )}
                
                {selectedMobileApt.notes && (
                  <div className="flex flex-col py-2 border-b border-slate-100/60 gap-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient's Notes</span>
                    <span className="text-xs italic text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">{selectedMobileApt.notes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons inside Bottom Sheet */}
              <div className="pt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedMobileApt(null);
                    setEditModalApt(selectedMobileApt);
                    setEditNotes(selectedMobileApt.doctorNotes || "");
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <FileText className="w-4 h-4" /> Doctor Notes
                </button>
                {(!selectedMobileApt.status || selectedMobileApt.status.toLowerCase() !== "cancelled") && (
                  <button
                    onClick={() => {
                      setSelectedMobileApt(null);
                      setCancelModalApt(selectedMobileApt);
                      setCancellationReason("");
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border border-rose-200"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
