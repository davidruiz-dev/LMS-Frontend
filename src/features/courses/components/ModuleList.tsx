import { useEffect, useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Grip, PlusCircleIcon, TrashIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Module } from "@/features/courses/types/course.types";

interface ModuleListProps {
  courseId: string;
  items: Module[];
  onEdit: (id: string) => void;
  onAddItem: (id: string) => void;
}

const ModuleList = ({
  courseId,
  items,
  onEdit,
  onAddItem,
}: ModuleListProps) => {
  const [modules, setModules] = useState<Module[]>(items);
  const access = useCourseAccess(courseId);

  useEffect(() => {
    setModules(items);
  }, [items]);

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <Droppable droppableId="modules-course" type="MODULE">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {modules.map((module, index) => (
              <Draggable key={module.id} draggableId={module.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={
                      "flex items-center gap-x-2 bg-background border rounded-md mb-4 text-sm px-2"
                    }
                  >
                    <AccordionItem value={module.id} className="flex-1">
                      <AccordionTrigger>
                        <div
                          {...provided.dragHandleProps}
                          className={`cursor-move ${access?.canEditModules ? "block" : "hidden"}`}
                        >
                          <Grip className="text-muted-foreground size-5" />
                        </div>
                        {module.title}
                        {access?.canEditModules && (
                          <div className="flex justify-end items-center gap-2 flex-1">
                            <Badge
                              variant={
                                module.isPublished ? "default" : "destructive"
                              }
                            >
                              {module.isPublished ? "publicado" : "draft"}
                            </Badge>
                            {/* <Button variant="outline" size={"icon"}><TrashIcon className="text-muted-foreground size-4" /></Button> */}
                          </div>
                        )}
                      </AccordionTrigger>
                      <AccordionContent>
                        {module.items?.length === 0 && (
                          <div className="border rounded-md bg-muted p-4 border-dashed flex flex-col items-center gap-2">
                            <span>No hay contenido en este módulo</span>
                            <Button onClick={() => onAddItem(module.id)}>
                              Agregar
                            </Button>
                          </div>
                        )}
                        {module.items?.length > 0 && (
                          <div className="space-y-2 flex flex-col">
                            {access?.canEditModules && (
                              <Button
                                size={"sm"}
                                onClick={() => onAddItem(module.id)}
                                className="self-end"
                              >
                                <PlusCircleIcon />
                                Agregar
                              </Button>
                            )}
                            <Droppable droppableId={module.id} type="ITEM">
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="space-y-1.5"
                                >
                                  {module.items?.map((item, index) => (
                                    <Draggable
                                      key={item.id}
                                      draggableId={item.id}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className="border rounded p-2 flex items-center gap-2"
                                        >
                                          <div
                                            {...provided.dragHandleProps}
                                            className={`cursor-move ${access?.canEditModules ? "block" : "hidden"}`}
                                          >
                                            <Grip className="text-muted-foreground size-4" />
                                          </div>

                                          {item.title}
                                          {access?.canEditModules && (
                                            <div className="flex justify-end items-center gap-2 flex-1">
                                              <Badge
                                                variant={
                                                  item.published
                                                    ? "default"
                                                    : "destructive"
                                                }
                                              >
                                                {item.published
                                                  ? "publicado"
                                                  : "draft"}
                                              </Badge>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        )}
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
    </Accordion>
  );
};

export default ModuleList;