import type { LoginCredentials, LoginResponse } from "@/features/auth/types";
import { api } from "@/lib/client";

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await api.get<any>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};