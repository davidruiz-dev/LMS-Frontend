import { useState } from 'react';
import { MoreVertical, GripVertical } from 'lucide-react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDeleteModule } from '../../hooks/use-modules';
import { EditModuleDialog } from '@/features/courses/modules/components/EditModuleDialog';
import { ModuleItemList } from '@/features/courses/modules/components/ModuleItemList';
import { Badge } from '@/components/ui/badge';
import type { Module } from '@/features/courses/modules/types/module.types';

interface ModuleAccordionItemProps {
    module: Module;
    courseId: string;
    canEdit?: boolean;
    dragHandleProps?: any;
}

export function ModuleAccordionItem({
    module,
    courseId,
    canEdit = false,
    dragHandleProps,
}: ModuleAccordionItemProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const deleteModule = useDeleteModule(courseId);
    //const publishModule = usePublishModule(courseId, module.id);
    //const unpublishModule = useUnpublishModule(courseId, module.id);

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de eliminar este módulo?')) {
            deleteModule.mutate(module.id);
        }
    };

    //   const handlePublish = (e: Event) => {
    //     e.stopPropagation();
    //     if (module.state === 'locked') {
    //       publishModule.mutate();
    //     } else {
    //       unpublishModule.mutate();
    //     }
    //   };

    //const isLocked = module.state === 'locked';
    //const hasUnlockDate = module.unlockAt && new Date(module.unlockAt) > new Date();

    return (
        <div className="border rounded-lg bg-card px-3">
            <AccordionItem
                value={module.id}
            >
                <div className="flex items-center gap-2">
                    {canEdit && dragHandleProps && (
                        <div
                            {...dragHandleProps}
                            className="cursor-grab active:cursor-grabbing py-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                        </div>
                    )}
                    <div className="flex-1">
                        <AccordionTrigger className="hover:no-underline">
                            {module.title}
                            {canEdit && (
                                <Badge variant={module.isPublished ? 'secondary' : 'destructive'} className="flex-shrink-0">
                                    {module.isPublished ? 'publicado' : 'borrador'}
                                </Badge>
                            )}
                        </AccordionTrigger>
                    </div>
                    {canEdit && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditDialogOpen(true);
                                    }}
                                >
                                    Editar
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem onClick={handlePublish}>
                                    {isLocked ? 'Publicar' : 'Despublicar'}
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <AccordionContent className="">
                    <ModuleItemList courseId={courseId} moduleId={module.id} canEdit={canEdit} />
                </AccordionContent>
            </AccordionItem>

            <EditModuleDialog
                courseId={courseId}
                module={module}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </div>
    );
}