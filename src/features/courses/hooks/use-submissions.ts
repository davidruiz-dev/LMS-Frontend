// features/assignments/submissions.hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Submission } from "../assignments/types/assignment.types";
import { api } from "@/lib/client";
import { showError, showSuccess } from "@/helpers/alerts";
import { SubmissionService } from "../assignments/services/submissionService";
import type { ApiError } from "@/shared/types";

// ── Keys ──────────────────────────────────────────────────────────────────────

export const submissionKeys = {
    all: ["submissions"] as const,
    byAssignment: (assignmentId: string) =>
        [...submissionKeys.all, "assignment", assignmentId] as const,
    mine: (submissionId: string) =>
        [...submissionKeys.all, "mine", submissionId] as const,
    byId: (submissionId: string) =>
        [...submissionKeys.all, "byId", submissionId] as const,
};

export function useCreateSubmission(courseId: string, assignmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, files }: { content: string; files: File[] }) =>
      SubmissionService.createSubmission(courseId,assignmentId, content, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', assignmentId] });
      showSuccess('Tarea entregada correctamente');
    },
    onError: (error: ApiError) => {
      showError(error.message ?? 'Error al entregar la tarea');
    },
  });
}
// ── useAssignmentSubmissions ──────────────────────────────────────────────────

export function useAssignmentSubmissions(assignmentId: string) {
    return useQuery({
        queryKey: submissionKeys.byAssignment(assignmentId),
        queryFn: () =>
            api
                .get<Submission[]>(`assignments/${assignmentId}/submissions`)
                .then((r) => r.data),
        enabled: !!assignmentId,
        staleTime: 30_000,
    });
}

export function useMySubmissions(submissionId: string){
    return useQuery({
        queryKey: submissionKeys.mine(submissionId),
        queryFn: () => SubmissionService.getMySubmissions(submissionId),
        enabled: !!submissionId
    })
}

export function useSubmission(submissionId: string){
    return useQuery({
        queryKey: submissionKeys.byId(submissionId),
        queryFn: () => SubmissionService.findOneSubmission(submissionId),
        enabled: !!submissionId
    })
}

// ── useGradeSubmission ────────────────────────────────────────────────────────

export function useGradeSubmission() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
            submissionId,
            grade,
            feedback,
        }: {
            submissionId: string;
            grade: number;
            feedback?: string;
        }) =>
            api
                .patch<Submission>(`submissions/${submissionId}/grade`, {
                    grade,
                    feedback,
                })
                .then((r) => r.data),

        onSuccess: (updated) => {
            // Actualiza la lista de todas las entregas del assignment
            qc.setQueryData<Submission[]>(
                submissionKeys.byAssignment(updated.assignmentId),
                (prev) =>
                    prev?.map((s) => (s.id === updated.id ? updated : s)) ?? []
            );

            // Invalida las entregas del propio estudiante por si está en caché
            qc.invalidateQueries({
                queryKey: submissionKeys.mine(updated.assignmentId),
            });
        },
    });
}