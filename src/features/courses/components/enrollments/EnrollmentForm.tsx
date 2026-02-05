import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCreateEnrollment } from '@/features/courses/hooks/use-enrollments'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import type { User } from "@/shared/types";
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { UsersService } from '@/features/users/services/userService'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { enrollmentSchema, type EnrollmentFormData } from '@/features/courses/schemas/enrollment.schema'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
}

const EnrollmentForm: FC<Props> = ({ isOpen, onClose, courseId }) => {
    const form = useForm<EnrollmentFormData>({
        resolver: zodResolver(enrollmentSchema),
        defaultValues: {
            userId: undefined,
            courseId: courseId
        },
        mode: 'onChange'
    });

    const [open, setOpen] = useState(false);
    const [students, setStudents] = useState<User[]>([]);
    const [search, setSearch] = useState('');

    // queries mutations
    const createEnrollment = useCreateEnrollment();

    const fetchStudents = async (search: string) => {
        const { data } = await UsersService.findStudentsByEmail(search || '');
        setStudents(data);
    }

    const onSubmit = async (values: EnrollmentFormData) => {
        try {
            const response = await createEnrollment.mutateAsync({ courseId: values.courseId, userId: values.userId });
            return response;
        } catch (error) {
            console.error('Error al guardar el enrollment:', error);
            throw error;
        }
    }

    useEffect(() => {
        fetchStudents(search);
    }, [search]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Inscribir usuario</DialogTitle>
                    <DialogDescription>Completa todos los campos requeridos para poder inscribir al usuario.</DialogDescription>

                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='userId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Usuario</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="justify-between"
                                                >
                                                    {(() => {
                                                        const user = students.find(user => user.id.toString() === field.value);
                                                        return user ? (user.firstName + ' ' + user.lastName) : "Selecciona un estudiante";
                                                    })()}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <div className="p-1.5">
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9 text-sm"
                                                        value={search}
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        placeholder="Escribe para buscar..."
                                                    />
                                                </div>

                                                {search.length === 0 && (
                                                    <div className="p-1.5 text-sm text-gray-400">Estudiantes recientes...</div>
                                                )}

                                                {students.length > 0 && (
                                                    <div className="space-y-1">
                                                        {students.map((user) => (
                                                            <div
                                                                key={user.id}
                                                                className={`p-1.5 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm flex items-center gap-1 ${field.value === user.id ? 'bg-gray-100 dark:bg-zinc-800' : 'bg-transparent'}`}
                                                                onClick={() => {
                                                                    field.onChange(user.id);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                {user.firstName + ' ' + user.lastName}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        field.value === user.id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {students.length === 0 && (
                                                    <div className="p-1.5 text-sm text-center">No hay opciones disponibles</div>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                            )}
                        />

                        <Button>Agregar</Button>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}

export default EnrollmentForm