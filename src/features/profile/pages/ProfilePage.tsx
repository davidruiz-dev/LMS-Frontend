// components/profile/ProfilePage.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyProfile, useProfileStats } from '../hooks/useProfile';
import { AvatarUploader } from '../components/AvatarUploader';
import { ProfileInfoForm } from '../components/ProfileInfoForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { ProfileStatsCards } from '../components/ProfileStatCards';

export default function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile();
  const { data: stats, isLoading: isLoadingStats } = useProfileStats();

  if (isLoading || !profile) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const initials = `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl p-6 m-auto">
      <div className="flex items-center gap-4">
        <AvatarUploader avatarUrl={profile.avatarUrl} initials={initials} />
        <div>
          <h2 className="text-3xl font-semibold">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="pt-4">
          <ProfileInfoForm profile={profile} />
        </TabsContent>
        <TabsContent value="security" className="pt-4">
          <ChangePasswordForm />
        </TabsContent>
        <TabsContent value="stats" className="pt-4">
          {isLoadingStats || !stats ? <Skeleton className="h-24 w-full" /> : <ProfileStatsCards stats={stats} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}