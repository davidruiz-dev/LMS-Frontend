import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GradeLevel } from "@/features/grade-level/types";
import { useForm } from 'react-hook-form';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: Omit<GradeLevel, 'id'>) => void;
    isLoading: boolean;
}
const CreateGradeLevelModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onCreate, isLoading }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<GradeLevel, 'id'>>();
    const onSubmit = (data: Omit<GradeLevel, 'id'>) => {
        onCreate(data);
        reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Grado</DialogTitle>
                    <DialogDescription>
                        Haga clic en Guardar cuando haya terminado.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="name" className="text-right">Nombre</Label>
                            <Input id="name" {...register('name', { required: 'Nombre es requerido' })} />
                            {errors.name && <small className="text-red-600">{errors.name.message}</small>}
                        </div>
                        <div>
                            <Label htmlFor="level" className="text-right">Nivel</Label>
                            <select 
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                id="level" {...register('level', { required: 'Nivel es requerido' })}>
                                <option value="primaria">Primaria</option>
                                <option value="secundaria">Secundaria</option>
                            </select>
                            {errors.level && <small className="text-red-600">{errors.level.message}</small>}
                        </div>
                        <div>
                            <Label htmlFor="description" className="text-right">Descripción</Label>
                            <Textarea id="description" {...register('description')} ></Textarea>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Cargando...' : 'Guardar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateGradeLevelModal