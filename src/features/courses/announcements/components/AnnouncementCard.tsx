import { AvatarUser } from "@/components/AvatarUser";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getDistanceToNow } from "@/shared/utils/getDistanceToNow";
import EditAnnouncement from "@/features/courses/announcements/components/EditAnnouncement"
import { AlertCircle, Bell, CheckCircle, Clock, Copy, FileText, MoreVertical, Pin, PinOff } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useDeleteAnnouncement } from "@/features/courses/hooks/use-announcements";
import type { Announcement } from "@/features/courses/announcements/types/announcement.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,} from "@/components/ui/alert-dialog";
import { cn } from "@/shared/lib/utils";
import { showError, showSuccess } from "@/shared/helpers/alerts";

interface AnnouncementCardProps {
    courseId: string;
    announcement: Announcement;
    access?: boolean;
    isPinned?: boolean;
    onPin?: (id: string) => void;
    onUnpin?: (id: string) => void;
    variant?: 'default' | 'compact' | 'detailed';
    className?: string;
}

export default function AnnouncementCard({
    courseId, 
    announcement, 
    access, 
    isPinned = false,
    onPin,
    onUnpin,
    className  
}: AnnouncementCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const deleteAnnouncement = useDeleteAnnouncement();

    const handleDelete = () => deleteAnnouncement.mutate({ courseId, announcementId: announcement.id })
    
    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(announcement.content);
            setIsCopied(true);
            showSuccess("Contenido copiado al portapapeles");
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            showError("Error al copiar el contenido");
        }
    };

    return (
        <>
            <Card className={cn(
                "hover:shadow-lg transition-all duration-200 border gap-2",
                isPinned && "border-yellow-400 shadow-md bg-linear-to-br from-yellow-50/50 to-white dark:from-yellow-950/10",
                !announcement.isPublished && access && "opacity-75",
                className
            )}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                            <div className="flex items-center gap-2">
                                <AvatarUser
                                    src={announcement.author.avatarUrl}
                                    firstName={announcement.author.firstName}
                                    lastName={announcement.author.lastName}
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                        {`${announcement.author.firstName} ${announcement.author.lastName}`}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {getDistanceToNow(announcement.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex items-center gap-1.5 ml-1 flex-wrap">
                                {isPinned && (
                                    <Badge variant="outline" className="text-yellow-600 border-yellow-400 text-[10px] h-5">
                                        <Pin className="w-3 h-3 mr-0.5" />
                                        Fijado
                                    </Badge>
                                )}
                                {access && (
                                    <Badge 
                                        variant={announcement.isPublished ? 'default' : 'destructive'} 
                                        className="text-[10px] h-5"
                                    >
                                        {announcement.isPublished ? (
                                            <>
                                                <CheckCircle className="w-3 h-3 mr-0.5" />
                                                Publicado
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-3 h-3 mr-0.5" />
                                                Borrador
                                            </>
                                        )}
                                    </Badge>
                                )}
                                {new Date(announcement.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
                                    <Badge variant="secondary" className="text-[10px] h-5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        <Bell className="w-3 h-3 mr-0.5" />
                                        Nuevo
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Dropdown de acciones */}
                        {access && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        className="h-8 w-8 p-0 hover:bg-muted shrink-0"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                                        Opciones
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditDialogOpen(true);
                                        }}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Editar
                                    </DropdownMenuItem>
                                    
                                    {isPinned ? (
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUnpin?.(announcement.id);
                                                showSuccess("Anuncio desfijado");
                                            }}
                                        >
                                            <PinOff className="w-4 h-4 mr-2" />
                                            Desfijar
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPin?.(announcement.id);
                                                showSuccess("Anuncio fijado");
                                            }}
                                        >
                                            <Pin className="w-4 h-4 mr-2" />
                                            Fijar
                                        </DropdownMenuItem>
                                    )}
                                    
                                    <DropdownMenuItem onClick={handleCopyContent}>
                                        <Copy className="w-4 h-4 mr-2" />
                                        {isCopied ? "¡Copiado!" : "Copiar contenido"}
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        variant="destructive" 
                                        onClick={() => setDeleteDialogOpen(true)}
                                    >
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    {/* Título del anuncio */}
                    <CardTitle className="font-semibold text-lg mt-2 line-clamp-2">
                        {announcement.title}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    {/* Contenido */}
                    <div 
                        className="text-muted-foreground prose prose-sm max-w-none dark:prose-invert line-clamp-4"
                        dangerouslySetInnerHTML={{ __html: announcement.content }}
                    />

                    {/* Footer con estadísticas y acciones */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-4">
                            {/* Comentarios */}
                            {/* <Button variant="ghost" size="sm" className="gap-1 h-8 px-2 text-muted-foreground">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs">0</span>
                            </Button> */}

                            {/* Fecha detallada */}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {new Date(announcement.createdAt).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog de confirmación para eliminar */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar este anuncio?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El anuncio "{announcement.title}" será eliminado permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal de edición */}
            <EditAnnouncement
                courseId={courseId}
                announcement={announcement}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </>
    )
}