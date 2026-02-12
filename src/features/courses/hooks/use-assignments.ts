import type { AssignmentFormDataCreate } from "@/features/courses/schemas/assignment.schema";
import { AssignmentService } from "@/features/courses/services/assignmentsService"
import { showError, showSuccess } from "@/helpers/alerts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useAssignments = (courseId: string) => {
    return useQuery({
        queryKey: ['assignments', courseId],
        queryFn: () => AssignmentService.findAllByCourse(courseId),
        enabled: !!courseId
    })
};

export const useCreateAssignment = (courseId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: AssignmentFormDataCreate) => AssignmentService.create(courseId, data),
        onSuccess: () => {
            showSuccess('Tarea creada correctamente')
            qc.invalidateQueries({ queryKey: ['assignments', courseId]})
        },
        onError: (error) => {
            showError(`Error al crear la tarea. ${error.message}`)
            console.log(error.message)
        }
    })
}

export const useAssignment = (courseId: string, id: string) => {
    return useQuery({
        queryKey: ['assignment', courseId, id],
        queryFn: () => AssignmentService.findOneByCourse(courseId, id),
        enabled: !!id && !!courseId
    })
}

export const useAssignmentPublish = (courseId: string) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (assignmentId: string) =>
            AssignmentService.publish(courseId, assignmentId),

        onSuccess: (_, assignmentId) => {
            qc.invalidateQueries({
                queryKey: ['assignments', courseId],
            });

            qc.invalidateQueries({
                queryKey: ['assignment', courseId, assignmentId],
            });

            showSuccess('Tarea publicada');
        }
    });
}


export const useAssignmentUnpublish = (courseId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (assignmentId: string) => AssignmentService.unpublish(courseId, assignmentId),
        onSuccess: (_, assignmentId) => {
            qc.invalidateQueries({
                queryKey: ['assignments', courseId],
            });
            qc.invalidateQueries({
                queryKey: ['assignment', courseId, assignmentId],
            });
            showSuccess('Tarea despublicada')
        },
        onError: (error) => {
            showError(`Error. ${error.message}`)
            console.log(error.message)
        }
    })
}