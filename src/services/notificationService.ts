import { getStoredToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface NotificationItem {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  type?: "info" | "warning" | "alert" | "appointment";
  isRead?: boolean;
  createdAt?: string;
}

export const notificationService = {
  getNotifications: async (): Promise<{ success: boolean; data: NotificationItem[] }> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/notification`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return {
        success: data.success ?? res.ok,
        data: Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [],
      };
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      return { success: false, data: [] };
    }
  },

  markAsRead: async (id: string): Promise<{ success: boolean }> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/notification/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return { success: data.success ?? res.ok };
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      return { success: false };
    }
  },

  deleteNotification: async (id: string): Promise<{ success: boolean }> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/notification/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return { success: data.success ?? res.ok };
    } catch (err) {
      console.error("Failed to delete notification:", err);
      return { success: false };
    }
  },
};
