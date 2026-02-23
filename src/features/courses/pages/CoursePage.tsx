import { useCourse, usePublishCourse } from "@/features/courses/hooks/use-courses";
import { useNavigate, useParams } from "react-router-dom"
import LoadingPage from "@/components/LoadingPage";
import { AvatarUser } from "@/components/AvatarUser";
import { useUpcomingAssignments } from "@/features/courses/hooks/use-assignments";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { useCourseAccess } from "@/features/courses/hooks/use-course-access";
import { getDistanceToNow } from "@/utils/getDistanceToNow";

const CoursePage = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) return null;
    const { data: courseDetail, isLoading } = useCourse(id);
    const { data: upcomingAssignments } = useUpcomingAssignments(id);
    const publishCourse = usePublishCourse();
    const onPublish = () => publishCourse.mutate(id);
    const access = useCourseAccess(id);

    const navigate = useNavigate();

    if (!courseDetail || isLoading) return <LoadingPage message="Cargando..." />

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl dark:text-gray-100 font-bold">{courseDetail?.name}</h1>

                {access?.isOwner && (
                    <Button onClick={onPublish} disabled={courseDetail.status === 'published'} variant={'blue'}>
                        {courseDetail.status === 'published' ? 'Publicado' : 'Publicar curso'}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* primera columna */}
                <div className="col-span-full xl:col-span-8 space-y-4">
                    <img
                        src={courseDetail?.imageUrl}
                        alt={courseDetail?.name}
                        className="rounded-md w-full h-80 object-cover"
                        title={courseDetail?.name}
                        height={320}
                    />

                    <div className="space-y-2">
                        <h1 className="font-bold text-xl">Descripción</h1>
                        <div
                            className="text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: courseDetail?.description }}
                        />
                    </div>

                    <div className="flex items-center gap-3 ">
                        <AvatarUser src={courseDetail.instructor.avatar}
                            firstName={courseDetail.instructor.firstName}
                            lastName={courseDetail.instructor.lastName}
                        />
                        <div>
                            <p>{courseDetail.instructor.firstName + ' ' + courseDetail.instructor.lastName}</p>
                            {courseDetail.instructor.email}
                        </div>
                    </div>
                </div>

                {/* segunda columna */}
                <div className="col-span-full xl:col-span-4">
                    {/* UPCOMING ASSIGNMENTS */}
                    <div className="border p-3 rounded-lg space-y-3 max-h-80 overflow-y-auto">
                        <div className="flex justify-between items-center gap-2">
                            <h1 className="font-bold">Próximas tareas</h1>
                            <Button
                                className="font-normal"
                                variant={"link"}
                                onClick={() => navigate(ROUTES.COURSE_ASSIGNMENTS(id))}
                            >
                                ver todos
                            </Button>
                        </div>
                        <div>
                            {upcomingAssignments?.map((assignment) => (
                                <div key={assignment.id} className="border-b p-3 cursor-pointer hover:bg-muted/50"
                                    onClick={() => navigate(ROUTES.COURSE_ASSIGNMENT(id, assignment.id))}>
                                    <div className="text-sm space-y-2">
                                        <h1 className="font-medium">{assignment.name}</h1>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Calendar size={13} />
                                            <span className="text-xs">
                                                {new Date(assignment.dueDate).toLocaleDateString()}
                                                {getDistanceToNow(new Date(assignment.dueDate)) && ` (cierra ${getDistanceToNow(new Date(assignment.dueDate))})`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!upcomingAssignments?.length && (
                                <p className="text-sm text-muted-foreground text-center py-4">No hay tareas próximas</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default CoursePage