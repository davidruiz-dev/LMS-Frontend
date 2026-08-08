import { useModulesByCourse, useReorderModules } from "@/features/courses/hooks/use-modules";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Bell, Book, Filter, Plus, Search, SortAsc, SortDesc } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { ModuleAccordionItem } from "@/features/courses/modules/components/ModuleAccordionItem";
import { CreateModuleDialog } from "@/features/courses/modules/components/CreateModuleDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ModuleListProps {
  courseId: string;
  canEdit: boolean
}

export function ModuleList({ courseId, canEdit }: ModuleListProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'published' | 'draft'>('all');
  const [sortOrder, setSortOrder] = useState<'manual' | 'newest' | 'oldest'>(canEdit ? 'manual' : 'oldest');

  const { data: modules = [], isLoading, error } = useModulesByCourse(courseId);
  const reorderModules = useReorderModules();

  const displayedModules = useMemo(() => {
    const filtered = modules.filter((module) => {
      const matchedSearch = module.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let matchedFilter = true;

      if (filterType === 'published') {
        matchedFilter = module.isPublished;
      }

      if (filterType === 'draft') {
        matchedFilter = !module.isPublished;
      }

      return matchedSearch && matchedFilter;
    });

    // Orden manual: respeta el backend
    if (sortOrder === 'manual') {
      return filtered;
    }

    // Orden visual por fecha
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sortOrder === 'newest'
        ? dateB - dateA
        : dateA - dateB;
    });

  }, [modules, searchTerm, filterType, sortOrder]);

  const canReorder =
    canEdit &&
    sortOrder === 'manual' &&
    searchTerm === '' &&
    filterType === 'all';

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !canReorder) return;
    const items = Array.from(modules);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    reorderModules.mutate({
      courseId,
      orderData: {
        moduleIds: items.map((m) => m.id),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-7">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-72" />
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertCircleIcon />
        <AlertTitle>Error al obtener módulos</AlertTitle>
        <AlertDescription>
          Ocurrió un error inesperado al obtener los módulos del curso, intentalo más adelante.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {!modules.length && (
        <Empty className="bg-muted/30 h-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Book />
            </EmptyMedia>
            <EmptyTitle>Sin módulos</EmptyTitle>
            <EmptyDescription className="max-w-xs text-pretty">
              No hay módulos disponibles en este momento, vuelve pronto.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {/* filtros */}
      <div className="flex flex-col xl:flex-row gap-3">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar módulos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Controles */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">

          {canEdit && (
            <Select
              value={filterType}
              onValueChange={(value) =>
                setFilterType(value as 'all' | 'published' | 'draft')
              }
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Todos
                </SelectItem>
                <SelectItem value="published">
                  Publicados
                </SelectItem>
                <SelectItem value="draft">
                  Borradores
                </SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select
            value={sortOrder}
            onValueChange={(value) =>
              setSortOrder(value as 'manual' | 'newest' | 'oldest')
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              {sortOrder === 'newest' ? (
                <SortDesc className="w-4 h-4" />
              ) : (
                <SortAsc className="w-4 h-4" />
              )}
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>

            <SelectContent>
              {canEdit && (
                <SelectItem value="manual">
                  Personalizado
                </SelectItem>
              )}

              <SelectItem value="newest">
                Más nuevos
              </SelectItem>

              <SelectItem value="oldest">
                Más antiguos
              </SelectItem>
            </SelectContent>
          </Select>

          {canEdit && (
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo módulo
            </Button>
          )}

        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="modules"
          isDropDisabled={!canReorder}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                'space-y-2',
                snapshot.isDraggingOver && 'bg-muted/50 rounded-lg p-2'
              )}
            >
              <Accordion
                type="multiple"
                value={expandedModules}
                onValueChange={setExpandedModules}
                className="space-y-2"
              >
                {displayedModules.length > 0 ? (
                  displayedModules.map((module, index) => (
                    <Draggable
                      key={module.id}
                      draggableId={module.id}
                      index={index}
                      isDragDisabled={!canReorder}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            snapshot.isDragging && 'opacity-50 z-50'
                          )}
                        >
                          <ModuleAccordionItem
                            module={module}
                            courseId={courseId}
                            canEdit={canEdit}
                            dragHandleProps={canEdit ? provided.dragHandleProps : undefined}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-muted-foreground">
                      {searchTerm || filterType !== 'all'
                        ? 'No se encontraron módulos'
                        : 'No hay módulos aún'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchTerm || filterType !== 'all'
                        ? 'Prueba ajustando los filtros de búsqueda'
                        : canEdit
                          ? 'Crea tu primer módulo para empezar agregar contenido'
                          : 'Los módulos aparecerán aquí cuando se publiquen'}
                    </p>
                  </div>
                )}
              </Accordion>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {displayedModules.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Mostrando {displayedModules.length} de {modules.length} módulos
          {searchTerm && ` (filtrados por "${searchTerm}")`}
        </p>
      )}

      <CreateModuleDialog
        courseId={courseId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  )
}