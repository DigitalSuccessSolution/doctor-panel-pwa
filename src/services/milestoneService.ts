import { getStoredToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface BabyMilestone {
  _id?: string;
  id?: string;
  babyId: string;
  milestoneName?: string;
  title?: string;
  category?: string;
  achievedAgeMonths?: number;
  achievedDate?: string;
  notes?: string;
  status?: "verified" | "achieved" | "pending" | "scheduled";
  createdAt?: string;
}

export interface StandardMilestone {
  _id?: string;
  id?: string;
  title: string;
  category?: string;
  expectedAgeMonths?: number;
  description?: string;
}

export const milestoneService = {
  // Get standard WHO developmental milestones
  getStandardMilestones: async (): Promise<{ success: boolean; data: StandardMilestone[] }> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/standard-milestones`, {
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
      console.error("Failed to fetch standard milestones:", err);
      return { success: false, data: [] };
    }
  },

  // Get milestone achievements recorded for a specific baby
  getBabyMilestones: async (babyId: string): Promise<{ success: boolean; data: BabyMilestone[] }> => {
    if (!babyId) return { success: false, data: [] };
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/milestones/${babyId}`, {
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
      console.error("Failed to fetch baby milestones:", err);
      return { success: false, data: [] };
    }
  },

  // Record/add milestone for a baby
  addBabyMilestone: async (payload: { babyId: string; title: string; notes?: string; achievedDate?: string }): Promise<{ success: boolean; data?: BabyMilestone }> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/milestones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return {
        success: data.success ?? res.ok,
        data: data.data || data,
      };
    } catch (err) {
      console.error("Failed to add baby milestone:", err);
      return { success: false };
    }
  },
};
