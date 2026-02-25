import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAttempt, useQuiz } from '../hooks/use-quizzes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuestionType } from '@/features/courses/quizzes/types/quiz.types';

export default function QuizResultsPage() {
  const { id: courseId, quizId, attemptId } = useParams<{ 
    id: string; 
    quizId: string; 
    attemptId: string; 
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: attempt, isLoading: attemptLoading } = useAttempt(attemptId!);
  const { data: quiz } = useQuiz(quizId!);

  const autoSubmitted = location.state?.autoSubmitted;

  if (attemptLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!attempt || !quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Results not found</p>
        <Button onClick={() => navigate(`/courses/${courseId}/quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  const score = attempt.score || 0;
  const totalPoints = quiz.points || 100;
  const percentage = Math.round((score / totalPoints) * 100);
  const passed = percentage >= 60;

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/courses/${courseId}/quizzes`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Quiz Results</h1>
          <p className="text-muted-foreground">{quiz.title}</p>
        </div>
      </div>

      {autoSubmitted && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm font-medium">
                Time expired! Your quiz was automatically submitted.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="text-6xl font-bold">{percentage}%</div>
              <Badge className={cn(
                "absolute -top-2 -right-12",
                passed ? "bg-green-500" : "bg-red-500"
              )}>
                {passed ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                {passed ? 'Passed' : 'Failed'}
              </Badge>
            </div>
          </div>

          <Progress value={percentage} className="h-4" />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {attempt.timeSpent ? Math.floor(attempt.timeSpent / 60) : 0}m
              </div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Review */}
      {quiz.showCorrectAnswers && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Answer Review</h2>
          
          {attempt.answers.map((answer, index) => {
            const question = answer.question;
            
            return (
              <Card key={answer.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Question {index + 1}
                        </span>
                        {answer.isCorrect ? (
                          <Badge className="bg-green-500">
                            <Check className="mr-1 h-3 w-3" />
                            Correct
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <X className="mr-1 h-3 w-3" />
                            Incorrect
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {answer.pointsAwarded} / {question.points} pts
                        </span>
                      </div>
                      <CardTitle className="text-base">
                        {question.questionText}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Multiple Choice / True False */}
                  {(question.type === QuestionType.MULTIPLE_CHOICE || 
                    question.type === QuestionType.TRUE_FALSE) && (
                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const isSelected = answer.selectedOptionIds?.includes(option.id);
                        const isCorrect = option.isCorrect;
                        
                        return (
                          <div
                            key={option.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border-2",
                              isCorrect && "border-green-500 bg-green-50 dark:bg-green-950",
                              isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950",
                              !isSelected && !isCorrect && "border-border"
                            )}
                          >
                            {isCorrect ? (
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : isSelected ? (
                              <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 flex-shrink-0" />
                            )}
                            <span className="text-sm">{option.text}</span>
                            {isSelected && (
                              <Badge variant="outline" className="ml-auto">
                                Your answer
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Text Answers */}
                  {(question.type === QuestionType.SHORT_ANSWER ||
                    question.type === QuestionType.ESSAY ||
                    question.type === QuestionType.FILL_IN_BLANK) && (
                    <div className="space-y-2">
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm font-medium mb-2">Your Answer:</p>
                        <p className="text-sm">{answer.answerText || <em className="text-muted-foreground">No answer provided</em>}</p>
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200">
                      <p className="text-sm font-medium mb-2">Explanation:</p>
                      <p className="text-sm">{question.explanation}</p>
                    </div>
                  )}

                  {/* Feedback */}
                  {answer.feedback && (
                    <div className="p-4 rounded-lg bg-muted">
                      <p className="text-sm font-medium mb-2">Instructor Feedback:</p>
                      <p className="text-sm">{answer.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => navigate(`/courses/${courseId}/quizzes`)}
        >
          Back to Quizzes
        </Button>
        {quiz.allowedAttempts === -1 || attempt.attemptNumber < quiz.allowedAttempts && (
          <Button onClick={() => navigate(`/courses/${courseId}/quizzes/${quizId}/take`)}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};