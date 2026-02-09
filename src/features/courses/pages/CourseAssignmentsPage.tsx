import AssignmentsList from "@/features/courses/components/assignments/AssignmentsList";

export default function CourseAssignmentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Tareas</h1>
      <p className="text-gray-400">Lista de todas las tareas asignadas para este curso.</p>
      <AssignmentsList />
    </div>
  )
}
