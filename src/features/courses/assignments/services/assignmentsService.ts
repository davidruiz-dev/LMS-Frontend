import type { AssignmentFormDataCreate } from "@/features/courses/assignments/schemas/assignment.schema";
import type { AssignmentFilters } from "@/features/courses/assignments/types/assignment.types";
import { api } from "@/lib/client"
import type { Assignment } from "@/shared/types";


export const AssignmentService = {
    // find assignments by course
    findAllByCourse: async (courseId: string, filters?: AssignmentFilters): Promise<Assignment[]> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        const { data } = await api.get(`courses/${courseId}/assignments`, { params })
        return data;
    },

    findUpcomingByCourse: async (courseId: string): Promise<Assignment[]> => {
        const { data } = await api.get(`courses/${courseId}/assignments/upcoming`)
        return data;
    },

    findOneByCourse: async (courseId: string, id: string): Promise<Assignment> => {
        const { data } = await api.get(`courses/${courseId}/assignments/${id}`)
        return data;
    },

    // create assignment
    create: async (courseId: string, assignmentFormData: AssignmentFormDataCreate): Promise<Assignment> => {
        const { data } = await api.post(`courses/${courseId}/assignments`, assignmentFormData)
        return data;
    },

    publish: async (courseId: string, assignmentId: string) => {
        const { data } = await api.post(`courses/${courseId}/assignments/${assignmentId}/publish`)
        return data
    },

    unpublish: async (courseId: string, assignmentId: string) => {
        const { data } = await api.post(`courses/${courseId}/assignments/${assignmentId}/unpublish`)
        return data
    }
}