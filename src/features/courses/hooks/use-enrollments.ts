import { type EnrollmentFormData } from '../schemas/module.schema';
import { EnrollmentService } from "@/features/courses/services/enrollmentService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from 'sweetalert2';

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
            Swal.fire({
                icon: "success",
                title: "Inscripción creada",
                showConfirmButton: false,
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error al crear inscripción",
                showConfirmButton: false,
                timer: 2000
            });
            console.error(error);
        }
    })
}