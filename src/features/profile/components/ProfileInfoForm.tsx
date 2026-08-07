// components/profile/ProfileInfoForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { ProfileDto } from '../types/profile.types';
import { useUpdateProfile } from '../hooks/useProfile';

const schema = z.object({
  firstName: z.string().min(1, 'Requerido').max(60),
  lastName: z.string().min(1, 'Requerido').max(60),
  biography: z.string().max(380).optional(),
});

export function ProfileInfoForm({ profile }: { profile: ProfileDto }) {
  const { mutate: update, isPending } = useUpdateProfile();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { firstName: profile.firstName, lastName: profile.lastName, biography: profile.biography ?? '' },
  });

  return (
    <form onSubmit={handleSubmit((data) => update(data))} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" {...register('firstName')} />
          {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" {...register('lastName')} />
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="biography">Biografía</Label>
        <Textarea id="biography" rows={3} {...register('biography')} />
        {errors.biography && <p className="text-sm text-red-600">{errors.biography.message}</p>}
      </div>
      <Button type="submit" disabled={!isDirty || isPending}>
        {isPending ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </form>
  );
}