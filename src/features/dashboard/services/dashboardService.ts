import { api } from "@/shared/lib/client"
import type { StudentDashboardResponse } from "../types/dashboard.types";

const DashboardService = {
    getStudentDashboard: async (): Promise<StudentDashboardResponse> => {
        const { data } = await api.get(`/dashboard/student`);
        return data;
    },
    

}

export default DashboardService;