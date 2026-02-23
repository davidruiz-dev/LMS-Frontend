import LoadingPage from '@/components/LoadingPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCourseAccess } from '@/features/courses/hooks/use-course-access'
import { useDeactivateEnrollment, useEnrollmentsByCourse } from '@/features/courses/hooks/use-enrollments'
import { ArrowUpDown, MoreHorizontal, PlusCircleIcon, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { type ColumnDef, type ColumnFiltersState, type SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import type { Enrollment } from '@/features/courses/enrollments/types/enrollment.types'
import EnrollmentForm from '@/features/courses/enrollments/components/EnrollmentForm'

const EnrollmentsTable = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) return null;
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const toggleModal = () => setModalOpen(prev => !prev);
    const access = useCourseAccess(id);
    const canAddEnrollment = access?.canEnrollUsers ?? false;
    const { data: enrollments = [], isLoading } = useEnrollmentsByCourse(id);
    const deactivateEnrollment = useDeactivateEnrollment();

    const handleDeactivateEnrollment = (id: string) => {
        if (window.confirm('¿Deseas cancelar esta inscripción?')) {
            deactivateEnrollment.mutate(id)
        }
    }

    const columns = useMemo<ColumnDef<Enrollment>[]>(() => {
        return [
            {
                accessorFn: (row) => row.user.firstName,
                id: "estudiante",
                header: "Estudiante",
                cell: ({ row }) => {
                    const { firstName, lastName } = row.original.user;
                    return <div>{`${firstName} ${lastName}`}</div>;
                },
            },
            {
                accessorFn: (row) => row.user.email,
                id: "correo",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Correo
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => row.original.user.email,
            },
            {
                accessorKey: "createdAt",
                header: "Fecha inscripción",
                cell: ({ row }) => {
                    const date = new Date(row.original.createdAt);
                    return date.toLocaleString("es-ES", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    });
                },
            },
            ...(canAddEnrollment
                ? [
                    {
                        id: "status",
                        header: "Estado",
                        cell: ({ row }) => {
                            const status = row.original.status;
                            return <Badge variant={status == 'inactive' ? 'destructive' : 'default'}>{status}</Badge>;
                        },
                    } satisfies ColumnDef<Enrollment>,
                    {
                        id: "actions",
                        cell: ({ row }) => {
                            const enrollment = row.original;
                            return (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {enrollment.status !== 'inactive' && (
                                            <DropdownMenuItem variant='destructive'
                                                onClick={() => handleDeactivateEnrollment(enrollment.id)}>
                                                Cancelar
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem>
                                            Ver más
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            );
                        },
                    } satisfies ColumnDef<Enrollment>,

                ]
                : []),
        ];
    }, [canAddEnrollment]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        getFilteredRowModel: getFilteredRowModel(),
        data: enrollments,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    if (isLoading) return (
        <LoadingPage message='cargando...' />
    )

    return (
        <>
            <div className='flex justify-between w-full'>
                <div className="relative w-1/3">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        value={(table.getColumn("correo")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("correo")?.setFilterValue(event.target.value)
                        }
                        placeholder="buscar usuarios"
                        className="pl-8"
                    />
                </div>

                {canAddEnrollment && (
                    <Button onClick={toggleModal}><PlusCircleIcon /> Inscribir usuario</Button>
                )}

            </div>
            <div className='overflow-auto rounded border shadow-sm'>
                <Table>
                    <TableHeader className='bg-secondary'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sin resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {modalOpen && id && (
                <EnrollmentForm
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    courseId={id}
                />
            )}
        </>
    )
}

export default EnrollmentsTable