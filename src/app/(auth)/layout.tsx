import type { Metadata } from 'next'
import Image from 'next/image'
import { Grainient } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Pichanga Dashboard - Iniciar Sesión',
  description: 'Accede a tu panel de administración de canchas',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Professional Branding with Grainient */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        {/* Grainient Background - clean gradient with grain */}
        <div className="absolute inset-0">
          <Grainient
            color1="#1a7a3a" // Primary green darker (Pichanga)
            color2="#d45a2a" // Secondary orange darker (Pichanga)
            color3="#0f172a" // Dark base
            timeSpeed={0.15}
            colorBalance={0.0}
            warpStrength={0.1} // Minimal warp for clean look
            warpFrequency={1}
            warpSpeed={0.5}
            warpAmplitude={10}
            blendAngle={-30}
            blendSoftness={0.15}
            rotationAmount={50} // Low rotation
            noiseScale={0.5}
            grainAmount={0.08}
            grainScale={4}
            grainAnimated={false}
            contrast={1.0} // Less contrast
            gamma={1.0}
            saturation={0.8} // Less saturation - more muted
            zoom={1.0}
          />
        </div>

        {/* Dark overlay for text readability - more prominent */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex w-full flex-col items-center justify-center p-12">
          {/* Logo - Professional presentation */}
          <div className="mb-8">
            <Image
              src="/logo-pichanga.png"
              alt="Pichanga"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
              priority
            />
          </div>

          {/* Brand name */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">PICHANGA</h1>
            <p className="mt-1 text-sm text-white/70">Dashboard Profesional</p>
          </div>

          {/* Professional statement */}
          <div className="mb-12 max-w-md text-center">
            <p className="text-xl leading-relaxed text-white/90">
              La plataforma de gestión para complejos deportivos.
            </p>
            <p className="mt-4 text-sm text-white/60">
              Reservas, horarios, ingresos e inventario en un solo lugar.
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mb-12">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="mt-1 text-xs tracking-wider text-white/60 uppercase">Complejos</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">10k+</p>
                <p className="mt-1 text-xs tracking-wider text-white/60 uppercase">Reservas/mes</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">98%</p>
                <p className="mt-1 text-xs tracking-wider text-white/60 uppercase">Satisfacción</p>
              </div>
            </div>
          </div>

          {/* Feature pillars - Clean */}
          <div className="max-w-lg">
            <div className="grid grid-cols-4 gap-6">
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-white/70">Reservas</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <svg
                    className="h-5 w-5 text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-white/70">Horarios</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="text-xs text-white/70">Ingresos</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <svg
                    className="h-5 w-5 text-teal-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <span className="text-xs text-white/70">Inventario</span>
              </div>
            </div>
          </div>

          {/* Professional badge */}
          <div className="mt-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-white/80">Sistema 100% peruano</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="bg-background flex flex-1 items-center justify-center p-8">
        {/* Separator line */}
        <div className="bg-border absolute top-0 bottom-0 left-1/2 hidden w-px lg:block" />

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
