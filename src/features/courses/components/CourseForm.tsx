import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from "react-router-dom";
import { useCourse, useCreateCourse, useUpdateCourse } from "@/features/courses/hooks/use-courses";
import { GradeLevelService } from "@/features/grade-level/services/gradeLevelService";
import type { GradeLevel } from "@/features/grade-level/types";
import { ROUTES } from "@/shared/constants/routes";
import type { User } from "@/shared/types";
import { UsersService } from "@/features/users/services/userService";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COURSE_STATUS } from "@/shared/constants";
import { courseSchema, type CourseFormData } from "@/features/courses/schemas/course.schema";

interface Props {
    courseId?: string;
}

function FormCourse({ courseId }: Props) {
    const isEditMode = !!courseId;
    const navigate = useNavigate();

    const form = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            name: '',
            description: '',
            short_description: '',
            gradeLevelId: undefined,
            instructorId: undefined,
            startDate: undefined,
            endDate: undefined,
            status: COURSE_STATUS.DRAFT,
        },
        mode: 'onChange'
    });

    const [listGradeLevels, setListGradeLevels] = useState<GradeLevel[]>([]);
    const [instructors, setInstructors] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [searchInstructor, setSearchInstructor] = useState('');
    const [open, setOpen] = useState(false);
    const [openPopOverInstructor, setOpenPopOverInstructor] = useState(false);
    const [imagenFile, setImagenFile] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Queries y Mutations
    const createCourse = useCreateCourse();
    const updateCourse = useUpdateCourse();

    // Query para obtener el curso en modo edición
    const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId!);

    const loadGradeLevels = async (query?: string) => {
        try {
            const response = await GradeLevelService.findByName(query || "");
            setListGradeLevels(response.data);
        } catch (error) {
            console.error('Error al cargar los niveles de grado:', error);
        }
    };

    const loadInstructors = async (email?: string) => {
        try {
            const response = await UsersService.findInstructorsByEmail(email || '');
            setInstructors(response);
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        loadGradeLevels(search);
        loadInstructors(searchInstructor);
    }, [search, searchInstructor]);

    // Cargar datos del curso cuando se obtienen (modo edición)
    useEffect(() => {
        if (courseData && isEditMode) {
            form.reset({
                name: courseData.name || '',
                description: courseData.description || '',
                short_description: courseData.short_description || '',
                gradeLevelId: courseData.gradeLevel.id || '',
                instructorId: courseData?.instructor.id || '',
                startDate: courseData.startDate ? new Date(courseData.startDate) : undefined,
                endDate: courseData.endDate ? new Date(courseData.endDate) : undefined,
                status: courseData.status,
            });
            // Cargar imagen existente si hay
            if (courseData.imageUrl) {
                setImagePreview(courseData.imageUrl);
            }
        }
    }, [courseData, isEditMode, form]);

    // Manejar cambio de imagen
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagenFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: CourseFormData) => {
        try {
            if (isEditMode) {
                // Actualizar curso existente
                await updateCourse.mutateAsync({
                    course: values,
                    id: courseId,
                    image: imagenFile // Enviar nueva imagen solo si se seleccionó
                });
                navigate(ROUTES.COURSES);
            } else {
                // Crear nuevo curso
                await createCourse.mutateAsync({
                    course: values,
                    image: imagenFile || undefined
                });
                navigate(ROUTES.COURSES);
            }
        } catch (error) {
            console.error('Error al guardar el curso:', error);
        }
    };

    // Mostrar loading mientras carga el curso en modo edición
    if (isEditMode && isLoadingCourse) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3">Cargando curso...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const isPending = createCourse.isPending || updateCourse.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isEditMode ? 'Editar curso' : 'Agregar nuevo curso'}
                        </CardTitle>
                        <CardDescription>
                            {isEditMode
                                ? 'Modifica los campos necesarios del curso.'
                                : 'Completa todos los campos del formulario.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-12 gap-4">
                            {/* first column */}
                            <div className="col-span-12 xl:col-span-7 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Editor
                                                    apiKey='irfl7e6itq24e0fw7uevozwv6xgg8awfczpd11lto0vc22o3'
                                                    init={{
                                                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                                        fixed_toolbar_container: false,
                                                        toolbar_mode: "sliding",
                                                        ui_mode: "split",
                                                    }}
                                                    value={field.value}
                                                    onEditorChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="short_description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción corta</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="gradeLevelId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nivel de grado</FormLabel>
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
                                                                    const grado = listGradeLevels.find(grado => grado.id.toString() === field.value);
                                                                    return grado ? (grado.name + ' - ' + grado.level) : "Selecciona un grado";
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
                                                                <div className="p-1.5 text-sm text-gray-400">Grados recientes...</div>
                                                            )}

                                                            {listGradeLevels.length > 0 && (
                                                                <div className="space-y-1">
                                                                    {listGradeLevels.map((grado) => (
                                                                        <div
                                                                            key={grado.id}
                                                                            className={`p-1.5 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm flex items-center gap-1 ${field.value === grado.id.toString() ? 'bg-gray-100 dark:bg-zinc-800' : 'bg-transparent'}`}
                                                                            onClick={() => {
                                                                                field.onChange(grado.id.toString());
                                                                                setOpen(false);
                                                                            }}
                                                                        >
                                                                            {grado.name + ' - ' + grado.level}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto h-4 w-4",
                                                                                    field.value === grado.id.toString() ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {listGradeLevels.length === 0 && (
                                                                <div className="p-1.5 text-sm text-center">No hay opciones disponibles</div>
                                                            )}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="instructorId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Instructor</FormLabel>
                                                <Popover open={openPopOverInstructor} onOpenChange={setOpenPopOverInstructor}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                aria-expanded={openPopOverInstructor}
                                                                className="justify-between"
                                                            >
                                                                {(() => {
                                                                    const instructor = instructors.find(instructor => instructor.id === field.value);
                                                                    return instructor ? (instructor.firstName + ' ' + instructor.lastName) : "Selecciona un instructor";
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
                                                                    value={searchInstructor}
                                                                    onChange={(e) => setSearchInstructor(e.target.value)}
                                                                    placeholder="Escribe para buscar..."
                                                                />
                                                            </div>

                                                            {searchInstructor.length === 0 && (
                                                                <div className="p-1.5 text-sm text-gray-400">Instructores recientes...</div>
                                                            )}

                                                            {instructors.length > 0 && (
                                                                <div className="space-y-1">
                                                                    {instructors.map((instructor) => (
                                                                        <div
                                                                            key={instructor.id}
                                                                            className={`p-1.5 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm flex items-center gap-1 ${field.value === instructor.id ? 'bg-gray-100 dark:bg-zinc-800' : 'bg-transparent'}`}
                                                                            onClick={() => {
                                                                                field.onChange(instructor.id);
                                                                                setOpenPopOverInstructor(false);
                                                                            }}
                                                                        >
                                                                            {instructor.firstName + ' ' + instructor.lastName}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto h-4 w-4",
                                                                                    field.value === instructor.id ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {instructors.length === 0 && (
                                                                <div className="p-1.5 text-sm text-center">No hay opciones disponibles</div>
                                                            )}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fecha inicio</FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        date={field.value}
                                                        setDate={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fecha fin</FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        date={field.value}
                                                        setDate={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* second column - imagen */}
                            <div className="col-span-12 xl:col-span-5 space-y-2">
                                <FormLabel>Imagen del Curso</FormLabel>

                                {imagePreview ? (
                                    <div className="relative w-full rounded-md overflow-hidden border border-gray-200">
                                        <img
                                            src={imagePreview}
                                            alt="Vista previa"
                                            loading="lazy"
                                            className="w-full object-cover max-h-64"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full rounded-md overflow-hidden border border-gray-200">
                                        <img
                                            src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s'}
                                            alt="Vista previa"
                                            className="w-full object-cover max-h-64"
                                        />
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="cursor-pointer"
                                />
                                {isEditMode && !imagenFile && (
                                    <p className="text-xs text-muted-foreground">
                                        Deja vacío para mantener la imagen actual
                                    </p>
                                )}


                                {isEditMode && (
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estado del curso</FormLabel>
                                                <FormControl>
                                                    <Select {...field} onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="selecciona" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={COURSE_STATUS.DRAFT}>{COURSE_STATUS.DRAFT}</SelectItem>
                                                            <SelectItem value={COURSE_STATUS.ARCHIVED}>{COURSE_STATUS.ARCHIVED}</SelectItem>
                                                            <SelectItem value={COURSE_STATUS.PUBLISHED}>{COURSE_STATUS.PUBLISHED}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button
                            type="submit"
                            disabled={isPending || !form.formState.isValid}
                        >
                            {isPending
                                ? (isEditMode ? "Actualizando..." : "Creando...")
                                : (isEditMode ? "Actualizar Curso" : "Crear Curso")
                            }
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(ROUTES.COURSES)}
                        >
                            Cancelar
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}

export default FormCourse;