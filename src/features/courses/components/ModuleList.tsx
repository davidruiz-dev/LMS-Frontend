import { useEffect, useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Grip, MoreHorizontal, PlusCircleIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Module } from "@/features/courses/types/course.types";
import ModuleDeleteDialog from "@/features/courses/components/ModuleDelete";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch"

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
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);

  useEffect(() => {
    setModules(items);
  }, [items]);

  return (
    <Accordion type="single" collapsible>
      <Droppable droppableId="modules-course" type="MODULE">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {/* ---- MODULES LIST MAP ---- */}
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
                        <div className="flex w-full items-center gap-2">
                          <div
                            {...provided.dragHandleProps}
                            className={`cursor-move ${access?.canEditModules ? "block" : "hidden"}`}
                          >
                            <Grip className="text-muted-foreground size-5" />
                          </div>
                          <span className="flex-1">{module.title}</span>
                          {access?.canEditModules && (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={module.isPublished ? "default" : "destructive"}
                              >
                                {module.isPublished ? "publicado" : "borrador"}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <div className="p-1 cursor-pointer rounded-md hover:bg-muted border">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    setModuleToDelete(module.id)
                                  }}>
                                    Eliminar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                  }}>
                                    <Switch />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                      </AccordionTrigger>
                      <ModuleDeleteDialog
                        courseId={courseId}
                        moduleId={moduleToDelete!}
                        isOpen={!!moduleToDelete}
                        onClose={() => setModuleToDelete(null)}
                      />
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
                                                  : "borrador"}
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
                            {access?.canEditModules && (
                              <Button
                                size={"sm"}
                                onClick={() => onAddItem(module.id)}
                                className="self-end"
                                variant={"outline"}
                              >
                                <PlusCircleIcon />
                                Agregar
                              </Button>
                            )}
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