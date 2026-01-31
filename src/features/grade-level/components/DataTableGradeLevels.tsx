import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Loader2, PlusCircleIcon, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useCreateGradeLevel, useGradeLevels, useUpdateGradeLevel } from '@/features/grade-level/hooks/use-gradeLevels'
import { useAuth } from '@/shared/providers/AuthProvider'
import { USER_ROLES } from '@/shared/constants'
import EditGradeLevelModal from '@/features/grade-level/components/EditGradeLevelModal'
import CreateGradeLevelModal from '@/features/grade-level/components/CreateGradeLevelModal'
import type { GradeLevel } from '@/features/grade-level/types'
import type { PaginationFilters } from '@/shared/types'

const DataTableGradeLevels: React.FC = () => {
    const { isAuthenticated, user } = useAuth()
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('')

    const createGradeLevel = useCreateGradeLevel();
    const updateGradeLevel = useUpdateGradeLevel(); // Cambia esto a la mutación de actualización correspondiente

    // Custom hook para obtener los niveles de grado
    const [filters, setFilters] = useState<PaginationFilters>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        orderBy: 'DESC',
        search: ''
    })

    const { data, isLoading, isError } = useGradeLevels(filters);

    const handlePageChange = (page: number) => {
        setFilters({ ...filters, page });
    };

    // Estados para controlar los modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GradeLevel | null>(null);

    useEffect(() => {
    }, [])

    const createItem = async (newGradeLevel: Omit<GradeLevel, 'id'>) => {
        try {
            setLoading(true);
            await createGradeLevel.mutateAsync(newGradeLevel)
            setIsCreateModalOpen(false)
        } catch (error) {
            console.error('Error al crear el grado:', error)
        } finally {
            setLoading(false); // Detener carga
        }
    }

    const updateItem = async (updatedItem: GradeLevel) => {
        try {
            setLoading(true);
            await updateGradeLevel.mutateAsync(updatedItem);
            setIsUpdateModalOpen(false)
        } catch (error) {
            console.error('Error al actualizar el grado:', error)
        } finally {
            setLoading(false); // Detener carga
        }
    }

    const handleUpdateClick = (item: GradeLevel) => {
        setSelectedItem(item);
        setIsUpdateModalOpen(true);
    };

    const handleDeleteClick = (item: GradeLevel) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    return (
        <>
            <div className="flex pb-3 justify-between items-center">
                <div className='flex items-center gap-2'>
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input placeholder="buscar grado" className="w-[400px] pl-9"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setFilters({ ...filters, search: e.target.value, page: 1 });
                            }}
                        />
                    </div>
                </div>
                {isAuthenticated && (user?.role === USER_ROLES.ADMIN) && (
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setIsCreateModalOpen(true)} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cargando
                                </>
                            ) : (
                                <>
                                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                                    <span>Agregar</span>
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>F. creación</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.map((gradeLevel) => (
                        <TableRow key={gradeLevel.id}>
                            <TableCell>{gradeLevel.name}</TableCell>
                            <TableCell><Badge variant={gradeLevel.level ? 'default' : 'destructive'}>{gradeLevel.level}</Badge></TableCell>
                            <TableCell>
                                {new Date(gradeLevel.createdAt).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </TableCell>
                            <TableCell>
                                <Button variant="outline" className="mr-2"
                                    onClick={() => handleUpdateClick(gradeLevel)}
                                >
                                    Editar
                                </Button>
                                <Button variant="destructive"
                                    onClick={() => handleDeleteClick(gradeLevel)}
                                >
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={4}>
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-6 w-full" />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {isError && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-red-600">
                                Ha sucedido un error en el servidor.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <CreateGradeLevelModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={createItem}
                isLoading={loading}
            />

            {selectedItem && (
                <EditGradeLevelModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onUpdate={updateItem}
                    item={selectedItem}
                    isLoading={loading}
                />
            )}
        </>
    )
}

export default DataTableGradeLevels