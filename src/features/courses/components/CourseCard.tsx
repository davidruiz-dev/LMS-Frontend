import { AvatarUser } from "@/components/AvatarUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import type { Course } from "@/features/courses/types/course.types";
import { COURSE_STATUS } from "@/shared/constants";
import { ROUTES } from "@/shared/constants/routes";
import { useNavigate } from "react-router-dom";

interface Props {
    course: Course;
}

const CourseCard = ({ course }: Props) => {
    const navigate = useNavigate();

    return (
        <Card className="p-0 gap-0">
            <div className="p-2">
                <div className="relative">
                    {course.status === COURSE_STATUS.ARCHIVED && (
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center rounded-md">
                            <div className="text-center text-white text-xl font-bold">Finalizado</div>
                        </div>
                    )}
                    <img src={course.imageUrl || 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg'} alt={course.name} className="rounded-md h-40 w-full object-cover" />
                </div>
            </div>
            <div className="p-3 pt-0 space-y-3">
                <CardTitle>{course.name}</CardTitle>
                <Badge variant={"outline"}>{course.gradeLevel.name} - {course.gradeLevel.level}</Badge>
                <div className="flex items-center">
                    <AvatarUser src={course.instructor.avatar} firstName={course.instructor.firstName} lastName={course.instructor.lastName} />
                    <div className="ml-2">
                        <p className="font-semibold text-sm">{course.instructor.firstName} {course.instructor.lastName}</p>
                        <p className="text-xs text-gray-500">{course.instructor.email}</p>
                    </div>
                </div>
                <Button className="w-full" variant={"default"}
                    onClick={() => navigate(ROUTES.COURSE_DETAIL(course.id))}
                >Ver más</Button>
            </div>
        </Card>
    )
}

export default CourseCard