import type { ModuleFormData } from "@/features/courses/schemas";
import { api } from "@/lib/client";
import type { Module } from "@/shared/types";

export const moduleService = {
    getModulesByCourse: async (courseId: string): Promise<Module[]> => {
        const response = await api.get(`/courses/${courseId}/modules`);
        return response.data;
    },

    createModule: async (courseId: string, moduleData: ModuleFormData) => {
        const response = await api.post(`/courses/${courseId}/modules`, moduleData);
        return response.data;
    },

    reorderModules: async (courseId: string, orderData: { modules: Module[]}) => {
        const response = await api.post(
            `/courses/${courseId}/modules/reorder`, orderData);
        return response.data;
    }
}