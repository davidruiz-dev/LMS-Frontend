import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { DialogDescription } from '@radix-ui/react-dialog';
import type { GradeLevel } from '@/features/grade-level/types';

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (data: GradeLevel) => void;
    item: GradeLevel;
    isLoading: boolean;
}
const EditGradeLevelModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, onUpdate, item, isLoading }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<GradeLevel>({
        defaultValues: item
    });

    useEffect(() => {
        if (item) {
            reset(item);
        }
    }, [item, reset]);

    const onSubmit = (data: GradeLevel) => {
        onUpdate(data);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Actualizar Grado</DialogTitle>
                        <DialogDescription>
                            Actualiza los datos del grado.
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
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Procesando
                                    </>
                                ) : (
                                    'Actualizar'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditGradeLevelModal