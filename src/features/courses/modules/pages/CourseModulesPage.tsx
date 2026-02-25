import { ModuleList } from "@/features/courses/modules/components/ModuleList";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";

import { useParams } from "react-router-dom";

const CourseModulesPage = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) return null;
    const access = useCourseAccess(id);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center md:flex-row flex-col">
                <div>
                    <h1 className="text-3xl font-bold">Módulos del Curso</h1>
                    <p className="text-muted-foreground">Lista de todo el contenido del curso.</p>
                </div>
            </div>
            <ModuleList
                courseId={id}
                canEdit={access?.canEnrollUsers || false}
            />
        </div>
    );
};

export default CourseModulesPage