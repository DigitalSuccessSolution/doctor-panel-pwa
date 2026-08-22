/**
 * Appointment Service for Doctor PWA
 * Handles fetching, creating, and updating appointments via backend API (/api/appointments).
 */

import { apiFetch, ApiResponse } from "./apiClient";
import { API_CONFIG } from "@/config/api.config";
import { Appointment } from "@/data/mockData";

/**
 * Transforms raw backend Appointment payload into frontend Appointment model
 */
export function transformBackendAppointmentToFrontend(app: any): Appointment {
  const baby = typeof app.babyId === "object" && app.babyId !== null ? app.babyId : {};
  const parent = typeof app.parentId === "object" && app.parentId !== null ? app.parentId : {};
  const doctor = typeof app.doctorId === "object" && app.doctorId !== null ? app.doctorId : {};

  const babyIdStr =
    typeof app.babyId === "object" && app.babyId !== null ? baby._id || baby.id : String(app.babyId || "");
  const parentIdStr =
    typeof app.parentId === "object" && app.parentId !== null ? parent._id || parent.id : String(app.parentId || "");
  const doctorIdStr =
    typeof app.doctorId === "object" && app.doctorId !== null ? doctor._id || doctor.id : String(app.doctorId || "");
  const appIdStr = String(app._id || app.id);

  // Map backend status ('scheduled' | 'completed' | 'cancelled') to UI Status
  let uiStatus: "Upcoming" | "Completed" | "Cancelled" = "Upcoming";
  if (app.status === "completed") uiStatus = "Completed";
  else if (app.status === "cancelled") uiStatus = "Cancelled";
  else uiStatus = "Upcoming";

  return {
    id: appIdStr,
    patientId: babyIdStr,
    patientName: baby.name || app.patientName || "Child Patient",
    patientAvatar: baby.avatar || app.patientAvatar || "/child_avatar_1.png",
    parentId: parentIdStr,
    parentName: parent.name || app.parentName || "Parent Account",
    parentPhone: parent.phone || app.parentPhone || "",
    doctorId: doctorIdStr,
    doctorName: doctor.name || app.doctorName || "",
    date: app.date || "",
    time: app.time || "",
    status: uiStatus,
    type: app.type || "Consultation",
    notes: app.notes || "",
    doctorNotes: app.doctorNotes || "",
    meetingLink: app.meetingLink || "",
    cancellationReason: app.cancellationReason || "",
  };
}

export const appointmentService = {
  /**
   * Fetch appointments list from backend
   * GET /api/appointments
   */
  async fetchAppointments(): Promise<ApiResponse<any[]>> {
    return apiFetch<any[]>(API_CONFIG.ENDPOINTS.APPOINTMENTS.LIST, {
      method: "GET",
    });
  },

  /**
   * Create a new appointment
   * POST /api/appointments
   */
  async createAppointment(data: {
    doctorId?: string;
    babyId: string;
    date: string;
    time?: string;
    timeSlot?: string;
    type?: string;
    notes?: string;
  }): Promise<ApiResponse<any>> {
    return apiFetch<any>(API_CONFIG.ENDPOINTS.APPOINTMENTS.CREATE, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        timeSlot: data.timeSlot || data.time || "10:00",
      }),
    });
  },

  /**
   * Update appointment details (date, time, notes, doctorNotes, meetingLink)
   * PUT /api/appointments/:id
   */
  async updateAppointment(
    id: string,
    data: {
      doctorId?: string;
      babyId?: string;
      date?: string;
      time?: string;
      notes?: string;
      doctorNotes?: string;
      meetingLink?: string;
      status?: "scheduled" | "completed" | "cancelled";
    }
  ): Promise<ApiResponse<any>> {
    return apiFetch<any>(API_CONFIG.ENDPOINTS.APPOINTMENTS.BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update appointment status (scheduled | completed | cancelled)
   * PATCH /api/appointments/:id/status
   */
  async updateStatus(
    id: string,
    status: "scheduled" | "completed" | "cancelled",
    extra?: { meetingLink?: string; cancellationReason?: string }
  ): Promise<ApiResponse<any>> {
    return apiFetch<any>(API_CONFIG.ENDPOINTS.APPOINTMENTS.STATUS(id), {
      method: "PATCH",
      body: JSON.stringify({
        status,
        ...extra,
      }),
    });
  },
};
