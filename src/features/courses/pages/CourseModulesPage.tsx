import LoadingPage from "@/components/LoadingPage";
import { Button } from "@/components/ui/button"
import ModuleForm from "@/features/courses/components/ModuleForm";
import ModuleItemForm from "@/features/courses/components/ModuleItemForm";
import ModuleList from "@/features/courses/components/ModuleList";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { useModulesByCourse, useReorderModuleItems, useReorderModules } from "@/features/courses/hooks/use-modules";
import type { ReorderModuleItemsDto, ReorderModulesDto } from "@/features/courses/types/course.types";
import { showError, showSuccess } from "@/helpers/alerts";
import { reorder } from "@/utils/reorder";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { PlusCircleIcon } from "lucide-react"
import { useState } from "react";
import { useParams } from "react-router-dom";

const CourseModulesPage = () => {
    const { id } = useParams<{ id: string }>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalItemOpen, setModalItemOpen] = useState<boolean>(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

    const { data: modules, isLoading, error } = useModulesByCourse(id);
    const { mutate: reorderModules } = useReorderModules();
    const { mutate: reorderModuleItems } = useReorderModuleItems();

    const access = useCourseAccess(id!);

    if (isLoading) return <LoadingPage message='cargando...' />

    const toggleModal = () => setModalOpen(!modalOpen);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;
        if (!destination || !modules) return;

        if (type === 'MODULE') {
            const reorderedModules = reorder(modules, source.index, destination.index)
            handleReorderModules({ moduleIds: reorderedModules.map(m => m.id) })
            return;
        }

        if (type === 'ITEM') {
            const moduleId = source.droppableId;
            const module = modules!.find(m => m.id === moduleId);
            if (!module) return;
            const newItems = reorder(module.items,source.index,destination.index);
            handleReorderModuleItems(moduleId, { itemIds: newItems.map(i => i.id) })
        }
    }

    const handleReorderModules = async (modules: ReorderModulesDto) => {
        reorderModules({ courseId: id!, orderData: modules }, {
            onSuccess: () => {
                showSuccess("Módulos reordenados correctamente");
            },
            onError: () => {
                showError("Error al reordenar módulos");
            }
        })
    };

    const handleReorderModuleItems = async (moduleId: string, items: ReorderModuleItemsDto) => {
        reorderModuleItems({ moduleId, orderData: items }, {
            onSuccess:() => {
                showSuccess("Elementos reordenados correctamente");
            },
            onError: () => {
                showError("Error al reordenar elementos");
            }
        })
    };

    if (error) return <div>Error al cargar los módulos.</div>

    return (
        <div className='space-y-4'>
            <div className="flex justify-between items-center md:flex-row flex-col">
                <div>
                    <h1 className='text-lg'>Contenido</h1>
                    <p className='text-gray-400'>Lista de todos los módulos del curso.</p>
                </div>
                {access?.canEnrollUsers && (
                    <Button onClick={toggleModal}><PlusCircleIcon /> Agregar</Button>
                )}
            </div>

            {modules && modules?.length === 0 &&
                <div className='text-center text-gray-400 p-4'>No hay módulos agregados a este curso.</div>
            }

            <DragDropContext onDragEnd={onDragEnd}>
                <ModuleList
                    courseId={id!}
                    items={modules!}
                    onEdit={() => { }}
                    onAddItem={(moduleId: string) => {
                        setModalItemOpen(true)
                        setSelectedModuleId(moduleId)
                    }} />
            </DragDropContext>

            <ModuleForm
                isOpen={modalOpen}
                onClose={toggleModal}
                courseId={id!}
            />

            <ModuleItemForm
                isOpen={modalItemOpen}
                onClose={() => setModalItemOpen(!modalItemOpen)}
                moduleId={selectedModuleId!}
            />
        </div>
    )
}

export default CourseModulesPage