import DataTableCourses from "@/features/courses/components/DataTableCourses";
import { ROUTES } from "@/shared/constants/routes";
import { HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useAuth } from "@/shared/providers/AuthProvider";
import { USER_ROLES } from "@/shared/constants";

export default function CoursesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const renderCourses = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return <DataTableCourses />
      case USER_ROLES.INSTRUCTOR:
        return <h1 className="text-2xl font-semibold">Mis Cursos</h1>
      default:
        return <h1 className="text-2xl font-semibold">Cursos Disponibles</h1>
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
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
              <BreadcrumbLink>Cursos</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* COURSES TABLE */}
      <DataTableCourses />

    </div>
  )
}
