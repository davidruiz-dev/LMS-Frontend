import CourseCard from "@/features/courses/components/CourseCard";
import { useAdminDashboard } from "../hooks/useDashboard";

const AdminDashboard = () => {
  const { data: adminDashboard } = useAdminDashboard();
  if (!adminDashboard) return null;
  const { courses } = adminDashboard;

  return (
    <div>
      <div className='space-y-4 pt-4'>
        <h1 className="text-3xl font-bold tracking-tight">Cursos disponibles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard