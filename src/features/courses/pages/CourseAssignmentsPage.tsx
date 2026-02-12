import { Button } from "@/components/ui/button";
import AssignmentsList from "@/features/courses/components/assignments/AssignmentsList";
import CreateAssignment from "@/features/courses/components/assignments/CreateAssignment";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function CourseAssignmentsPage() {
  const { id } = useParams();
  if (!id) return null;
  const [openModal, setOpenModal] = useState(false);
  const toggle = () => setOpenModal(prev => !prev);

  const access = useCourseAccess(id);
  const isOwner = access?.isOwner

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <div>
          <h1 className="text-3xl font-bold">Tareas</h1>
          <p className="text-muted-foreground">Lista de todas las tareas asignadas para este curso.</p>
        </div>
        {access?.isOwner && (
          <Button onClick={toggle}><Plus /> Agregar tarea</Button>
        )}
      </div>

      <AssignmentsList courseId={id} canAccess={isOwner}/>

      <CreateAssignment courseId={id} open={openModal} onOpenChange={setOpenModal} />
    </div>
  )
}
