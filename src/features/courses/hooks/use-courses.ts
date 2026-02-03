import type { CourseFormData } from "@/features/courses/schemas/course.schema";
import { CourseService } from "@/features/courses/services/courseService";
import type { ApiError } from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import Swal from "sweetalert2"

export const useCourses = (filters: any = {}) => {
    return useQuery({
        queryKey: ["courses", filters],
        queryFn: () => CourseService.getAll(filters),
    });
};

export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ course, image }: { course: CourseFormData, image?: File }) => CourseService.create(course, image),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            Swal.fire({
                icon: "success",
                title: "Curso agregado",
                showConfirmButton: false,
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error al añadir curso",
                showConfirmButton: false,
                timer: 2000
            });
            console.error(error);
        }
    })
};

export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, course, image }: { id: string; course: CourseFormData, image?: File }) =>
            CourseService.update(id, course, image),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
            Swal.fire({
                icon: "success",
                title: "Curso actualizado",
                showConfirmButton: false,
                timer: 1500
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error al editar curso",
                showConfirmButton: false,
                timer: 1500
            });
            console.error(error);
        },
    });
}

export function useCourse(id: string | undefined) {
    return useQuery({
        queryKey: ['course', id],
        queryFn: () => CourseService.getById(id!),
        enabled: !!id, // Solo ejecutar si existe un ID
    });
}

export const useDeleteCourse = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => CourseService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            Swal.fire({
                icon: "success",
                title: "Curso eliminado exitosamente",
                showConfirmButton: false,
                timer: 1500
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error al eliminar curso",
                showConfirmButton: false,
                timer: 1500
            });
            console.error(error);
        }
    })
}

// Publish Course
export const usePublishCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => CourseService.publishCourse(id),
        onSuccess: (updatedCourse, id) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['course', id] });
            Swal.fire({
                icon: "success",
                title: "Curso publicado exitosamente",
                showConfirmButton: false,
                timer: 1500
            });
        },
        onError: (error: AxiosError<ApiError>) => {
            Swal.fire({
                icon: "error",
                title: "Error al eliminar curso",
                text: error.response?.data?.message || 'Failed to publish course',
                showConfirmButton: false,
                timer: 1500
            });
        },
    });
};

