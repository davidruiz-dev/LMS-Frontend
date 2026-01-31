import type { GradeLevel } from "@/features/grade-level/types";
import { api } from "@/lib/client";
import type { PaginatedResponse } from "@/shared/types";

const API_GRADE_LEVEL = '/grade-level';

export const GradeLevelService = {
  getAll: async (filters: any = {}): Promise<PaginatedResponse<GradeLevel>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
    const { data } = await api.get(API_GRADE_LEVEL, { params });
    return data;
  },

  create: async (gradeLevel: Omit<GradeLevel, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await api.post(API_GRADE_LEVEL, gradeLevel);
  },

  getById: async (id: string): Promise<GradeLevel> => {
    const response = await api.get(`${API_GRADE_LEVEL}/${id}`);
    return response.data;
  },

  update: async (id: string, gradeLevel: GradeLevel) => {
    return await api.patch(`${API_GRADE_LEVEL}/${id}`, gradeLevel);
  },

  softDelete: async (id: number) => {
    return await api.delete(`${API_GRADE_LEVEL}/${id}`);
  },

  findByName: async (name?: string) => {
    let url = `${API_GRADE_LEVEL}/search`;
    if (name) {
      url += `?name=${encodeURIComponent(name)}`;
    }
    return api.get(url);
  }
}