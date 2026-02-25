import DataTableCourses from "@/features/courses/components/DataTableCourses";
import { useAuth } from "@/shared/providers/AuthProvider";
import { USER_ROLES } from "@/shared/constants";

export default function CoursesPage() {
  const { user } = useAuth();

  const renderCourses = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return <DataTableCourses />
      case USER_ROLES.INSTRUCTOR:
        return <h1 className="text-2xl font-semibold">Mis Cursos</h1>
      default:
        return <h1 className="text-2xl font-semibold">Cursos Disponibles</h1>
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Cursos</h1>
        <p className="text-muted-foreground">Lista de todos los cursos disponibles.</p>
      </div>
      
      {/* COURSES TABLE */}
      <DataTableCourses />

    </div>
  )
}
