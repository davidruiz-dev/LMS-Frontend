// components/profile/PublicProfilePage.tsx
import { useParams, Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/providers/AuthProvider';
import { usePublicProfile } from '../hooks/useProfile';

export default function PublicProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const { user } = useAuth();

    if (!userId) return <Navigate to="/profile" replace />;
    if (userId === user?.id) return <Navigate to="/profile" replace />;

    const { data: profile, isLoading, isError } = usePublicProfile(userId);

    if (isLoading) {
        return (
            <div className="space-y-4 max-w-2xl">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-48" />
            </div>
        );
    }

    if (isError || !profile) {
        return <p className="text-sm text-red-600">No se pudo cargar este perfil.</p>;
    }

    const initials = `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase();

    return (
        <div className="space-y-4 p-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-semibold">
                        {profile.firstName} {profile.lastName}
                    </h2>
                    <Badge variant="secondary">{profile.role}</Badge>
                </div>
            </div>
            <div className='space-y-3'>
                <h1 className='font-bold text-xl'>Sobre mí</h1>
                {profile.biography ? <p className=" text-muted-foreground">{profile.biography}</p> : 
                <p className="text-sm text-muted-foreground">No hay biografía disponible.</p>}
            </div>
        </div>
    );
}