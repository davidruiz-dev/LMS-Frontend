import { api } from "@/lib/client";
import type { Submission } from "../types/assignment.types";

export const SubmissionService = {
    createSubmission: async (courseId:string, assignmentId: string, content: string, files: File[]) => {
        const formData = new FormData();
        formData.append('assignmentId', assignmentId);
        formData.append('courseId', courseId);
        if (content) formData.append('content', content);
        files.forEach((file) => formData.append('files', file));

        const { data } = await api.post<Submission>('/submissions', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return data;
    },

    getMySubmissions: async (assignmentId: string): Promise<Submission[]> => {
        const { data } = await api.get(`/assignments/${assignmentId}/submissions/me`);
        return data;
    },

    findOneSubmission: async (submissionId: string): Promise<Submission> => {
        const { data } = await api.get(`submissions/${submissionId}`)
        return data;
    }
}