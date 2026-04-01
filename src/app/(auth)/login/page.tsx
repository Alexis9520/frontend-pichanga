'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Button, Input, Label, Checkbox, Badge } from '@/components/ui'
import { useAuthStore } from '@/stores'
import { findDemoUser, demoUsers } from '@/lib/demo-users'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [showDemoUsers, setShowDemoUsers] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const rememberMe = watch('rememberMe')

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setLoginError(null)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find demo user
    const user = findDemoUser(data.email, data.password)

    if (!user) {
      setIsLoading(false)
      setLoginError('Credenciales incorrectas. Verifica tu email y contraseña.')
      toast.error('Credenciales incorrectas')
      return
    }

    // Login successful
    login(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      `demo-token-${user.id}`
    )

    toast.success(`¡Bienvenido, ${user.fullName}!`)
    setIsLoading(false)
    router.push('/dashboard')
  }

  const fillCredentials = (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
    setShowDemoUsers(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Bienvenido de vuelta</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Ingresa tus credenciales para acceder al dashboard
        </p>
      </div>

      {/* Error Alert */}
      {loginError && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-lg border p-4 duration-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{loginError}</p>
        </div>
      )}

      {/* Login Card */}
      <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                href="/forgot-password"
                className="text-primary text-sm font-medium hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <Checkbox
              id="rememberMe"
              label="Recordarme"
              checked={rememberMe}
              {...register('rememberMe')}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="border-border w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card text-muted-foreground px-2">O continúa con</span>
          </div>
        </div>

        {/* Google Button */}
        <Button variant="outline" className="w-full gap-3" type="button">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continuar con Google</span>
        </Button>

        {/* Demo Users - Collapsible */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowDemoUsers(!showDemoUsers)}
            className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between text-sm transition-colors"
          >
            <span className="flex items-center gap-2">
              <AlertCircle className="text-primary h-4 w-4" />
              Usuarios demo (para pruebas)
            </span>
            {showDemoUsers ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showDemoUsers && (
            <div className="animate-in fade-in slide-in-from-top-2 mt-4 space-y-2 duration-200">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => fillCredentials(user.email, user.password)}
                  className="border-border bg-background hover:border-primary hover:bg-primary/5 flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                      <span className="text-primary text-xs font-bold">
                        {user.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-muted-foreground text-xs">
                        {user.venueName || 'Administrador'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'success'} size="sm">
                    {user.role === 'admin' ? 'Admin' : 'Dueño'}
                  </Badge>
                </button>
              ))}

              <p className="text-muted-foreground pt-2 text-center text-xs">
                Password: <span className="bg-muted rounded px-1.5 py-0.5 font-mono">demo123</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
