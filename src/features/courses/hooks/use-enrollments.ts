import type { EnrollmentFormData } from "@/features/courses/enrollments/schemas/enrollment.schema";
import { EnrollmentService } from "@/features/courses/enrollments/services/enrollmentService";
import { showError, showSuccess } from "@/helpers/alerts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useEnrollmentsByCourse(id: string) {
    return useQuery({
        queryKey: ['enrollments-course', id],
        queryFn: () => EnrollmentService.getAllByCourseId(id),
        enabled: !!id
    })
}

export const useCreateEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({courseId, enrollment} : {courseId: string, enrollment: EnrollmentFormData}) => EnrollmentService.createEnrollment(courseId, enrollment),
        onSuccess: (_, params) => {
            queryClient.invalidateQueries({ queryKey: ['enrollments-course', params.courseId] })
            showSuccess('Inscripción creada')
        },
        onError: (error) => {
            showError('Error al crear inscripción')
            console.error(error);
        }
    })
}

export const useDeactivateEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (courseId: string) => EnrollmentService.deactivateEnrollment(courseId),
        onSuccess: (_, courseId) => {
            queryClient.invalidateQueries({ queryKey: ['enrollments-course', courseId] })
            showSuccess('Inscripción cancelada')
        },
        onError: (error) => {
            showError('Error al cancelar la inscripción')
            console.error(error);
        }
    })
}