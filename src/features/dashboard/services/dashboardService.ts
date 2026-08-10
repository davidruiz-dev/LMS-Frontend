import { api } from "@/shared/lib/client"
import type { InstructorDashboardResponse, StudentDashboardResponse } from "../types/dashboard.types";

const DashboardService = {
    getStudentDashboard: async (): Promise<StudentDashboardResponse> => {
        const { data } = await api.get(`/dashboard/student`);
        return data;
    },
    
    getInstructorDashboard: async (): Promise<InstructorDashboardResponse> => {
        const { data } = await api.get(`/dashboard/instructor`);
        console.log(data)
        return data;
    }
}

export default DashboardService;