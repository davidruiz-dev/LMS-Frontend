import { AvatarUser } from "@/components/AvatarUser";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import type { CourseStatDto } from "@/features/dashboard/types/dashboard.types";
import { ROUTES } from "@/shared/constants/routes";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/useAuthContext";

interface CourseCardProps {
    course: CourseStatDto;
}

const CourseCard = ({ course }: CourseCardProps) => {
    const navigate = useNavigate();
    const { canManageCourse } = useAuth();
    const canManage = canManageCourse(course.instructor.id)

    return (
        <Card className="p-0 gap-0 overflow-hidden relative">
            <img src={course.imageUrl || 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg'}
                alt={course.name}
                className="h-40 w-full object-cover"
            />

            {canManage && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" className="size-7 p-0 absolute top-2 right-2 bg-black/10 hover:bg-black/10">
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigate(ROUTES.COURSE_DETAIL(course.id))}>
                            Ver curso
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate(ROUTES.EDIT_COURSE(course.id))}>
                            Editar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}


            <div className="p-3 space-y-3">
                <CardTitle className="first-letter:uppercase">{course.name}</CardTitle>
                <div className="flex items-center">
                    <AvatarUser src={course.instructor.avatar} firstName={course.instructor.firstName} lastName={course.instructor.lastName} />
                    <div className="ml-2" onClick={() => navigate(ROUTES.USER_PROFILE(course.instructor.id))}>
                        <p className="font-semibold text-xs hover:underline cursor-pointer">{course.instructor.fullName} </p>
                    </div>
                </div>
            </div>
            <div className="p-3 flex border-t">
                <Button className="w-full cursor-pointer" size={"sm"} onClick={() => navigate(ROUTES.COURSE_DETAIL(course.id))}>Ver curso</Button>
            </div>
        </Card>
    )
}

export default CourseCard;