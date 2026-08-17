"use client";

import { useState, useEffect } from "react";
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

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
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
  const [editMeetingLink, setEditMeetingLink] = useState<string>("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);

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

  const handleOpenQuickAdd = () => {
    window.dispatchEvent(new CustomEvent("open-quick-add", { detail: { tab: "consultation" } }));
  };

  // Confirm / Accept Appointment
  const handleConfirmAppointment = async (aptId: string) => {
    try {
      const res = await appointmentService.updateStatus(aptId, "scheduled");
      if (res.success || res.data) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === aptId ? { ...a, status: "scheduled" as any } : a))
        );
      }
    } catch (err) {
      console.error("Failed to confirm appointment:", err);
    }
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
        notes: editNotes.trim(),
        doctorNotes: editNotes.trim(),
        meetingLink: editMeetingLink.trim(),
      });

      if (res.success || res.data) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === editModalApt.id
              ? { ...a, notes: editNotes.trim(), doctorNotes: editNotes.trim(), meetingLink: editMeetingLink.trim() }
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
      age: apt.patientAge || "1 Months",
      parentName: apt.parentName,
      phone: apt.parentPhone,
      gender: "girl",
      growthScore: 90,
    };
    setSelectedPatientModal(fullPatient);
  };

  // Filter appointments
  const filteredAppointments = [...appointments].filter((apt) => {
    const statusMatch =
      selectedStatus === "all" ||
      (selectedStatus === "active" && (apt.status === "scheduled" || apt.status === "Upcoming" || apt.status === "confirmed")) ||
      (selectedStatus === "pending" && apt.status === "pending") ||
      (selectedStatus === "completed" && (apt.status === "completed" || apt.status === "Completed")) ||
      (selectedStatus === "cancelled" && (apt.status === "cancelled" || apt.status === "Cancelled"));

    const query = searchQuery.toLowerCase().trim();
    const searchMatch =
      !query ||
      apt.patientName?.toLowerCase().includes(query) ||
      apt.parentName?.toLowerCase().includes(query) ||
      apt.parentPhone?.toLowerCase().includes(query);

    return statusMatch && searchMatch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn pb-24 font-sans overflow-hidden">
      {/* 1. Page Header & Booking Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: `All (${appointments.length})` },
            { id: "active", label: "Active / Confirmed" },
            { id: "pending", label: "Pending Approval" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === tab.id
                  ? "bg-[#1E4E70] text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient or parent..."
            className="w-full bg-[#F8FAFC] border border-slate-200/80 text-xs font-medium text-slate-900 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
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
          <div className="overflow-x-auto">
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
                {filteredAppointments.map((apt) => {
                  const rawStatus = (apt.status || "scheduled").toLowerCase();
                  let statusBadgeClass = "bg-sky-50 text-[#1E4E70] border-sky-200";
                  let statusText = "Active";

                  if (rawStatus === "pending") {
                    statusBadgeClass = "bg-amber-50 text-amber-800 border-amber-200";
                    statusText = "Pending";
                  } else if (rawStatus === "completed") {
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
                          {rawStatus === "pending" && (
                            <button
                              onClick={() => handleConfirmAppointment(apt.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                              title="Accept & Confirm Appointment"
                            >
                              Confirm
                            </button>
                          )}

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
                              setEditNotes(apt.notes || "");
                              setEditMeetingLink(apt.meetingLink || "");
                            }}
                            className="p-2 text-slate-600 hover:text-[#1E4E70] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200/80"
                            title="Edit Notes or Tele-Consult Link"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. PATIENT PROFILE SIDE DRAWER / MODAL */}
      {selectedPatientModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end animate-fadeIn">
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
      {cancelModalApt && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <form
            onSubmit={handleConfirmReject}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 font-sans"
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
        </div>
      )}

      {/* 6. EDIT NOTES MODAL */}
      {editModalApt && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 font-sans"
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
              <label className="text-xs font-semibold text-slate-700">Doctor Notes</label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Clinical consultation observations..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Video Consultation Link (optional)</label>
              <input
                type="url"
                value={editMeetingLink}
                onChange={(e) => setEditMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/xyz..."
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
        </div>
      )}
    </div>
  );
}
