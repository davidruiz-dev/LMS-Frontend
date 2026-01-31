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
import UserForm from "@/features/users/components/UserForm";

const AddUserPage = () => {
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
                        <BreadcrumbLink onClick={() => navigate(ROUTES.USERS)}>Usuarios</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>Agregar usuario</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <UserForm />
        </div>
    )
}

export default AddUserPage