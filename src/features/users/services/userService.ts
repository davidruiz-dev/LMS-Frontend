import type { UserFormData } from "@/features/users/schemas";
import { api } from "@/lib/client";
import type { PaginatedResponse, PaginationFilters, User } from "@/shared/types";

const USER_URL = "/users"

export const UsersService = {
  getAll: async (filters: PaginationFilters = { page: 1, limit: 10 }): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
    const { data } = await api.get(USER_URL, { params: filters });
    return data;
  },

  create: async (user: UserFormData) => {
    return await api.post(USER_URL, user)
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`${USER_URL}/${id}`)
    return response.data
  },

  update: async (id: string, user: FormData) => {
    return await api.patch(`${USER_URL}/${id}`, user, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete: async (id: string) => {
    return await api.delete(`${USER_URL}/${id}`)
  },

  // métodos opcionales
  findInstructorsByEmail: async (email: string): Promise<User[]> => {
    const trimmedEmail = email.trim();
    const response = await api.get<User[]>(`${USER_URL}/instructors/search`, {
      params: trimmedEmail ? { email: trimmedEmail } : {}
    });
    return response.data;
  },

  // findStudentsByEmail: async (email: string): Promise<User[]> => {
  //   const trimmedEmail = email.trim();
  //   const response = await api.get<User[]>(`${USER_URL}/students/search`, {
  //     params: trimmedEmail ? { email: trimmedEmail } : {}
  //   });
  //   return response.data;
  // },

  findStudentsByEmail: async (name?: string) => {
    let url = `${USER_URL}/students/search`;
    if (name) {
      url += `?email=${encodeURIComponent(name)}`;
    }
    return api.get(url);
  }
}