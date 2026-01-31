
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { ThemeProvider } from "../theme-provider";


export default function Layout() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <SidebarProvider>
                {/* SIDEBAR */}
                <AppSidebar />
                {/* CONTENT */}
                <SidebarInset>
                    <Header />
                    <main className="h-full w-full">
                        <Outlet /> 
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
