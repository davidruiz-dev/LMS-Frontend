import type { AssignmentFormDataCreate } from "@/features/courses/schemas/assignment.schema";
import type { Assignment } from "@/features/courses/types/course.types";
import { api } from "@/lib/client"


export const AssignmentService = {
    // find assignments by courseId
    findAllByCourse: async (courseId: string): Promise<Assignment[]> => {
        const { data } = await api.get(`courses/${courseId}/assignments`)
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
    }
}