import LoadingPage from "@/components/LoadingPage";
import { Button } from "@/components/ui/button"
import ModuleForm from "@/features/courses/components/ModuleForm";
import ModuleItemForm from "@/features/courses/components/ModuleItemForm";
import ModuleList from "@/features/courses/components/ModuleList";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { useModulesByCourse, useReorderModules } from "@/features/courses/hooks/use-modules";
import type { ReorderModulesDto } from "@/features/courses/types/course.types";
import { PlusCircleIcon } from "lucide-react"
import { useState } from "react";
import { useParams } from "react-router-dom";

const CourseModulesPage = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalItemOpen, setModalItemOpen] = useState<boolean>(false);

    const { id } = useParams<{ id: string }>();
    const { data: modules, isLoading } = useModulesByCourse(id);
    const { mutate: reorderModules } = useReorderModules();

    const access = useCourseAccess(id!);

    if (isLoading) return <LoadingPage message='cargando...' />

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }

    const handleReorder = async (modules: ReorderModulesDto) => {
        try {
            reorderModules({ courseId: id!, orderData: modules });
        } catch (error) {
            throw error;
        }
    }

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

            {modules && (
                <ModuleList
                    courseId={id!}
                    items={modules}
                    onReorder={handleReorder}
                    onEdit={() => { }}
                    onAddItem={() => setModalItemOpen(true)} />
            )}

            <ModuleForm
                isOpen={modalOpen}
                onClose={toggleModal}
                courseId={id!}
            />

            <ModuleItemForm isOpen={modalItemOpen} onClose={() => setModalItemOpen(false)} courseId={id!} />
        </div>
    )
}

export default CourseModulesPage