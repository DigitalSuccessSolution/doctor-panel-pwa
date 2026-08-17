import { getStoredToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface EarningItem {
  _id?: string;
  id?: string;
  amount: number;
  status: "pending" | "paid";
  staffRole?: string;
  createdAt?: string;
  notes?: string;
}

export interface EarningApiResponse {
  success: boolean;
  count?: number;
  totalEarned?: number;
  pendingAmount?: number;
  paidAmount?: number;
  data?: EarningItem[];
}

export const earningService = {
  getEarnings: async (): Promise<EarningApiResponse> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/earnings`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return {
        success: data.success ?? res.ok,
        count: data.count ?? 0,
        totalEarned: data.totalEarned ?? 0,
        pendingAmount: data.pendingAmount ?? 0,
        paidAmount: data.paidAmount ?? 0,
        data: Array.isArray(data.data) ? data.data : [],
      };
    } catch (err) {
      console.error("Failed to fetch earnings:", err);
      return {
        success: false,
        count: 0,
        totalEarned: 0,
        pendingAmount: 0,
        paidAmount: 0,
        data: [],
      };
    }
  },
};
