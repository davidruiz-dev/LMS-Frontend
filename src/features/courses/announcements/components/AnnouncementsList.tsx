import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import AnnouncementCard from "@/features/courses/announcements/components/AnnouncementCard";
import { useAnnouncements } from "@/features/courses/hooks/use-announcements";
import { AlertCircle, AlertCircleIcon, Bell, CheckCircle, Filter, Megaphone, Plus, Search, SortAsc, SortDesc } from "lucide-react";
import { useMemo, useState } from "react";
import CreateAnnouncement from "@/features/courses/announcements/components/CreateAnnouncement";

interface AnnouncementsListProps {
    courseId: string;
    access?: boolean;
}

export default function AnnouncementsList({ courseId, access }: AnnouncementsListProps) {
    const { data: announcements = [], isLoading, isError, error } = useAnnouncements(courseId);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'published' | 'draft'>('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const toggle = () => setOpenModal(prev => !prev)

    const filteredAnnouncements = useMemo(() => {
        // filtros
        let filtered = announcements.filter(announcement => {
            const matchedSearch =
                announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) 
            let matchesFilters = true;
            if (filterType === 'published') {
                matchesFilters = announcement.isPublished
            } else if (filterType === 'draft') {
                matchesFilters = !announcement.isPublished
            }
            return matchesFilters && matchedSearch;
        })

        // ordernar
        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
        return filtered;
    }, [announcements, searchTerm, sortOrder, filterType]);

    const stats = {
        total: announcements.length,
        published: announcements.filter(a => a.isPublished).length,
        drafts: announcements.filter(a => !a.isPublished).length,
    };

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
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-5">
                    <h2 className="text-3xl font-bold">Anuncios</h2>
                    {access && (
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                {stats.total} total
                            </Badge>
                            {stats.published > 0 && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {stats.published} publicados
                                </Badge>
                            )}
                            {stats.drafts > 0 && access && (
                                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {stats.drafts} borradores
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {access && (
                    <Button size="sm" onClick={toggle}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo anuncio
                    </Button>
                )}
            </div>
            {/* Filtros y búsqueda */}
            <div className="flex flex-wrap gap-3 max-w-2xl ml-auto">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar anuncios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {access && (
                    <Select
                        value={filterType}
                        onValueChange={(value: any) => setFilterType(value)}
                    >
                        <SelectTrigger >
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filtrar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="published">Publicados</SelectItem>
                            <SelectItem value="draft">Borradores</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                    className="shrink-0"
                >
                    {sortOrder === 'newest' ? (
                        <SortDesc className="w-4 h-4" />
                    ) : (
                        <SortAsc className="w-4 h-4" />
                    )}
                </Button>
            </div>

            {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((announcement) => (
                    <div className="space-y-4">
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            courseId={courseId}
                            access={access}
                        />
                    </div>
                ))
            ) : (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-muted-foreground">
                        {searchTerm || filterType !== 'all'
                            ? 'No se encontraron anuncios'
                            : 'No hay anuncios aún'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {searchTerm || filterType !== 'all'
                            ? 'Prueba ajustando los filtros de búsqueda'
                            : access
                                ? 'Crea tu primer anuncio para comunicarte con los estudiantes'
                                : 'Los anuncios aparecerán aquí cuando se publiquen'}
                    </p>

                </div>
            )}

            {/* Mostrar número de resultados */}
            {filteredAnnouncements.length > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                    Mostrando {filteredAnnouncements.length} de {announcements.length} anuncios
                    {searchTerm && ` (filtrados por "${searchTerm}")`}
                </p>
            )}

            <CreateAnnouncement
                courseId={courseId}
                open={openModal}
                onOpenChange={setOpenModal}
            />
        </div>
    )
}
