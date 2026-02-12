import type { CourseFormData } from "@/features/courses/schemas/course.schema";
import { CourseService } from "@/features/courses/services/courseService";
import { showError, showSuccess } from "@/helpers/alerts";
import type { ApiError } from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

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
            showSuccess('Curso agregado')
        },
        onError: (error) => {
            showError('Error al crear curso')
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
            showSuccess('Curso actualizado')
        },
        onError: (error) => {
            showError('Error al editar curso')
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
            showSuccess('Curso eliminado exitosamente')
        },
        onError: (error) => {
            showError('Error al eliminar curso')
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
            showSuccess('Curso publicado exitosamente')
        },
        onError: (error: AxiosError<ApiError>) => {
            showError(error.response?.data?.message || 'Failed to publish course')
        },
    });
};

