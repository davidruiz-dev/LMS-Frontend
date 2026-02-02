import type { EnrollmentFormData } from "@/features/courses/schemas";
import type { Enrollment } from "@/features/courses/types/course.types";
import { api } from "@/lib/client";

const ENROLLMENT_URL = '/enrollments';

export const EnrollmentService = {
    // devuelve las inscripciones del usuario actual
    getMyEnrollments: async (): Promise<Enrollment[]> => {
        const { data } = await api.get<Enrollment[]>(`${ENROLLMENT_URL}/me`);
        return data;
    },

    getAllByCourseId: async (id: string): Promise<Enrollment[]> => {
        const { data } = await api.get(`${ENROLLMENT_URL}/course/${id}`)
        return data
    },

    createEnrollment: async (enrollmentFormData: EnrollmentFormData) => {
        const { data } = await api.post(`${ENROLLMENT_URL}`, enrollmentFormData);
        return data;
    }
}