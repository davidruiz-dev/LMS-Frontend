import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCourses } from "@/features/courses/hooks/use-courses";
import type { PaginationFilters } from "@/shared/types";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Book, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, DownloadIcon, MoreHorizontal, PlusCircleIcon, Search, UploadIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { USER_ROLES } from "@/shared/constants";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { SkeletonTable } from "@/components/SkeletonTable";
import { AlertError } from "@/components/AlertError";
import { useAuth } from "@/features/auth/hooks/useAuthContext";
import { CourseStatusBadge } from "./CourseStatusBadge";

export default function DataTableCourses() {
  const [filters, setFilters] = useState<PaginationFilters>({
    page: 1,
    limit: 10,
    order: 'DESC',
    orderBy: 'createdAt',
    search: '',
  });

  const { data: courses, isLoading, isError } = useCourses(filters);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const handlePageChange = (page: number) => setFilters({ ...filters, page });
  const navigate = useNavigate();
  const { user } = useAuth();

  const canAccess = user?.role !== USER_ROLES.STUDENT;

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

  if (isLoading) {
    return <SkeletonTable />
  }

  if (courses?.data.length === 0) {
    return (
      <Empty className="border bg-sidebar">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Book />
          </EmptyMedia>
          <EmptyTitle>Sin cursos</EmptyTitle>
          <EmptyDescription>
            No se han encontrado cursos disponibles.
          </EmptyDescription>
          {canAccess && (
            <Link to={ROUTES.CREATE_COURSE}><Button>Agregar curso</Button></Link>
          )}
        </EmptyHeader>
      </Empty>
    )
  }

  if (isError) {
    return <div className="flex justify-center items-center p-10">
      <AlertError title="Algo salió mal" description="Intentalo más tarde o ponte en contacto con soporte" />
    </div>
  }

  return (
    <>
      <div className="w-full flex flex-col xl:flex-row gap-3 justify-between items-center mb-4">
        <div className="w-full relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="buscar cursos..."
            className="w-full xl:w-100 pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {canAccess && (
          <div className="flex items-center gap-2">
            <Link to={ROUTES.CREATE_COURSE}><Button><PlusCircleIcon />Agregar</Button></Link>
            <Button variant="outline"><UploadIcon /> Importar</Button>
            <Button variant="outline"><DownloadIcon /> Exportar</Button>
          </div>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="group transition-colors hover:bg-muted/50">
              <TableHead className="w-full">Curso</TableHead>
              {canAccess && (
                <>
                  <TableHead className="w-32">Estado</TableHead>
                  <TableHead className="w-20 text-right">Acciones</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.data?.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <Link
                    to={ROUTES.COURSE_DETAIL(course.id)}
                    className="flex items-center gap-3 group"
                  >
                    <img
                      src={course.imageUrl || 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg'}
                      alt={course.name}
                      className="h-12 w-16 shrink-0 rounded-md border object-cover"
                    />

                    <div className="min-w-0">
                      <p className="font-medium truncate group-hover:underline">
                        {course.name}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {course.short_description}
                      </p>
                    </div>
                  </Link>
                </TableCell>
                {canAccess && (
                  <>
                    <TableCell>
                      <CourseStatusBadge status={course.status} />
                    </TableCell>
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
                            onClick={() => navigate(ROUTES.COURSE_DETAIL(course.id))}>
                            Ver curso
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(ROUTES.EDIT_COURSE(course.id))}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </>
                )}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {courses && courses.meta.totalPages >= 1 && (
        <Pagination className="w-full pt-2">
          <PaginationContent>

            <PaginationItem key={1}>
              <PaginationLink
                disabled={courses.links.prev === null}
                onClick={() => handlePageChange(1)}
              >
                <span className="sr-only">primera página</span>
                <ChevronsLeftIcon />
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                disabled={courses.links.prev === null}
                onClick={() => handlePageChange(filters.page! - 1)}
              >
                <span className="sr-only">anterior página</span>
                <ChevronLeftIcon />
              </PaginationLink>
            </PaginationItem>
            {/* Mostrar hasta 5 páginas */}
            {Array.from({ length: Math.min(5, courses.meta.totalPages) }, (_, i) => {
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
            {courses.meta.totalPages > 5 && (
              <>
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(courses.meta.totalPages)}
                  >
                    {courses.meta.totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationLink
                disabled={courses.links.next === null}
                onClick={() => handlePageChange(filters.page! + 1)}
              >
                <span className="sr-only">siguiente página</span>
                <ChevronRightIcon />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                disabled={courses.links.next === null}
                onClick={() => handlePageChange(courses.meta.totalPages)}
              >
                <span className="sr-only">última página</span>
                <ChevronsRightIcon />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}
