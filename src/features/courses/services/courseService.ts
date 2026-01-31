import type { CourseFormData } from "@/features/courses/schemas";
import { api } from "@/lib/client";
import type { Course, PaginatedResponse, PaginationFilters, } from "@/shared/types";

const COURSE_URL = "/courses"

export const CourseService = {
  getAll: async (filters: PaginationFilters = { page: 1, limit: 10}): Promise<PaginatedResponse<Course>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
    const { data } = await api.get(COURSE_URL, {params: filters});
    return data;
  },

  create: async (course: CourseFormData, image?: File) => {
    const formData = new FormData();
    formData.append('name', course.name)
    formData.append('description', course.description)
    formData.append('short_description', course.short_description)
    formData.append('gradeLevelId', course.gradeLevelId)
    formData.append('instructorId', course.instructorId)
    formData.append('startDate', course.startDate.toString())
    formData.append('endDate', course.endDate.toString())
    formData.append('status', course.status.toString())
    if (image) {
      formData.append('imagen', image)
    }
    const response = await api.post(COURSE_URL, formData, {
      headers: { 
        "Content-Type": "multipart/form-data"
      }
    })
    return response.data;
  },

  getById: async (id: string): Promise<Course> => {
    const response = await api.get(`${COURSE_URL}/${id}`)
    return response.data
  },

  update: async (id: string, course: CourseFormData, image?: File) => {
    const formData = new FormData();
    formData.append('name', course.name)
    formData.append('description', course.description)
    formData.append('short_description', course.short_description)
    formData.append('gradeLevelId', course.gradeLevelId)
    formData.append('instructorId', course.instructorId)
    formData.append('startDate', course.startDate.toString())
    formData.append('endDate', course.endDate.toString())
    formData.append('status', course.status.toString())
    if (image) {
      formData.append('imagen', image)
    }
    const response = await api.patch(`${COURSE_URL}/${id}`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data"
      }
    })
    return response.data;
  },

  delete: async (id: number) => {
    return await api.delete(`${COURSE_URL}/${id}`)
  },

  publishCourse: async (id: string): Promise<Course> => {
    const { data } = await api.post<Course>(`/courses/${id}/publish`);
    return data;
  },
}