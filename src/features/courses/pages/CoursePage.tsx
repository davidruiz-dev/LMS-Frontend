import { useCourse } from "@/features/courses/hooks/use-courses";
import { useNavigate, useParams } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ROUTES } from "@/shared/constants/routes";
import { HomeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotFoundPage from "@/components/NotFoundPage";
import LoadingPage from "@/components/LoadingPage";
import { AvatarUser } from "@/components/AvatarUser";
import { Item, ItemContent, ItemHeader } from "@/components/ui/item";

const CoursePage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: courseDetail, isLoading } = useCourse(id);
    const navigate = useNavigate();
    
    if (isLoading) return <LoadingPage message="Cargando curso..."/>
    if (!courseDetail) return <NotFoundPage />
    
    return (
        <div className="space-y-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => navigate(ROUTES.DASHBOARD)}>
                            <div className="flex items-center gap-2">
                                <HomeIcon size={15} /> Dashboard
                            </div>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => navigate(ROUTES.COURSES)}>Cursos</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>{courseDetail?.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-12 gap-4">
                {/* primera columna */}
                <div className="col-span-full xl:col-span-9 space-y-4">
                    <img 
                        src={courseDetail?.imageUrl} 
                        alt={courseDetail?.name} 
                        className="rounded-md w-full h-[320px] object-cover"
                        title={courseDetail?.name}
                        height={350}

                    />
                    <div className="space-y-6">
                        <h1 className="text-4xl dark:text-gray-100 font-bold">{courseDetail?.name}</h1>
                        <div className="text-gray-600 dark:text-gray-400 " 
                            dangerouslySetInnerHTML={{__html: courseDetail?.description}}
                        />
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-xl w-fit bg-secondary">
                        <AvatarUser src={courseDetail.instructor.avatar} 
                        firstName={courseDetail.instructor.firstName}
                        lastName={courseDetail.instructor.lastName}
                        />
                        <div>
                            <p>{courseDetail.instructor.firstName+' '+courseDetail.instructor.lastName}</p>
                            {courseDetail.instructor.email}
                        </div>

                    </div>
                </div>
                {/* segunda columna */}
                <div className="col-span-full xl:col-span-3">
                    <div className="border p-3 rounded-xl">
                        <h1>Anuncios</h1>
                        <Item>
                            <ItemContent>
                                anuncio 1
                            </ItemContent>
                        </Item>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CoursePage