import { useModulesByCourse, useReorderModules } from "@/features/courses/hooks/use-modules";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ModuleAccordionItem } from "@/features/courses/components/modules/ModuleAccordionItem";
import { CreateModuleDialog } from "@/features/courses/components/modules/CreateModuleDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

interface ModuleListProps {
  courseId: string;
  canEdit: boolean
}

export function ModuleList({ courseId, canEdit }: ModuleListProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: modules = [], isLoading, error } = useModulesByCourse(courseId);
  const reorderModules = useReorderModules();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const moduleIds = items.map((m) => m.id);
    reorderModules.mutate({ courseId, orderData: { moduleIds } });
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
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Error al obtener módulos</AlertTitle>
      <AlertDescription>
        Ocurrió un error inesperado al obtener los módulos del curso, intentalo más adelante.
      </AlertDescription>
    </Alert>
  }

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo módulo
          </Button>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules" isDropDisabled={!canEdit}>
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
                {modules.map((module, index) => (
                  <Draggable
                    key={module.id}
                    draggableId={module.id}
                    index={index}
                    isDragDisabled={!canEdit}
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
                ))}
              </Accordion>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <CreateModuleDialog
        courseId={courseId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  )
}