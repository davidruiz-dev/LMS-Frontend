import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import AnnouncementCard from "@/features/courses/announcements/components/AnnouncementCard";
import { useAnnouncements } from "@/features/courses/hooks/use-announcements";
import { AlertCircleIcon, Megaphone } from "lucide-react";

interface AnnouncementsListProps {
    courseId: string;
    access?: boolean;
}

export default function AnnouncementsList({ courseId, access }: AnnouncementsListProps) {
    const { data: announcements = [], isLoading, isError, error } = useAnnouncements(courseId);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3">
                {[1, 2, 3, 4, 5].map((index) => (
                    <Skeleton key={index} className="h-28" />
                ))}
            </div>
        )
    }

    if (isError) {
        return (
            <Alert variant="destructive" className="max-w-md">
                <AlertCircleIcon />
                <AlertTitle>Error al obtener anuncios.</AlertTitle>
                <AlertDescription>
                    {error.message}
                </AlertDescription>
            </Alert>
        )
    }

    if (!announcements.length) {
        return (
            <Empty className="bg-muted/30 h-full">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Megaphone />
                    </EmptyMedia>
                    <EmptyTitle>No hay anuncios</EmptyTitle>
                    <EmptyDescription className="max-w-xs text-pretty">
                        No hay anuncios disponibles en este momento, vuelve pronto.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <div className="space-y-2">
            {announcements.map((announcement) => (
                <AnnouncementCard 
                    key={announcement.id}
                    announcement={announcement} 
                    courseId={courseId}
                    access={access}
                />
            ))}
        </div>
    )
}
