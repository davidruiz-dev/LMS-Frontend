import type { Module } from "@/shared/types"
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult, } from "@hello-pangea/dnd";
import { Grip, TrashIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ModuleListProps {
    courseId: string;
    items: Module[];
    onReorder: (modules: Module[]) => void;
    onEdit: (id: string) => void;
}

const ModuleList = ({ courseId, items, onReorder, onEdit }: ModuleListProps) => {
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
        if (!result.destination) return;
        const items = Array.from(modules);
        const [reorderedItems] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItems);
        const startIndex = Math.min(result.source.index, result.destination.index)
        const endIndex = Math.max(result.source.index, result.destination.index)
        const updatedItems = items.slice(startIndex, endIndex + 1);
        setModules(items);
        const bulkUpdateModules = updatedItems.map((module) => ({
            id: module.id,
            title: module.title,
            position: items.findIndex((item) => item.id === module.id),
        }));
        
        onReorder(bulkUpdateModules);
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
                                                            <Badge variant={module.isPublished ? 'default' : 'destructive' }>
                                                                {module.isPublished ? "publicado" : "draft"}</Badge>
                                                            <Button variant="outline" size={"icon"}><TrashIcon className="text-muted-foreground size-4"/></Button>
                                                        
                                                        </div>
                                                        )
                                                    }
                                                    
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, tempora dolores? Impedit libero dolores nihil quisquam? Nesciunt perferendis magnam accusantium.
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