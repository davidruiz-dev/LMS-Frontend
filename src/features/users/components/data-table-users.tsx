import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, DownloadIcon, MoreHorizontal, PlusCircleIcon, Search, UploadIcon } from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useUsers } from "@/features/users/hooks/use-users";
import { ROUTES } from "@/shared/constants/routes";
import type { PaginationFilters } from "@/shared/types";

function DataTableUsers() {
    const [filters, setFilters] = useState<PaginationFilters>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        orderBy: 'DESC',
        search: ''
    })
    const { data, isLoading, isError } = useUsers(filters);
    const [searchTerm, setSearchTerm] = useState<string>('');
    // Actualizar paginacion
    const handlePageChange = (page: number) => setFilters({ ...filters, page });
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFilters((prev) => {
                if (prev.search === searchTerm) return prev;
                return {
                    ...prev,
                    search: searchTerm,
                    page: 1,
                };
            });
        }, 500);
        return () => clearTimeout(timeout); // Cancelar timeout si searchTerm cambia antes de que pasen los 500ms
    }, [searchTerm]);

    return (
        <>
            <div className="w-full flex flex-col xl:flex-row gap-3 justify-between items-center mb-4">
                <div className="w-full relative">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="buscar usuarios"
                        className="w-full xl:w-[400px] pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Link to={ROUTES.CREATE_USER}><Button><PlusCircleIcon />Agregar</Button></Link>
                    <Button variant="outline"><UploadIcon /> Importar</Button>
                    <Button variant="outline"><DownloadIcon /> Exportar</Button>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading == true && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={6}>
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        )}

                        {isError == true && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={6}>
                                    Error al cargar los usuarios
                                </TableCell>
                            </TableRow>
                        )}

                        {data?.data?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.firstName} {user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell><Badge variant={user.isActive ? 'default' : 'destructive'}>{user.isActive ? 'Activo' : 'Inactivo'}</Badge></TableCell>
                                <TableCell className="text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon" className="w-8 h-8 p-0 rounded-full">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => navigate(ROUTES.EDIT_USER(user.id))}>
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {data && data.meta.totalPages >= 1 && (
                <Pagination className="w-full pt-2">
                    <PaginationContent>

                        <PaginationItem key={1}>
                            <PaginationLink
                                disabled={data.links.prev === null}
                                onClick={() => handlePageChange(1)}
                            >
                                <span className="sr-only">primera página</span>
                                <ChevronsLeftIcon />
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink
                                disabled={data.links.prev === null}
                                onClick={() => handlePageChange(filters.page! - 1)}
                            >
                                <span className="sr-only">anterior página</span>
                                <ChevronLeftIcon />
                            </PaginationLink>
                        </PaginationItem>
                        {/* Mostrar hasta 5 páginas */}
                        {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
                            const pageNumber = i + 1;
                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        isActive={pageNumber === filters.page}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                        {/* Si hay más páginas que las mostradas */}
                        {data.meta.totalPages > 5 && (
                            <>
                                <PaginationItem>
                                    <span className="px-2">...</span>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => handlePageChange(data.meta.totalPages)}
                                    >
                                        {data.meta.totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}
                        <PaginationItem>
                            <PaginationLink
                                disabled={data.links.next === null}
                                onClick={() => handlePageChange(filters.page! + 1)}
                            >
                                <span className="sr-only">siguiente página</span>
                                <ChevronRightIcon />
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                disabled={data.links.next === null}
                                onClick={() => handlePageChange(data.meta.totalPages)}
                            >
                                <span className="sr-only">última página</span>
                                <ChevronsRightIcon />
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
};

export default DataTableUsers;