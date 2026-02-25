import { useParams, useNavigate } from 'react-router-dom';
import { useAllAttempts, useQuiz } from '../hooks/use-quizzes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Loader2, Eye, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import { AttemptStatus } from '../types/quiz.types';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

export default function AllAttemptsPage () {
  const { id: courseId, quizId } = useParams<{ id: string; quizId: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: quiz, isLoading: quizLoading } = useQuiz(quizId!);
  const { data: allAttempts, isLoading: attemptsLoading } = useAllAttempts(quizId!);

  const isLoading = quizLoading || attemptsLoading;

  // Memoized filtered attempts
  const filteredAttempts = useMemo(() => {
    if (!allAttempts) return [];
    if (!search) return allAttempts;

    const searchLower = search.toLowerCase();
    return allAttempts.filter(attempt => 
      `${attempt.student?.firstName} ${attempt.student?.lastName}`
        .toLowerCase()
        .includes(searchLower) ||
      attempt.student?.email?.toLowerCase().includes(searchLower)
    );
  }, [allAttempts, search]);

  // Memoized stats
  const stats = useMemo(() => {
    if (!allAttempts || allAttempts.length === 0) {
      return { total: 0, avgScore: 0, completedCount: 0, completionRate: 0 };
    }

    const total = allAttempts.length;
    const completedCount = allAttempts.filter(a => a.status === AttemptStatus.GRADED).length;
    const avgScore = allAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / total;
    const completionRate = Math.round((completedCount / total) * 100);

    return { total, avgScore, completedCount, completionRate };
  }, [allAttempts]);

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

  const handleExport = () => {
    if (!filteredAttempts) return;

    const csvContent = [
      ['Student', 'Email', 'Attempt', 'Status', 'Score', 'Percentage', 'Date'].join(','),
      ...filteredAttempts.map(attempt => [
        `"${attempt.student?.firstName} ${attempt.student?.lastName}"`,
        attempt.student?.email || '',
        attempt.attemptNumber,
        attempt.status,
        attempt.score || 0,
        `${Math.round(((attempt.score || 0) / (quiz.points || 1)) * 100)}%`,
        format(new Date(attempt.startedAt), 'yyyy-MM-dd HH:mm'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quiz.title}-attempts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
          <p className="text-muted-foreground">All Student Attempts</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Attempts</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl">{stats.avgScore.toFixed(1)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-3xl">{stats.completionRate}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Attempts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attempts</CardTitle>
          <CardDescription>
            View and manage all student submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAttempts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {search ? 'No attempts found' : 'No attempts yet'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Attempt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{attempt.student?.firstName} {attempt.student?.lastName}</div>
                        <div className="text-xs text-muted-foreground">{attempt.student?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>#{attempt.attemptNumber}</TableCell>
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
                        <span>
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
                      {format(new Date(attempt.startedAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/courses/${courseId}/quizzes/${quizId}/results/${attempt.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};