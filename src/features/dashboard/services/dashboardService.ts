import type { Enrollment } from "@/features/courses/enrollments/types/enrollment.types";
import type { Course } from "@/features/courses/types/course.types";
import { api } from "@/lib/client"

const DashboardService = {
    // mover este método a otro servicio para coordinar mejor la arquitectura
    findAllEnrolledCourses: async (): Promise<Course[]> => {
        const { data } = await api.get(`/enrollments/me`);
        return await data.map((enrollment: Enrollment) => enrollment.course)
    },
    
    findEnrolledActiveCourses: async (): Promise<Course[]> => {
        const { data } = await api.get(`/enrollments/me/active`);
        return await data.map((enrollment: Enrollment) => enrollment.course)
    }
}

export default DashboardService;