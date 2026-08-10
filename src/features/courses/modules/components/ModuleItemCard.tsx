import { useState } from 'react';
import {
  FileText,
  MessageSquare,
  ClipboardList,
  HelpCircle,
  ExternalLink,
  GripVertical,
  MoreVertical,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/shared/lib/utils';
import { useDeleteModuleItem } from '@/features/courses/hooks/use-modules';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import type { ModuleItem, ModuleItemType } from '@/features/courses/modules/types/module.types';
import type { DraggableProvided } from '@hello-pangea/dnd';
import EditModuleItemDialog from './EditModuleItemDialog';

interface ModuleItemCardProps {
  item: ModuleItem;
  courseId: string;
  moduleId: string;
  canEdit?: boolean;
  dragHandleProps?: DraggableProvided;
}

const itemTypeIcons: Record<ModuleItemType, LucideIcon> = {
  assignment: ClipboardList,
  discussion: MessageSquare,
  file: FileText,
  page: FileText,
  quiz: HelpCircle,
  external_url: ExternalLink,
};

const itemTypeLabels: Record<ModuleItemType, string> = {
  assignment: 'Tarea',
  discussion: 'Discusión',
  file: 'Archivo',
  page: 'Página',
  quiz: 'Cuestionario',
  external_url: 'URL Externa',
};

export function ModuleItemCard({
  item,
  courseId,
  moduleId,
  canEdit = false,
  dragHandleProps,
}: ModuleItemCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate()
  const deleteItem = useDeleteModuleItem(courseId, moduleId);

  const Icon = itemTypeIcons[item.type];
  //   const isCompleted = item.completionRequirement?.completed ?? false;
  //   const isLocked = item.contentDetails?.lockedForUser ?? false;
  //   const hasDueDate = item.contentDetails?.dueAt;

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
      deleteItem.mutate(item.id);
    }
  };

  const handleItemClick = () => {
    if (item.type === 'external_url') {
      window.open(item.externalUrl, '_blank');
    }
    if (item.type === 'assignment') {
      navigate(ROUTES.COURSE_ASSIGNMENT(courseId, item.contentId))
    }
    if (item.type === 'quiz') {
      navigate(ROUTES.COURSE_QUIZ(courseId, item.contentId))
    }
  };

  return (
    <>
      <Card
        className={cn(
          'group hover:bg-accent/5 transition-colors py-0',
          //   isLocked && 'opacity-60'
        )}
      //style={{ marginLeft: `${item.indent * 24}px` }}
      >
        <div className="flex items-center gap-3 p-3">
          {canEdit && dragHandleProps && (
            <div
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
          )}

          <div className="flex-shrink-0">
            <Icon className={'size-4'} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={handleItemClick}
                // disabled={isLocked}
                className={cn(
                  'text-sm font-medium text-left truncate hover:underline cursor-pointer',
                  //   isLocked && 'cursor-not-allowed hover:no-underline'
                )}
              >
                {item.title}
              </button>

              {/* {isLocked && (
                <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              )} */}

              {canEdit && (
                <Badge variant={item.published ? 'secondary' : 'destructive'} className="flex-shrink-0">
                  {item.published ? 'publicado' : 'borrador'}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{itemTypeLabels[item.type]}</span>

              {/* {item.contentDetails?.pointsPossible && (
                <span>{item.contentDetails.pointsPossible} puntos</span>
              )}

              {hasDueDate && (
                <span>Vence: {format(new Date(hasDueDate), 'PPp', { locale: es })}</span>
              )}

              {item.completionRequirement?.type === 'min_score' && (
                <span>Puntaje mínimo: {item.completionRequirement.minScore}</span>
              )} */}
            </div>
          </div>

          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  Editar
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => window.open(item.htmlUrl, '_blank')}>
                  Ver contenido
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </Card>

      <EditModuleItemDialog
        courseId={courseId}
        moduleId={moduleId}
        item={item}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}