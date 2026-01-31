import type { Course } from "@/features/courses/types/course.types";
import { api } from "@/lib/client"

const DashboardService = {
    // mover este método a otro servicio para coordinar mejor la arquitectura
    findAllEnrolledCourses: async (id: string): Promise<Course[]> => {
        const { data } = await api.get(`/enrollments/user/${id}`);
        return data;
    },
    
    findEnrolledActiveCourses: async (id: string): Promise<Course[]> => {
        const { data } = await api.get(`/enrollments/active/user/${id}`);
        return data;
    }
}

export default DashboardService;