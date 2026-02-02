import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult, } from "@hello-pangea/dnd";
import { Grip, TrashIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reorder } from "@/utils/reorder";
import type { Module, ReorderModulesDto } from "@/features/courses/types/course.types";

interface ModuleListProps {
    courseId: string;
    items: Module[];
    onReorder: (modules: ReorderModulesDto) => void;
    onEdit: (id: string) => void;
    onAddItem: () => void;
}

const ModuleList = ({ courseId, items, onReorder, onEdit, onAddItem }: ModuleListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [modules, setModules] = useState<Module[]>(items);
    const access = useCourseAccess(courseId);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setModules(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;
        if (!destination) return;

        const newModules = reorder(
            modules,
            source.index,
            destination.index
        );
        setModules(newModules);
        try {
            onReorder({
                moduleIds: newModules.map(m => m.id),
            });
        } catch (error) {
            console.error(error);
            setModules(modules);
        }
    };

    if (!isMounted) return null;

    return (
        <Accordion type="single" collapsible defaultValue="item-1">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="modules-course">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {modules.map((module, index) => (
                                <Draggable
                                    key={module.id}
                                    draggableId={module.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps}
                                            className={'flex items-center gap-x-2 bg-background border rounded-md mb-4 text-sm px-2'}
                                        >

                                            <AccordionItem value={module.id} className="flex-1">
                                                <AccordionTrigger>
                                                    {access?.canEditModules && (
                                                        <div {...provided.dragHandleProps}
                                                            className={'cursor-move'}
                                                        >
                                                            <Grip className="text-muted-foreground size-5" />
                                                        </div>
                                                    )}
                                                    {module.title}
                                                    {access?.canEditModules && (
                                                        <div className="flex justify-end items-center gap-2 flex-1">
                                                            <Badge variant={module.isPublished ? 'default' : 'destructive'}>
                                                                {module.isPublished ? "publicado" : "draft"}</Badge>
                                                            {/* <Button variant="outline" size={"icon"}><TrashIcon className="text-muted-foreground size-4" /></Button> */}

                                                        </div>
                                                    )
                                                    }

                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="border rounded-md bg-stone-50 p-4 border-dashed flex flex-col items-center gap-2" >
                                                        {module.items?.length === 0 && (
                                                            <>
                                                                <span>No hay contenido en este módulo</span>
                                                                <Button onClick={() => onAddItem()}>Agregar</Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Accordion>
    );
};

export default ModuleList;