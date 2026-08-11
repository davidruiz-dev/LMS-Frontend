import { api } from "@/shared/lib/client"
import type { AdminDashboardResponse, InstructorDashboardResponse, StudentDashboardResponse } from "../types/dashboard.types";

const DashboardService = {
    getStudentDashboard: async (): Promise<StudentDashboardResponse> => {
        const { data } = await api.get(`/dashboard/student`);
        return data;
    },
    
    getInstructorDashboard: async (): Promise<InstructorDashboardResponse> => {
        const { data } = await api.get(`/dashboard/instructor`);
        return data;
    },

    getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
        const { data } = await api.get(`/dashboard/admin`);
        return data;
    }
}

export default DashboardService;