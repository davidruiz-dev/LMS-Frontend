import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz, useStartAttempt, useSubmitAttempt } from '../hooks/use-quizzes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuestionType, type QuizAnswer } from '@/features/courses/quizzes/types/quiz.types';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function QuizTakePage () {
  const { id: courseId, quizId } = useParams<{ id: string; quizId: string }>();
  const navigate = useNavigate();
  const { data: quiz, isLoading: quizLoading } = useQuiz(quizId!);
  const startAttemptMutation = useStartAttempt();
  const submitAttemptMutation = useSubmitAttempt();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, QuizAnswer>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Timer
  useEffect(() => {
    if (!isStarted || !quiz?.timeLimit || timeRemaining === null) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, quiz?.timeLimit, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      const attempt = await startAttemptMutation.mutateAsync(quizId!);
      setAttemptId(attempt.id);
      setIsStarted(true);
      
      if (quiz?.timeLimit) {
        setTimeRemaining(quiz.timeLimit * 60);
      }
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const handleAnswer = (questionId: string, answer: Partial<QuizAnswer>) => {
    const existing = answers.get(questionId) || { questionId };
    setAnswers(new Map(answers.set(questionId, { ...existing, ...answer })));
  };

  const handleAutoSubmit = useCallback(async () => {
    if (!attemptId) return;
    
    const answerArray = Array.from(answers.values());
    try {
      const result = await submitAttemptMutation.mutateAsync({
        attemptId,
        data: { answers: answerArray },
      });
      navigate(`/courses/${courseId}/quizzes/${quizId}/results/${result.id}`, {
        state: { autoSubmitted: true },
      });
    } catch (error) {
      console.error('Auto-submit failed:', error);
    }
  }, [attemptId, answers, submitAttemptMutation, navigate, courseId, quizId]);

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

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const goNext = () => {
    if (currentQuestionIndex < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (quizLoading) {
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
        <p className="text-lg font-medium mb-2">Quiz not available</p>
        <Button onClick={() => navigate(`/courses/${courseId}/quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  // Start Screen
  if (!isStarted) {
    return (
      <div className="container max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{quiz.title}</CardTitle>
            {quiz.description && (
              <CardDescription className="text-base">
                {quiz.description}
              </CardDescription>
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
                <li>• Responda todas las preguntas lo mejor que pueda.</li>
                {quiz.timeLimit && (
                  <li>• Tiene {quiz.timeLimit} minutos para completar este quiz</li>
                )}
                <li>• Puede navegar entre preguntas usando los botones</li>
                <li>• Su progreso se guarda automáticamente</li>
                {quiz.showCorrectAnswers && (
                  <li>• Las respuestas correctas se mostrarán después de enviar</li>
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
              <Button
                onClick={handleStart}
                disabled={startAttemptMutation.isPending}
                className="flex-1"
              >
                {startAttemptMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
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
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        
        {timeRemaining !== null && (
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border",
            timeRemaining < 300 && "border-destructive bg-destructive/10"
          )}>
            <Clock className={cn(
              "h-4 w-4",
              timeRemaining < 300 && "text-destructive"
            )} />
            <span className={cn(
              "font-mono font-bold",
              timeRemaining < 300 && "text-destructive"
            )}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{answeredCount} answered</span>
          <span>{quiz.questions.length - answeredCount} remaining</span>
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                  {currentQuestion.type.replace('_', ' ')}
                </span>
                <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  {currentQuestion.points} points
                </span>
              </div>
              <CardTitle className="text-xl">{currentQuestion.questionText}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Multiple Choice */}
          {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer?.selectedOptionIds?.includes(option.id);
                
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                    onClick={() => {
                      const current = currentAnswer?.selectedOptionIds || [];
                      const newSelected = current.includes(option.id)
                        ? current.filter(id => id !== option.id)
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

          {/* True/False */}
          {currentQuestion.type === QuestionType.TRUE_FALSE && (
            <RadioGroup
              value={currentAnswer?.selectedOptionIds?.[0] || ''}
              onValueChange={(value) => {
                handleAnswer(currentQuestion.id, {
                  questionId: currentQuestion.id,
                  selectedOptionIds: [value],
                });
              }}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                    currentAnswer?.selectedOptionIds?.[0] === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
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

          {/* Short Answer / Essay / Fill in Blank */}
          {(currentQuestion.type === QuestionType.SHORT_ANSWER ||
            currentQuestion.type === QuestionType.ESSAY ||
            currentQuestion.type === QuestionType.FILL_IN_BLANK) && (
            <Textarea
              placeholder="Type your answer here..."
              value={currentAnswer?.answerText || ''}
              onChange={(e) => {
                handleAnswer(currentQuestion.id, {
                  questionId: currentQuestion.id,
                  answerText: e.target.value,
                });
              }}
              className={cn(
                currentQuestion.type === QuestionType.ESSAY && "min-h-[200px]"
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-1">
          {quiz.questions?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={cn(
                "w-8 h-8 rounded-full text-xs font-medium transition-colors",
                index === currentQuestionIndex
                  ? "bg-primary text-primary-foreground"
                  : answers.has(quiz.questions?.[index]?.id || '')
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button onClick={() => setShowSubmitDialog(true)}>
            <Flag className="mr-2 h-4 w-4" />
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={goNext}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {quiz.questions.length} questions.
              {answeredCount < quiz.questions.length && (
                <span className="block mt-2 text-destructive">
                  {quiz.questions.length - answeredCount} questions are unanswered.
                </span>
              )}
              <span className="block mt-2">
                Are you sure you want to submit?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={submitAttemptMutation.isPending}
            >
              {submitAttemptMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
