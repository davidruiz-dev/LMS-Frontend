import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/shared/providers/AuthProvider"
import { AvatarUser } from "@/components/AvatarUser"

function Header() {
    const { user } = useAuth()
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center justify-between gap-2 px-4 w-full">
                <SidebarTrigger />
                <div className="flex gap-2 items-center">
                    <ModeToggle />
                    <Separator orientation="vertical" className="h-4" />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <AvatarUser src={user?.avatar} firstName={user!.firstName} lastName={user!.lastName} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default Header;