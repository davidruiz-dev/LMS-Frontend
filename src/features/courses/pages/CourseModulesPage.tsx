import NotFoundPage from "@/components/NotFoundPage";
import { Button } from "@/components/ui/button"
import ModuleForm from "@/features/courses/components/modules/ModuleForm";
import ModuleItemForm from "@/features/courses/components/modules/ModuleItemForm";
import ModuleList from "@/features/courses/components/modules/ModuleList";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { useModulesByCourse, useReorderModuleItems, useReorderModules } from "@/features/courses/hooks/use-modules";
import type { ReorderModuleItemsDto, ReorderModulesDto } from "@/features/courses/types/course.types";
import { reorder } from "@/utils/reorder";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { PlusCircleIcon } from "lucide-react"
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

const CourseModulesPage = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) return <NotFoundPage />;

    const [modalModuleOpen, setModalModuleOpen] = useState(false);
    const [modalItemOpen, setModalItemOpen] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

    const { data: modules = [], error, isPending } = useModulesByCourse(id);
    const { mutate: reorderModules } = useReorderModules();
    const { mutate: reorderModuleItems } = useReorderModuleItems();

    const access = useCourseAccess(id);

    const openModuleModal = useCallback((moduleId?: string) => {
        setSelectedModuleId(moduleId ?? null);
        setModalModuleOpen(true);
    }, []);

    const openItemModal = useCallback((moduleId: string) => {
        setSelectedModuleId(moduleId);
        setModalItemOpen(true);
    }, []);

    const closeModuleModal = () => {
        setModalModuleOpen(false);
        setSelectedModuleId(null);
    };

    const closeItemModal = () => {
        setModalItemOpen(false);
        setSelectedModuleId(null);
    };

    const handleReorderModules = useCallback(
        (modules: ReorderModulesDto) => {
            reorderModules({ courseId: id, orderData: modules });
        },
        [reorderModules, id]
    );

    const handleReorderModuleItems = useCallback(
        (moduleId: string, items: ReorderModuleItemsDto) => {
            reorderModuleItems({ courseId: id, moduleId, orderData: items });
        },
        [reorderModuleItems]
    );

    const onDragEnd = useCallback(
        (result: DropResult) => {
            const { destination, source, type } = result;
            if (!destination) return;

            if (type === "MODULE") {
                const reordered = reorder(modules, source.index, destination.index);
                handleReorderModules({ moduleIds: reordered.map(m => m.id) });
                return;
            }

            if (type === "ITEM") {
                const module = modules.find(m => m.id === source.droppableId);
                if (!module) return;

                const newItems = reorder(module.items, source.index, destination.index);
                handleReorderModuleItems(module.id, {
                    itemIds: newItems.map(i => i.id),
                });
            }
        },
        [modules, handleReorderModules, handleReorderModuleItems]
    );

    if (isPending) return <div>Cargando módulos...</div>;
    if (error) return <div>Error al cargar módulos</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center md:flex-row flex-col">
                <div>
                    <h1 className="text-lg">Contenido</h1>
                    <p className="text-gray-400">Lista de todos los módulos del curso.</p>
                </div>

                {access?.canEnrollUsers && (
                    <Button onClick={() => openModuleModal()}>
                        <PlusCircleIcon /> Agregar
                    </Button>
                )}
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <ModuleList
                    courseId={id}
                    items={modules}
                    onEdit={openModuleModal}
                    onAddItem={openItemModal}
                />
            </DragDropContext>

            <ModuleForm
                isOpen={modalModuleOpen}
                onClose={closeModuleModal}
                courseId={id}
            />


            {selectedModuleId && (
                <ModuleItemForm
                    isOpen={modalItemOpen}
                    onClose={closeItemModal}
                    moduleId={selectedModuleId}
                    courseId={id}
                />
            )}
        </div>
    );
};

export default CourseModulesPage