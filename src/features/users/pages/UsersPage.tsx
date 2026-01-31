import DataTableUsers from "@/features/users/components/data-table-users"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HomeIcon } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

const UsersPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-4">
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
            <BreadcrumbLink>Usuarios</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DataTableUsers />
    </div>
  )
}

export default UsersPage