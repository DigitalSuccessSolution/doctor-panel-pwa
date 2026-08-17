import { getStoredToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ReviewItem {
  _id?: string;
  id?: string;
  patientName?: string;
  rating: number;
  comment?: string;
  review?: string;
  createdAt?: string;
}

export const reviewService = {
  getReviews: async (): Promise<{ success: boolean; data: ReviewItem[] }> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/review`, {
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
      console.error("Failed to fetch reviews:", err);
      return { success: false, data: [] };
    }
  },
};
