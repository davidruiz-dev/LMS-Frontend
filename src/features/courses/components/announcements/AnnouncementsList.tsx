import { AvatarUser } from "@/components/AvatarUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnnouncements } from "@/features/courses/hooks/use-announcements";
import { AlertCircleIcon, Megaphone } from "lucide-react";
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface AnnouncementsListProps {
    courseId: string;
    access?: boolean;
}

export default function AnnouncementsList({ courseId, access }: AnnouncementsListProps) {
    const { data: announcements = [], isLoading, isError, error } = useAnnouncements(courseId);

    const getFechaRelativa = (date: Date) => {
        const texto = formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: es,
        })

        return texto;
    }

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
                {access && (
                    <EmptyContent>
                        <Button>Crear anuncio</Button>
                    </EmptyContent>
                )}
            </Empty>
        )
    }

    return (
        <div className="space-y-2">
            {announcements.map((announcement) => (
                <div
                    key={announcement.id}
                    className="border rounded-md space-y-2 p-4 hover:border-blue-500/30 hover:bg-blue-100/20 transition-colors duration-300">
                    <div className="flex gap-1 items-center">
                        <AvatarUser
                            src={announcement.author.avatar}
                            firstName={announcement.author.firstName}
                            lastName={announcement.author.lastName}
                        />
                        <span>{announcement.author.firstName} {announcement.author.lastName}</span>
                        <span className="pl-4 text-muted-foreground text-sm">{getFechaRelativa(announcement.createdAt)}</span>
                    </div>
                    <h1 className="font-bold text-lg">{announcement.title}</h1>
                    <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: announcement.content }}></div>
                </div>
            ))}
        </div>
    )
}
