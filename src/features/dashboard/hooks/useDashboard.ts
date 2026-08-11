import { useQuery } from "@tanstack/react-query";
import DashboardService from "../services/dashboardService";

export const useStudentDashboard = () => {
    return useQuery({
        queryKey: ["student-dashboard"],
        queryFn: () => DashboardService.getStudentDashboard(),
    });
};

export const useInstructorDashboard = () => {
    return useQuery({
        queryKey: ["instructor-dashboard"],
        queryFn: () => DashboardService.getInstructorDashboard(),
    });
};

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: () => DashboardService.getAdminDashboard(),
    });
};