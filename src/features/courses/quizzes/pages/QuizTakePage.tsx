import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, Clock, ChevronLeft, ChevronRight, Flag, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useInProgressAttempt, useQuiz, useSaveProgress, useStartAttempt, useSubmitAttempt } from '../hooks/use-quizzes';
import { QuestionType, type QuizAnswer, type QuizAttempt } from '../types/quiz.types';
import { USER_ROLES } from '@/shared/constants';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { questionTypeLabel } from '../constants/quiz.constants';

const AUTOSAVE_INTERVAL_MS = 15_000;

export default function QuizTakePage() {
  const { id: courseId, quizId } = useParams<{ id: string; quizId: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();

  if (user?.role !== USER_ROLES.STUDENT) {
    navigate(`/courses/${courseId}/quizzes`);
  }

  const { data: quiz, isLoading: quizLoading } = useQuiz(quizId!);
  const { data: existingAttempt, isLoading: attemptLoading } = useInProgressAttempt(quizId!);
  const startAttemptMutation = useStartAttempt();
  const submitAttemptMutation = useSubmitAttempt();
  const saveProgressMutation = useSaveProgress();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, QuizAnswer>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  // Store submitAttemptMutation in ref to avoid dependency issues
  const submitAttemptMutationRef = useRef(submitAttemptMutation);
  submitAttemptMutationRef.current = submitAttemptMutation;
  
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const saveProgressMutationRef = useRef(saveProgressMutation);
  saveProgressMutationRef.current = saveProgressMutation;

  // Calcula el tiempo restante SIEMPRE a partir de startedAt del servidor, nunca desde un contador local reiniciable
  const computeRemaining = useCallback(
    (start: Date, timeLimitMinutes: number) => {
      const deadline = start.getTime() + timeLimitMinutes * 60_000;
      return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
    },
    [],
  );

  const handleAutoSubmit = useCallback(async () => {
    if (!attemptId) return;
    const answerArray = Array.from(answersRef.current.values());
    try {
      const result = await submitAttemptMutationRef.current.mutateAsync({
        attemptId,
        data: { answers: answerArray },
      });
      navigateRef.current(`/courses/${courseId}/quizzes/${quizId}/results/${result.id}`, {
        state: { autoSubmitted: true },
      });
    } catch (error) {
      console.error('Auto-submit failed:', error);
    }
  }, [attemptId, courseId, quizId]);

  const hydrateFromAttempt = useCallback(
    (attempt: QuizAttempt) => {
      const start = new Date(attempt.startedAt);
      const answerMap = new Map<string, QuizAnswer>();
      (attempt.answers || []).forEach((a) => {
        answerMap.set(a.questionId, {
          questionId: a.questionId,
          answerText: a.answerText,
          selectedOptionIds: a.selectedOptionIds,
        });
      });

      setAttemptId(attempt.id);
      setAnswers(answerMap);
      setIsStarted(true);

      if (quiz?.timeLimit) {
        const remaining = computeRemaining(start, quiz.timeLimit);
        if (remaining <= 0) {
          setTimeRemaining(0);
          setTimeout(() => handleAutoSubmit(), 100);
        } else {
          setTimeRemaining(remaining);
        }
      }
    },
    [quiz?.timeLimit, computeRemaining, handleAutoSubmit],
  );

  // Resume automático si hay un intento en progreso
  useEffect(() => {
    if (attemptLoading || quizLoading || hydrated) return;
    if (existingAttempt && quiz) {
      hydrateFromAttempt(existingAttempt);
    }
    setHydrated(true);
  }, [attemptLoading, quizLoading, existingAttempt, quiz, hydrated, hydrateFromAttempt]);

  // Timer — dispara auto-submit al llegar a 0
  useEffect(() => {
    if (!isStarted || !quiz?.timeLimit || timeRemaining === null) return;

    if (timeRemaining <= 0) {
      handleAutoSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, quiz?.timeLimit, timeRemaining, handleAutoSubmit]);

  // Autosave periódico
  useEffect(() => {
    if (!isStarted || !attemptId) return;

    const interval = setInterval(() => {
      const answerArray = Array.from(answersRef.current.values());
      if (answerArray.length > 0) {
        saveProgressMutationRef.current.mutate({ 
          attemptId, 
          answers: answerArray as QuizAnswer[] 
        });
      }
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isStarted, attemptId]);

  // Guardar al salir de la página (best effort)
  useEffect(() => {
    if (!isStarted || !attemptId) return;
    const handleUnload = () => {
      const answerArray = Array.from(answersRef.current.values());
      if (answerArray.length > 0) {
        saveProgressMutationRef.current.mutate({ 
          attemptId, 
          answers: answerArray as QuizAnswer[] 
        });
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      handleUnload();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [isStarted, attemptId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      const attempt = await startAttemptMutation.mutateAsync(quizId!);
      hydrateFromAttempt(attempt);
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const handleAnswer = (questionId: string, answer: Partial<QuizAnswer>) => {
    const existing = answers.get(questionId) || { questionId };
    const updated = { ...existing, ...answer } as QuizAnswer;
    const newMap = new Map(answers);
    newMap.set(questionId, updated);
    setAnswers(newMap);

    // Guardado inmediato de la respuesta actual (no espera al intervalo)
    if (attemptId) {
      saveProgressMutationRef.current.mutate({ 
        attemptId, 
        answers: Array.from(newMap.values()) 
      });
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    const answerArray = Array.from(answers.values());
    try {
      const result = await submitAttemptMutation.mutateAsync({
        attemptId,
        data: { answers: answerArray },
      });
      navigate(`/courses/${courseId}/quizzes/${quizId}/results/${result.id}`);
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const goToQuestion = (index: number) => setCurrentQuestionIndex(index);
  
  const goNext = () => {
    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goPrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  if (quizLoading || attemptLoading || !hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Cuestionario no disponible</p>
        <Button onClick={() => navigate(`/courses/${courseId}/quizzes`)}>
          Regresar
        </Button>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl first-letter:capitalize">{quiz.title}</CardTitle>
            {quiz.description && (
              <CardDescription className="text-base first-letter:capitalize">{quiz.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-3xl font-bold">{quiz.questions.length}</div>
                <div className="text-sm text-muted-foreground">Preguntas</div>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-3xl font-bold">{quiz.points || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Puntos totales</div>
              </div>
              {quiz.timeLimit && (
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">{quiz.timeLimit}</div>
                  <div className="text-sm text-muted-foreground">Minutos</div>
                </div>
              )}
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-3xl font-bold">
                  {quiz.allowedAttempts === -1 ? '∞' : quiz.allowedAttempts}
                </div>
                <div className="text-sm text-muted-foreground">Intentos</div>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold">Instrucciones:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Responda a todas las preguntas lo mejor que puedas.</li>
                {quiz.timeLimit && (
                  <li>• Tiene {quiz.timeLimit} minutos para completar este cuestionario</li>
                )}
                <li>• Puedes navegar entre las preguntas usando los botones.</li>
                <li>• Su progreso se guarda automáticamente, incluso si cierra la pestaña</li>
                {quiz.showCorrectAnswers && (
                  <li>• Las respuestas correctas se mostrarán después de la entrega</li>
                )}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/courses/${courseId}/quizzes`)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button onClick={handleStart} disabled={startAttemptMutation.isPending} className="flex-1">
                {startAttemptMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Empezar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers.get(currentQuestion.id);
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = answers.size;

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
          </p>
        </div>

        {timeRemaining !== null && (
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border',
              timeRemaining < 300 && 'border-destructive bg-destructive/10',
            )}
          >
            <Clock className={cn('h-4 w-4', timeRemaining < 300 && 'text-destructive')} />
            <span className={cn('font-mono font-bold', timeRemaining < 300 && 'text-destructive')}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Progress value={progress} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{answeredCount} respondidas</span>
          <span>{quiz.questions.length - answeredCount} restantes</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                  {currentQuestion.type.replace('_', ' ')}
                  {[questionTypeLabel[currentQuestion.type]]}
                </span>
                <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  {currentQuestion.points} puntos
                </span>
              </div>
              <CardTitle className="text-xl">{currentQuestion.questionText}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer?.selectedOptionIds?.includes(option.id);
                return (
                  <div
                    key={option.id}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
                    )}
                    onClick={() => {
                      const current = currentAnswer?.selectedOptionIds || [];
                      const newSelected = current.includes(option.id)
                        ? current.filter((id) => id !== option.id)
                        : [...current, option.id];
                      handleAnswer(currentQuestion.id, {
                        questionId: currentQuestion.id,
                        selectedOptionIds: newSelected,
                      });
                    }}
                  >
                    <Checkbox checked={isSelected} />
                    <Label className="flex-1 cursor-pointer">{option.text}</Label>
                  </div>
                );
              })}
            </div>
          )}

          {currentQuestion.type === QuestionType.TRUE_FALSE && (
            <RadioGroup
              value={currentAnswer?.selectedOptionIds?.[0] || ''}
              onValueChange={(value) =>
                handleAnswer(currentQuestion.id, {
                  questionId: currentQuestion.id,
                  selectedOptionIds: [value],
                })
              }
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                    currentAnswer?.selectedOptionIds?.[0] === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {(currentQuestion.type === QuestionType.SHORT_ANSWER ||
            currentQuestion.type === QuestionType.ESSAY ||
            currentQuestion.type === QuestionType.FILL_IN_BLANK) && (
            <Textarea
              placeholder="Type your answer here..."
              value={currentAnswer?.answerText || ''}
              onChange={(e) =>
                handleAnswer(currentQuestion.id, {
                  questionId: currentQuestion.id,
                  answerText: e.target.value,
                })
              }
              className={cn(currentQuestion.type === QuestionType.ESSAY && 'min-h-[200px]')}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goPrevious} disabled={currentQuestionIndex === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        <div className="flex gap-1">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={cn(
                'w-8 h-8 rounded-full text-xs font-medium transition-colors',
                index === currentQuestionIndex
                  ? 'bg-primary text-primary-foreground'
                  : answers.has(quiz.questions[index].id)
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button onClick={() => setShowSubmitDialog(true)}>
            <Flag className="mr-2 h-4 w-4" />
            Enviar
          </Button>
        ) : (
          <Button onClick={goNext}>
            Siguiente
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Enviar Cuestionario?</AlertDialogTitle>
            <AlertDialogDescription>
              Has respondido {answeredCount} de {quiz.questions.length} preguntas.
              {answeredCount < quiz.questions.length && (
                <span className="block mt-2 text-destructive">
                  {quiz.questions.length - answeredCount} preguntas están sin responder.
                </span>
              )}
              <span className="block mt-2">Estas seguro que deseas enviar?</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Revisar respuestas</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={submitAttemptMutation.isPending}>
              {submitAttemptMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}