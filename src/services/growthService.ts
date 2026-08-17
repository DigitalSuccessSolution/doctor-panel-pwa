import { apiFetch, ApiResponse } from "./apiClient";
import { API_CONFIG } from "@/config/api.config";

export interface GrowthRecord {
  _id?: string;
  id?: string;
  babyId: string;
  recordedBy?: string;
  weight: number; // in kg
  height: number; // in cm
  headCircumference?: number; // in cm
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const growthService = {
  /**
   * Get growth records for a specific baby
   * GET /api/growth/:babyId
   */
  async getGrowthRecords(babyId: string): Promise<ApiResponse<GrowthRecord[]>> {
    return apiFetch<GrowthRecord[]>(API_CONFIG.ENDPOINTS.GROWTH.BY_BABY(babyId), {
      method: "GET",
    });
  },

  /**
   * Add a new growth record for a baby
   * POST /api/growth
   */
  async addGrowthRecord(data: {
    babyId: string;
    weight: number;
    height: number;
    headCircumference?: number;
    notes?: string;
  }): Promise<ApiResponse<GrowthRecord>> {
    return apiFetch<GrowthRecord>(API_CONFIG.ENDPOINTS.GROWTH.LIST, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a growth record
   * PUT /api/growth/:id
   */
  async updateGrowthRecord(
    id: string,
    data: { weight?: number; height?: number; headCircumference?: number; notes?: string }
  ): Promise<ApiResponse<GrowthRecord>> {
    return apiFetch<GrowthRecord>(`${API_CONFIG.ENDPOINTS.GROWTH.LIST}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a growth record
   * DELETE /api/growth/:id
   */
  async deleteGrowthRecord(id: string): Promise<ApiResponse<any>> {
    return apiFetch<any>(`${API_CONFIG.ENDPOINTS.GROWTH.LIST}/${id}`, {
      method: "DELETE",
    });
  },
};
