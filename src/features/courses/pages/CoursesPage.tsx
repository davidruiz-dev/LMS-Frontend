import DataTableCourses from "@/features/courses/components/DataTableCourses";
export default function CoursesPage() {

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
