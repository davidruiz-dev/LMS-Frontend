import { Command, LayoutDashboard, LogOut, Settings, Users, GraduationCap, Book,  } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/shared/providers/AuthProvider"
import { ROUTES } from "@/shared/constants/routes"
import { USER_ROLES } from "@/shared/constants"
import { useEffect, useState } from "react"
import type { Role } from "@/shared/types"

export interface SidebarItem {
  title: string;
  path: string;
  icon?: any;
  roles: Role[];
}
// Menu items.
const sidebarItems: SidebarItem[] = [
    {
        title: "Dashboard",
        path: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        roles: ['admin', 'student', 'instructor']
    },
    {
        title: "Grados",
        path: ROUTES.GRADE_LEVELS,
        icon: GraduationCap,
        roles: [USER_ROLES.ADMIN]
    },
    {
        title: "Cursos",
        path: ROUTES.COURSES,
        icon: Book,
        roles: [USER_ROLES.ADMIN, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR]
    },
    {
        title: "Usuarios",
        path: ROUTES.USERS,
        icon: Users,
        roles: [USER_ROLES.ADMIN]
    },
    {
        title: "Settings",
        path: "#",
        icon: Settings,
        roles: [USER_ROLES.ADMIN, USER_ROLES.STUDENT, USER_ROLES.INSTRUCTOR]
    },
]

export function AppSidebar() {
    const {logout, user} = useAuth();
    const location = useLocation();
    const [items, setItems] = useState<SidebarItem[]>([]);

    useEffect(()=> {
        if (user) {
            const visibleItems = sidebarItems.filter(item => item.roles.includes(user?.role));
            setItems(visibleItems)
        }
    }, [user])

    return (
        <Sidebar collapsible="icon" >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">INLRN</span>
                                    <span className="truncate text-xs">InnovaLearn</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title} >
                                    <SidebarMenuButton asChild isActive={location.pathname.includes(item.path)}>
                                        <Link to={item.path}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={logout}>
                            <LogOut/> Cerrar sesión
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
