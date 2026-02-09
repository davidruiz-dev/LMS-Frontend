import { ModuleList } from "@/features/courses/components/modules/ModuleList";
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
                    <h1 className="text-lg">Módulos del Curso</h1>
                    <p className="text-gray-400">Organiza y gestiona el contenido de tu curso.</p>
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