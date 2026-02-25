import type { EnrollmentFormData } from "@/features/courses/enrollments/schemas/enrollment.schema";
import type { Enrollment } from "@/features/courses/enrollments/types/enrollment.types";
import { api } from "@/lib/client";

export const EnrollmentService = {
    // devuelve las inscripciones del usuario actual
    getMyEnrollments: async (): Promise<Enrollment[]> => {
        const { data } = await api.get<Enrollment[]>(`enrollments/me`);
        return data;
    },
    
    createEnrollment: async (courseId: string, enrollmentFormData: EnrollmentFormData) => {
        const { data } = await api.post(`courses/${courseId}/enrollments`, enrollmentFormData);
        return data;
    },

    getAllByCourseId: async (courseId: string): Promise<Enrollment[]> => {
        const { data } = await api.get(`/courses/${courseId}/enrollments`)
        return data
    },

    deactivateEnrollment: async (id: string) => {
        const { data } = await api.post(`enrollments/${id}/deactivate`)
        return data;
    }
}