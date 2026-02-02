import { useCourse } from "@/features/courses/hooks/use-courses";
import { useNavigate, useParams } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ROUTES } from "@/shared/constants/routes";
import { HomeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotFoundPage from "@/components/NotFoundPage";
import LoadingPage from "@/components/LoadingPage";

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
                <div className="col-span-full xl:col-span-9 space-y-2">
                    <img 
                        src={courseDetail?.imageUrl} 
                        alt={courseDetail?.name} 
                        className="rounded-md w-full h-[350px] object-cover"
                        title={courseDetail?.name}
                        height={350}

                    />
                    <h1 className="text-3xl dark:text-gray-100 font-semibold">{courseDetail?.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-wrap">{courseDetail?.short_description}</p>
                </div>
                {/* segunda columna */}
                <div className="col-span-full xl:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Anuncios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-neutral-400">No hay anuncios disponibles</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}

export default CoursePage