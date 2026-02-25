import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, FileQuestion, Play, Edit, MoreVertical, Settings, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { QuizType, type Quiz } from '@/features/courses/quizzes/types/quiz.types';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface QuizCardProps {
  quiz: Quiz;
  courseId: string;
  remainingAttempts: number;
  hasAttempts?: boolean;
  onStart?: (quiz: Quiz) => void;
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
  canEdit?: boolean;
}

const quizTypeColors = {
  [QuizType.PRACTICE]: 'bg-blue-500',
  [QuizType.GRADED]: 'bg-green-500',
  [QuizType.SURVEY]: 'bg-purple-500',
};

const quizTypeLabels = {
  [QuizType.GRADED]: 'calificado',
  [QuizType.PRACTICE]: 'práctica',
  [QuizType.SURVEY]: 'encuesta',
}

export const QuizCard = ({ quiz, courseId, remainingAttempts, hasAttempts, onStart, onEdit, canEdit, onDelete }: QuizCardProps) => {
  const navigate = useNavigate();
  const isAvailable = () => {
    const now = new Date();
    if (quiz.availableFrom && now < new Date(quiz.availableFrom)) return false;
    if (quiz.availableUntil && now > new Date(quiz.availableUntil)) return false;
    return quiz.published;
  };

  const canTakeQuiz = () => {
    if (!isAvailable()) return false;
    if (quiz.allowedAttempts === -1) return true;
    return remainingAttempts > 0;
  };

  const getButtonText = () => {
    if (!isAvailable()) return 'No disponible';
    if (quiz.allowedAttempts === -1) return 'Empezar';
    if (remainingAttempts <= 0) return 'Sin intentos';
    return hasAttempts ? 'Reintentar Quiz' : 'Empezar Quiz';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
            {quiz.description && (
              <CardDescription className="line-clamp-2">
                {quiz.description}
              </CardDescription>
            )}
          </div>

          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/courses/${courseId}/quizzes/${quiz.id}/build`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar preguntas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(quiz)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/courses/${courseId}/quizzes/${quiz.id}/attempts`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver intentos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(quiz)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={quizTypeColors[quiz.type]}>
            {[quizTypeLabels[quiz.type]]}
          </Badge>
          {quiz.points && (
            <Badge variant="outline">
              {quiz.points} puntos
            </Badge>
          )}
          {!canEdit && remainingAttempts !== undefined && quiz.allowedAttempts !== -1 && (
            <Badge variant={remainingAttempts > 0 ? "default" : "destructive"}>
              {remainingAttempts} intentos restantes
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {quiz.timeLimit && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Tiempo límite: {quiz.timeLimit} minutos</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            <span>
              {quiz.questions?.length || 0} preguntas • {quiz.allowedAttempts === -1 ? 'Ilimitados' : quiz.allowedAttempts} intentos
            </span>
          </div>

          {quiz.dueDate && (
            <div className="text-sm">
              Vence: {format(new Date(quiz.dueDate), 'MMM dd, yyyy h:mm a')}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-1">
        {canEdit ? (
          <>
            <Button
              variant="outline"
              onClick={() => navigate(`/courses/${courseId}/quizzes/${quiz.id}/build`)}
              className="flex-1"
              size={'sm'}
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/courses/${courseId}/quizzes/${quiz.id}/attempts`)}
              className="flex-1"
              size={'sm'}
            >
              <Eye className="h-4 w-4" />
              Intentos
            </Button>
          </>
        ) : (
          <>
            {hasAttempts && (
              <Button
                variant="outline"
                onClick={() => navigate(`/courses/${courseId}/quizzes/${quiz.id}/my-attempts`)}
                className="flex-1"
                size={'sm'}
              >
                <Eye className="h-4 w-4" />
                Mis intentos
              </Button>
            )}
            <Button
              onClick={() => onStart?.(quiz)}
              disabled={!canTakeQuiz()}
              className="flex-1"
              size={'sm'}
            >
              <Play className="h-4 w-4" />
              {getButtonText()}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};