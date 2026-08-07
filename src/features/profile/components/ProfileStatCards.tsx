// components/profile/ProfileStatsCards.tsx
import { Card } from '@/components/ui/card';
import { BookOpen, CheckCircle2, ClipboardCheck, Award } from 'lucide-react';
import type { ProfileStatsDto } from '../types/profile.types';

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="rounded-full bg-muted p-2">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}

export function ProfileStatsCards({ stats }: { stats: ProfileStatsDto }) {
  if (stats.coursesCreated !== undefined) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <StatCard icon={BookOpen} label="Cursos creados" value={stats.coursesCreated} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={BookOpen} label="Cursos inscritos" value={stats.coursesEnrolled ?? 0} />
      <StatCard icon={CheckCircle2} label="Tareas entregadas" value={stats.assignmentsSubmitted ?? 0} />
      <StatCard icon={ClipboardCheck} label="Tareas calificadas" value={stats.assignmentsGraded ?? 0} />
      <StatCard icon={Award} label="Promedio" value={stats.averageGrade ?? '—'} />
    </div>
  );
}