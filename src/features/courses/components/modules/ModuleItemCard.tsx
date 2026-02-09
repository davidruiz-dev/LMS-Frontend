import { useState } from 'react';
import {
  FileText,
  MessageSquare,
  ClipboardList,
  HelpCircle,
  ExternalLink,
  GripVertical,
  MoreVertical,
  CheckCircle2,
  Circle,
  Lock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ModuleItem } from '@/features/courses/types/course.types';
import { useDeleteModuleItem } from '@/features/courses/hooks/use-modules';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

interface ModuleItemCardProps {
  item: ModuleItem;
  courseId: string;
  moduleId: string;
  canEdit?: boolean;
  dragHandleProps?: any;
}

const itemTypeIcons = {
  File: FileText,
  Page: FileText,
  Discussion: MessageSquare,
  Assignment: ClipboardList,
  Quiz: HelpCircle,
  SubHeader: FileText,
  ExternalUrl: ExternalLink,
  ExternalTool: ExternalLink,
};

const itemTypeLabels = {
  File: 'Archivo',
  Page: 'Página',
  Discussion: 'Discusión',
  Assignment: 'Tarea',
  Quiz: 'Cuestionario',
  SubHeader: 'Encabezado',
  ExternalUrl: 'URL Externa',
  ExternalTool: 'Herramienta Externa',
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
  //   const markComplete = useMarkItemComplete(courseId, moduleId, item.id);
  //   const markIncomplete = useMarkItemIncomplete(courseId, moduleId, item.id);

  //   const Icon = itemTypeIcons[item.type];
  //   const isCompleted = item.completionRequirement?.completed ?? false;
  //   const isLocked = item.contentDetails?.lockedForUser ?? false;
  //   const hasDueDate = item.contentDetails?.dueAt;

  const handleToggleComplete = () => {
    // if (isCompleted) {
    //   markIncomplete.mutate();
    // } else {
    //   markComplete.mutate();
    // }
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
      deleteItem.mutate(item.id);
    }
  };

  const handleItemClick = () => {
    if (item.content) {
      window.open(item.content, '_blank');
    }
    if(item.type === 'assignment') {
      navigate(ROUTES.COURSE_ASSIGNMENT(courseId, item.contentId))
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

          {/* {item.completionRequirement && !canEdit && (
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggleComplete}
              disabled={isLocked}
              className="flex-shrink-0"
            />
          )} */}

          {/* <div className="flex-shrink-0">
            <Icon className={cn('w-5 h-5', isLocked && 'text-muted-foreground')} />
          </div> */}

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

            {/* <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{itemTypeLabels[item.type]}</span>

              {item.contentDetails?.pointsPossible && (
                <span>{item.contentDetails.pointsPossible} puntos</span>
              )}

              {hasDueDate && (
                <span>Vence: {format(new Date(hasDueDate), 'PPp', { locale: es })}</span>
              )}

              {item.completionRequirement?.type === 'min_score' && (
                <span>Puntaje mínimo: {item.completionRequirement.minScore}</span>
              )}
            </div> */}
          </div>

          {item.content && (
            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )} 

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

      {/* <EditModuleItemDialog
        courseId={courseId}
        moduleId={moduleId}
        item={item}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      /> */}
    </>
  );
}