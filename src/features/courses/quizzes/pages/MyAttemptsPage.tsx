
import { useParams, useNavigate } from 'react-router-dom';
import { useAttempts, useQuiz } from '../hooks/use-quizzes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Loader2, Eye, TrendingUp, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { AttemptStatus } from '../types/quiz.types';
import { cn } from '@/lib/utils';

export default function MyAttemptsPage () {
  const { id: courseId, quizId } = useParams<{ id: string; quizId: string }>();
  const navigate = useNavigate();
  const { data: quiz, isLoading: quizLoading } = useQuiz(quizId!);
  const { data: attempts, isLoading: attemptsLoading } = useAttempts(quizId!);

  const isLoading = quizLoading || attemptsLoading;

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

  const sortedAttempts = attempts?.sort((a, b) => 
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  ) || [];

  const bestScore = attempts?.reduce((max, attempt) => 
    Math.max(max, attempt.score || 0), 0
  ) || 0;

  const averageScore = attempts?.length 
    ? attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / attempts.length
    : 0;

  const remainingAttempts = quiz.allowedAttempts === -1 
    ? -1 
    : Math.max(0, quiz.allowedAttempts - (attempts?.length || 0));

  const canRetake = quiz.allowedAttempts === -1 || remainingAttempts > 0;

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/courses/${courseId}/quizzes`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground">Your Attempt History</p>
        </div>
        {canRetake && (
          <Button onClick={() => navigate(`/courses/${courseId}/quizzes/${quizId}/take`)}>
            {attempts?.length ? 'Retake Quiz' : 'Start Quiz'}
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Attempts</CardDescription>
            <CardTitle className="text-3xl">{attempts?.length || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Best Score</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {bestScore}
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl">{averageScore.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Remaining Attempts</CardDescription>
            <CardTitle className="text-3xl">
              {remainingAttempts === -1 ? '∞' : remainingAttempts}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Attempts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attempt History</CardTitle>
          <CardDescription>
            View details of your previous attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedAttempts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't taken this quiz yet
              </p>
              <Button onClick={() => navigate(`/courses/${courseId}/quizzes/${quizId}/take`)}>
                Start Quiz
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attempt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Time Spent</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAttempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell className="font-medium">
                      Attempt #{attempt.attemptNumber}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          attempt.status === AttemptStatus.GRADED && "bg-green-500",
                          attempt.status === AttemptStatus.SUBMITTED && "bg-blue-500",
                          attempt.status === AttemptStatus.IN_PROGRESS && "bg-yellow-500"
                        )}
                      >
                        {attempt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {attempt.score !== null && attempt.score !== undefined ? (
                        <span className="font-semibold">
                          {attempt.score} / {quiz.points}
                          <span className="text-muted-foreground ml-1">
                            ({Math.round((attempt.score / (quiz.points || 1)) * 100)}%)
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {attempt.timeSpent ? `${Math.floor(attempt.timeSpent / 60)}m` : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(attempt.startedAt), 'MMM dd, yyyy h:mm a')}
                    </TableCell>
                    <TableCell className="text-right">
                      {attempt.status === AttemptStatus.GRADED && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/courses/${courseId}/quizzes/${quizId}/results/${attempt.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Results
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!canRetake && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <p className="text-sm font-medium">
              You have used all {quiz.allowedAttempts} attempts for this quiz.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};