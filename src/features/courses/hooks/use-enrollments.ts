import type { EnrollmentFormData } from "@/features/courses/schemas/enrollment.schema";
import { EnrollmentService } from "@/features/courses/services/enrollmentService";
import { showError, showSuccess } from "@/helpers/alerts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useEnrollmentsByCourse(id: string | undefined) {
    return useQuery({
        queryKey: ['enrollments-course', id],
        queryFn: () => EnrollmentService.getAllByCourseId(id!),
        enabled: !!id
    })
}

export const useCreateEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (enrollment: EnrollmentFormData) => EnrollmentService.createEnrollment(enrollment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments-course'] })
            showSuccess('Inscripción creada')
        },
        onError: (error) => {
            showError('Error al crear inscripción')
            console.error(error);
        }
    })
}