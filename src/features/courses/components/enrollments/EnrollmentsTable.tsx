import LoadingPage from '@/components/LoadingPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import EnrollmentForm from '@/features/courses/components/enrollments/EnrollmentForm'
import { useCourseAccess } from '@/features/courses/hooks/use-course-access'
import { useEnrollmentsByCourse } from '@/features/courses/hooks/use-enrollments'
import { ArrowUpDown, MoreHorizontal, PlusCircleIcon, Search } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { type ColumnDef, type ColumnFiltersState, type SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import type { Enrollment } from '@/features/courses/types/course.types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const columns: ColumnDef<Enrollment>[] = [
    {
        accessorFn: (row) => row.user.firstName,
        id: "estudiante",
        header: "Estudiante",
        cell: ({ row }) => {
            const { firstName, lastName } = row.original.user
            return <div>{`${firstName} ${lastName}`}</div>
        },
    },
    {
        accessorFn: (row) => row.user.email,
        id: "correo",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Correo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.original.user.email,
    },
    {
        accessorKey: "createdAt",
        header: "Fecha inscripción",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            return date.toLocaleString("es-ES", {
                dateStyle: "medium",
                timeStyle: "short",
            })
        }
    },
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => alert(`Enrollment ${enrollment.id}`)}
                        >
                            View
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const EnrollmentsTable = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) return null;
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const toggleModal = () => setModalOpen(true);
    const access = useCourseAccess(id);
    const canAdddEnrollment = access?.canEnrollUsers;
    const { data: enrollments = [], isLoading } = useEnrollmentsByCourse(id);
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

                {canAdddEnrollment && (
                    <Button onClick={toggleModal}><PlusCircleIcon /> Agregar</Button>
                )}

            </div>
            <div className='overflow-auto rounded-lg border shadow-sm'>
                <Table>
                    <TableHeader>
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