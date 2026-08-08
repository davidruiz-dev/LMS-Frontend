import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginFormData } from '@/features/auth/validations/validations'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuthContext'

export const LoginForm: React.FC = () => {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const changeIsVisible = () => setIsVisible(prev => !prev);
  const onSubmit = (data: LoginFormData) => login(data);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Bienvenido</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className='relative'>
                <Input
                  id="password"
                  type={!isVisible ? 'password' : 'text'}
                  placeholder="••••••"
                  {...register('password')}
                />
                <button type='button' onClick={changeIsVisible} className='p-2 cursor-pointer'>
                  {!isVisible ? <Eye className='absolute right-1 top-2 size-5 text-muted-foreground' /> : 
                  <EyeOff className='absolute right-1 top-2 size-5 text-muted-foreground' />}
                </button>
                
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>


            <Button type="submit" className="w-full" disabled={!isValid}>
              {isLoading ? 'cargando...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}