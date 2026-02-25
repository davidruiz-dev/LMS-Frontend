import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useModuleItems, useReorderModuleItems } from '@/features/courses/hooks/use-modules';
import { ModuleItemCard } from '@/features/courses/modules/components/ModuleItemCard';
import CreateModuleItemDialog from '@/features/courses/modules/components/CreateModuleItemDialog';

interface ModuleItemListProps {
    courseId: string;
    moduleId: string;
    canEdit?: boolean;
}

export function ModuleItemList({ courseId, moduleId, canEdit = false }: ModuleItemListProps) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data: items, isLoading } = useModuleItems(courseId, moduleId);
    const reorderItems = useReorderModuleItems(courseId, moduleId);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || !items) return;

        const reorderedItems = Array.from(items);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        const itemIds = reorderedItems.map((item) => item.id);

        reorderItems.mutate({ itemIds });
    };

    if (isLoading) {
        // return <ModuleItemListSkeleton />;
        return <div>cargando</div>;
    }

    if (!items || items.length === 0) {
        return (
            <div className="py-8 text-center border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                    No hay elementos en este módulo todavía.
                </p>
                {canEdit && (
                    <>
                        <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar elemento
                        </Button>
                        <CreateModuleItemDialog
                            courseId={courseId}
                            moduleId={moduleId}
                            open={createDialogOpen}
                            onOpenChange={setCreateDialogOpen}
                        />
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {canEdit && (
                <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar elemento
                    </Button>
                </div>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`module-items-${moduleId}`} isDropDisabled={!canEdit}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                                'space-y-2',
                                snapshot.isDraggingOver && 'bg-muted/30 rounded-lg p-2'
                            )}
                        >
                            {items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                    isDragDisabled={!canEdit}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={cn(snapshot.isDragging && 'opacity-50')}
                                        >
                                            <ModuleItemCard
                                                item={item}
                                                courseId={courseId}
                                                moduleId={moduleId}
                                                canEdit={canEdit}
                                                dragHandleProps={canEdit ? provided.dragHandleProps : undefined}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <CreateModuleItemDialog
                courseId={courseId}
                moduleId={moduleId}
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </div>
    );
}