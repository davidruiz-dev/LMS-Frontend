import LoadingPage from '@/components/LoadingPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import EnrollmentForm from '@/features/courses/components/EnrollmentForm'
import { useCourseAccess } from '@/features/courses/hooks/use-course-access'
import { useEnrollmentsByCourse } from '@/features/courses/hooks/use-enrollments'
import { USER_ROLES } from '@/shared/constants'
import { useAuth } from '@/shared/providers/AuthProvider'
import { PlusCircleIcon, Search } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const EnrollmentsTable = () => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const toggleModal = () => setModalOpen(true);
    const { id } = useParams<{id: string}>();

    const { data: enrollments, isLoading }  = useEnrollmentsByCourse(id);
    const { user } = useAuth();

    const access = useCourseAccess(id!);

    if (isLoading) return (
        <LoadingPage message='cargando...'/>
    )

    const canAdddEnrollment = access?.canEnrollUsers;

    return (
        <>
            <div className='flex justify-between'>
                <div className="w-full relative">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="buscar usuarios"
                        className="w-full xl:w-[400px] pl-9"
                    />
                </div>
                {/* BUTTON ADD ENROLLMENT ABLE TO ADMIN AND INSTRUCTOR*/}

                {canAdddEnrollment && (
                    <Button onClick={toggleModal}><PlusCircleIcon/> Agregar</Button>
                )}
                  
            </div>
            <div className='border rounded-md'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead>F. Inscripción</TableHead>
                            {canAdddEnrollment && (<TableHead>Acciones</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {enrollments?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <div className='text-center'>sin estudiantes</div>
                                </TableCell>
                            </TableRow>
                        )}
                        {enrollments?.map((enrollment, index)=>( 
                            <TableRow key={index}>
                                <TableCell>{enrollment.user.firstName} {enrollment.user.lastName}</TableCell>
                                <TableCell>{enrollment.user.email}</TableCell>
                                <TableCell>{new Date(enrollment.createdAt).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}</TableCell>
                                {canAdddEnrollment && (
                                    <TableCell>acciones</TableCell>
                                )}
                            </TableRow>
                        ))}
                        
                    </TableBody>
                </Table>
            </div>

            {modalOpen && id && (
                <EnrollmentForm
                    isOpen={modalOpen}
                    onClose={()=>setModalOpen(false)}
                    courseId={id} 
                />
            )}
        </>
    )
}

export default EnrollmentsTable