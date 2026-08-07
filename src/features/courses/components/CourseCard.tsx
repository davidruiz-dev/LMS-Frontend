import { AvatarUser } from "@/components/AvatarUser";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import type { CourseStatDto } from "@/features/dashboard/types/dashboard.types";
import { ROUTES } from "@/shared/constants/routes";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
    course: CourseStatDto;
}

const CourseCard = ({ course }: CourseCardProps) => {
    const navigate = useNavigate();

    return (
        <Card className="p-0 gap-0 overflow-hidden">
            <img src={course.imageUrl || 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg'}
                alt={course.name}
                className="h-40 w-full object-cover"
            />
            <div className="p-3 space-y-3">
                <CardTitle className="first-letter:uppercase">{course.name}</CardTitle>
                <div className="flex items-center">
                    <AvatarUser src={course.instructor.avatar} firstName={course.instructor.firstName} lastName={course.instructor.lastName} />
                    <div className="ml-2">
                        <p className="font-semibold text-xs">{course.instructor.fullName} </p>
                    </div>
                </div>
            </div>
            <div className="p-3 flex border-t">
                <Button className="w-full" size={"sm"} onClick={() => navigate(ROUTES.COURSE_DETAIL(course.id))}>Ver curso</Button>
            </div>
        </Card>
    )
}

export default CourseCard;