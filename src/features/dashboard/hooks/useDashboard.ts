import { useQuery } from "@tanstack/react-query";
import DashboardService from "../services/dashboardService";

export const useStudentDashboard = () => {
    return useQuery({
        queryKey: ["student-dashboard"],
        queryFn: () => DashboardService.getStudentDashboard(),
    });
};