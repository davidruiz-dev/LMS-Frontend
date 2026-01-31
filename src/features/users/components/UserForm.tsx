import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateUser, useUser } from "@/features/users/hooks/use-users"
import { userSchema, type UserFormData } from "@/features/users/schemas"
import { USER_ROLES } from "@/shared/constants"
import { ROUTES } from "@/shared/constants/routes"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, type FC } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

interface Props {
    userId?: string;
}

const UserForm: FC<Props> = ({ userId }) => {
    const isEditMode = !!userId;
    const form = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: "student",
            isActive: true,
        },
        mode: "onChange",
    });
    const createUser = useCreateUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: UserFormData) => {
        setIsSubmitting(true);
        try {
            await createUser.mutateAsync(data);
            navigate(ROUTES.USERS);
        } catch (error) {
            console.error('Error al guardar el usuario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const { data: userData, isLoading: iLoadingUser } = useUser(userId!);


    useEffect(()=>{
        if(userData){
            form.reset({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role,
                password: ''
            })
            console.log(userData)
        }
    }, [userData, userId]);

    if (isEditMode && iLoadingUser) {
            return (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-center items-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-3">Cargando usuario...</span>
                        </div>
                    </CardContent>
                </Card>
            );
        }

    return (
        <div className='bg-background space-y-6'>
            <div>
                <h1 className='text-2xl font-semibold'>{isEditMode ? 'Editar Usuario' : 'Agregar Usuario'}</h1>
                <p className="text-gray-500 font-light">Completar todos los campos del formulario.</p>
            </div>
            <div className="max-w-2xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="nombre" autoFocus {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellido</FormLabel>
                                    <FormControl>
                                        <Input placeholder="apellido" {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="correo electónico" {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input placeholder="******" {...field} type="password" />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rol</FormLabel>
                                    <FormControl>
                                        <Select {...field} onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={USER_ROLES.STUDENT}>Estudiante</SelectItem>
                                                <SelectItem value={USER_ROLES.INSTRUCTOR}>Instructor</SelectItem>
                                                <SelectItem value={USER_ROLES.ADMIN}>Administrador</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4">
                            <Button type="button" variant={"outline"} onClick={() => navigate(ROUTES.USERS)} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={!form.formState.isValid || isSubmitting}>
                                {isSubmitting ? 'cargando...' : 'Guardar'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default UserForm