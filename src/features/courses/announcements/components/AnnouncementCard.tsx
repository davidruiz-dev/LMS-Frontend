import { AvatarUser } from "@/components/AvatarUser";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getDistanceToNow } from "@/utils/getDistanceToNow";
import EditAnnouncement from "@/features/courses/announcements/components/EditAnnouncement"
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useDeleteAnnouncement } from "@/features/courses/hooks/use-announcements";
import type { Announcement } from "@/features/courses/announcements/types/announcement.types";

interface AnnouncementCardProps {
    courseId: string;
    announcement: Announcement;
    access?: boolean
}

export default function AnnouncementCard({ courseId, announcement, access }: AnnouncementCardProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const deleteAnnouncement = useDeleteAnnouncement();

    const handleDelete = () => {
        if(window.confirm('¿Deseas eliminar este anuncio?')){
            deleteAnnouncement.mutate({ courseId, announcementId: announcement.id})
        }
    }

    return (
        <>
            <div
                className="border rounded-md space-y-2 p-4 hover:border-sky-500/30 hover:bg-sky-100/20 dark:hover:bg-sky-50/5 transition-colors duration-300"
            >
                <div className="flex justify-between">
                    <div className="flex gap-6 items-center">
                        <div className="flex items-center gap-1">
                            <AvatarUser
                                src={announcement.author.avatar}
                                firstName={announcement.author.firstName}
                                lastName={announcement.author.lastName}
                            />
                            <span>{`${announcement.author.firstName} ${announcement.author.lastName}`}</span>
                        </div>

                        <span className="text-muted-foreground text-sm">{getDistanceToNow(announcement.createdAt)}</span>

                        {access && (
                            <Badge variant={announcement.isPublished ? 'default' : 'destructive'}>{announcement.isPublished ? 'publicado' : 'borrador'}</Badge>
                        )}
                    </div>

                    {access && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditDialogOpen(true);
                                    }}
                                >
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <h1 className="font-bold text-lg">{announcement.title}</h1>
                <div 
                    className="text-muted-foreground" 
                    dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
            </div>

            <EditAnnouncement
                courseId={courseId}
                announcement={announcement}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </>
    )
}

