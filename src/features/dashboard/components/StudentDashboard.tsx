import CourseCard from '@/features/courses/components/CourseCard';
import type { Course } from '@/features/courses/types/course.types';
import DashboardService from '@/features/dashboard/services/dashboardService';
import { useEffect, useState, type FC } from 'react'

interface Props {
    studentId: string;
}

const StudentDashboard: FC<Props> = ({ studentId }) => {
    const [courses, setCoures] = useState<Course[]>([]);

    const fetchCoursesEnrolleds = async (studentId: string) => {
        const response = await DashboardService.findEnrolledActiveCourses(studentId);
        setCoures(response);
    };

    useEffect(()=>{
        fetchCoursesEnrolleds(studentId);
    },[])

    return (
        <div className='space-y-4'>
            <h1 className='text-2xl font-semibold'>Bienvenido</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {courses.map((course)=>(
                    <CourseCard key={course.id} course={course}/>
                ))}
            </div>
        </div>
    )
}

export default StudentDashboard