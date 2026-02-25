import { useState, useMemo } from 'react';
import { useQuizzes, useDeleteQuiz, useAttemptCounts } from '../hooks/use-quizzes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Loader2, FileQuestion } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Quiz } from '@/features/courses/quizzes/types/quiz.types';
import { QuizCard } from '@/features/courses/quizzes/components/QuizCard';
import { QuizFormDialog } from '@/features/courses/quizzes/components/QuizForm';
import { useCourseAccess } from '@/features/courses/hooks/use-course-access';

export const QuizList = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);

  const { data: quizzes, isLoading } = useQuizzes(courseId!);
  const deleteMutation = useDeleteQuiz();

  if(!courseId) return null;

  const access = useCourseAccess(courseId)
  const canManage = access?.isOwner

  // Optimized: Single batch query for all attempt counts
  const quizIds = useMemo(() => quizzes?.map(q => q.id) || [], [quizzes]);
  const { data: attemptCounts } = useAttemptCounts(quizIds);

  const handleDelete = async () => {
    if (deletingQuiz) {
      await deleteMutation.mutateAsync(deletingQuiz.id);
      setDeletingQuiz(null);
    }
  };

  const handleStart = (quiz: Quiz) => {
    navigate(`/courses/${courseId}/quizzes/${quiz.id}/take`);
  };

  const getRemainingAttempts = (quiz: Quiz): number => {
    if (quiz.allowedAttempts === -1) return -1;
    const attempts = attemptCounts?.[quiz.id] || 0;
    return Math.max(0, quiz.allowedAttempts - attempts);
  };

  const hasAttempts = (quiz: Quiz): boolean => {
    return (attemptCounts?.[quiz.id] || 0) > 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

      {quizzes && quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No hay cuestionarios aún</p>
            <p className="text-sm text-muted-foreground mb-4">
              {canManage ? 'Crea tu primer cuestionario' : 'Vuelve más tarde para ver cuestionarios'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes?.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              courseId={courseId!}
              onStart={handleStart}
              onEdit={canManage ? setEditingQuiz : undefined}
              onDelete={canManage ? setDeletingQuiz : undefined}
              canEdit={canManage}
              remainingAttempts={getRemainingAttempts(quiz)}
              hasAttempts={hasAttempts(quiz)}
            />
          ))}
        </div>
      )}

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
        courseId={courseId!}
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
  );
};