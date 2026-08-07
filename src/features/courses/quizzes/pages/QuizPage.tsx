import { QuizList } from "@/features/courses/quizzes/components/QuizList";
import { useCourseAccess } from "../../hooks/use-course-access";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { QuizFormDialog } from "../components/QuizForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Quiz } from "../types/quiz.types";
import { useDeleteQuiz } from "../hooks/use-quizzes";

export default function QuizPage() {
  const { id: courseId } = useParams<{ id: string }>();
  if (!courseId) return null;
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);

  const access = useCourseAccess(courseId);
  const deleteMutation = useDeleteQuiz();
  const canManage = access?.isOwner;

  const handleDelete = async () => {
    if (deletingQuiz) {
      await deleteMutation.mutateAsync(deletingQuiz.id);
      setDeletingQuiz(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cuestionarios</h2>
          <p className="text-muted-foreground">
            {canManage ? 'Crea y gestiona cuestionarios para tus alumnos.' : 'Pon a prueba tus conocimientos.'}
          </p>
        </div>

        {canManage && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        )}
      </div>

      <QuizList courseId={courseId} setEditingQuiz={setEditingQuiz} setDeletingQuiz={setDeletingQuiz} canManage={canManage} />

      {/* Create/Edit Dialog */}
      <QuizFormDialog
        open={isCreateDialogOpen || !!editingQuiz}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingQuiz(null);
          }
        }}
        quiz={editingQuiz}
        courseId={courseId}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingQuiz} onOpenChange={() => setDeletingQuiz(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estas seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará permanentemente "{deletingQuiz?.title}" y todos los intentos de los estudiantes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
