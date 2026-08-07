import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePendingGrading, useQuiz, useGradeAnswer } from '../hooks/use-quizzes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Loader2, CheckCircle, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { QuestionType, type QuizAttempt, type QuizAttemptAnswer} from '../types/quiz.types';

export default function ManualGradingPage () {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const navigate = useNavigate();
  const { data: quiz, isLoading: quizLoading } = useQuiz(quizId!);
  const { data: pendingAttempts, isLoading: attemptsLoading } = usePendingGrading(quizId!);
  const gradeAnswerMutation = useGradeAnswer();

  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
  const [gradingAnswer, setGradingAnswer] = useState<QuizAttemptAnswer | null>(null);
  const [points, setPoints] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const isLoading = quizLoading || attemptsLoading;

  const handleGrade = async () => {
    if (!gradingAnswer) return;

    const pointsNum = parseFloat(points);
    if (isNaN(pointsNum) || pointsNum < 0) {
      return;
    }

    try {
      await gradeAnswerMutation.mutateAsync({
        answerId: gradingAnswer.id,
        points: Number(pointsNum),
        feedback,
      });

      // Cerrar dialog y limpiar
      setGradingAnswer(null);
      setPoints('');
      setFeedback('');
    } catch (error) {
      // Error handled by mutation
      console.log(error)
    }
  };

  const openGradingDialog = (attempt: QuizAttempt, answer: QuizAttemptAnswer) => {
    setSelectedAttempt(attempt);
    setGradingAnswer(answer);
    setPoints('');
    setFeedback(answer.feedback || '');
  };

  const getUngradedAnswers = (attempt: QuizAttempt) => {
    return attempt.answers.filter(
      answer => 
        (answer.question.type === QuestionType.ESSAY ||
         answer.question.type === QuestionType.SHORT_ANSWER ||
         answer.question.type === QuestionType.FILL_IN_BLANK) &&
        answer.pointsAwarded === null
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg font-medium mb-2">Quiz not found</p>
        <Button onClick={() => navigate(`/courses/${courseId}/quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  const totalPending = pendingAttempts?.reduce(
    (sum: number, attempt: QuizAttempt) => sum + getUngradedAnswers(attempt).length,
    0
  ) || 0;

  return (
    <div className="container space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
    
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Calificación manual</h1>
          <p className="text-muted-foreground">{quiz.title}</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Clock className="mr-2 h-5 w-5" />
          {totalPending} pendientes
        </Badge>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium mb-1">Calificación manual requerida</p>
              <p className="text-sm text-muted-foreground">
                Este cuestionario contiene preguntas de ensayo, respuesta corta o completar el espacio en blanco que requieren calificación manual.
                Revisa la respuesta de cada estudiante y asigna puntos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Attempts */}
      {!pendingAttempts || pendingAttempts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-lg font-medium mb-2">¡Todo al día!</p>
            <p className="text-sm text-muted-foreground">
              No hay intentos pendientes de calificación para este cuestionario.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingAttempts.map((attempt: QuizAttempt) => {
            const ungradedAnswers = getUngradedAnswers(attempt);
            if (ungradedAnswers.length === 0) return null;

            return (
              <Card key={attempt.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {attempt.student?.firstName} {attempt.student?.lastName}
                        </CardTitle>
                        <CardDescription>
                          Intento #{attempt.attemptNumber} • Enviado {format(new Date(attempt.submittedAt!), 'MMM dd, h:mm a')}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {ungradedAnswers.length} pendientes
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ungradedAnswers.map((answer) => (
                    <Card key={answer.id} className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
                      <CardContent>
                        <div className="space-y-4">
                          {/* Question */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {answer.question.type.replace('_', ' ')}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {answer.question.points} puntos posibles
                              </span>
                            </div>
                            <p className="font-medium">{answer.question.questionText}</p>
                          </div>

                          {/* Student Answer */}
                          <div className="p-4 rounded-lg bg-muted/50 border">
                            <Label className="text-xs text-muted-foreground mb-2">
                              Respuesta del estudiante:
                            </Label>
                            <p className="text-sm whitespace-pre-wrap">
                              {answer.answerText || <em className="text-muted-foreground">No se proporcionó respuesta</em>}
                            </p>
                          </div>

                          {/* Grade Button */}
                          <div className="flex justify-end">
                            <Button
                              onClick={() => openGradingDialog(attempt, answer)}
                              size="sm"
                            >
                              Calificar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Grading Dialog */}
      <Dialog open={!!gradingAnswer} onOpenChange={(open) => !open && setGradingAnswer(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Calificar respuesta</DialogTitle>
            <DialogDescription>
              {selectedAttempt && (
                <>
                  {selectedAttempt.student?.firstName} {selectedAttempt.student?.lastName} • 
                  Intento #{selectedAttempt.attemptNumber}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {gradingAnswer && (
            <div className="space-y-4">
              {/* Question */}
              <div className="p-4 rounded-lg bg-muted">
                <Label className="text-sm font-medium mb-2">Pregunta:</Label>
                <p className="text-sm">{gradingAnswer.question.questionText}</p>
                {gradingAnswer.question.explanation && (
                  <div className="mt-3 pt-3 border-t">
                    <Label className="text-xs text-muted-foreground">Respuesta esperada:</Label>
                    <p className="text-sm mt-1">{gradingAnswer.question.explanation}</p>
                  </div>
                )}
              </div>

              {/* Student Answer */}
              <div className="p-4 rounded-lg border">
                <Label className="text-sm font-medium mb-2">Respuesta:</Label>
                <p className="text-sm whitespace-pre-wrap mt-2">
                  {gradingAnswer.answerText || <em className="text-muted-foreground">No se proporcionó respuesta</em>}
                </p>
              </div>

              {/* Points Input */}
              <div className="space-y-2">
                <Label htmlFor="points">
                  Puntos (máx: {gradingAnswer.question.points})
                </Label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  max={gradingAnswer.question.points}
                  step="0.5"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="Enter points"
                />
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback">
                  Feedback (optional)
                </Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback to the student..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Quick Score Buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPoints('0')}
                >
                  0 pts
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPoints((gradingAnswer.question.points / 2).toString())}
                >
                  {gradingAnswer.question.points / 2} pts
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPoints(gradingAnswer.question.points.toString())}
                >
                  {gradingAnswer.question.points} pts (Full)
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGradingAnswer(null)}
              disabled={gradeAnswerMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGrade}
              disabled={!points || gradeAnswerMutation.isPending}
            >
              {gradeAnswerMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};