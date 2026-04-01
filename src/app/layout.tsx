import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'Pichanga Dashboard',
    template: '%s | Pichanga Dashboard',
  },
  description:
    'Sistema de gestión para dueños de canchas de fútbol. Reservas, horarios, ingresos y más.',
  keywords: ['canchas', 'fútbol', 'reservas', 'gestión', 'Perú'],
  authors: [{ name: 'Pichanga Team' }],
  creator: 'Pichanga',
  metadataBase: new URL('https://pichanga.pe'),
  icons: {
    icon: [
      { url: '/logo-pichanga.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-pichanga.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/logo-pichanga.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://pichanga.pe',
    title: 'Pichanga Dashboard',
    description: 'Sistema de gestión para dueños de canchas de fútbol',
    siteName: 'Pichanga Dashboard',
    images: [
      {
        url: '/logo-pichanga.png',
        width: 512,
        height: 512,
        alt: 'Pichanga Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pichanga Dashboard',
    description: 'Sistema de gestión para dueños de canchas de fútbol',
    images: ['/logo-pichanga.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f3ef' },
    { media: '(prefers-color-scheme: dark)', color: '#050a08' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo-pichanga.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-pichanga.png" />
        {/* Script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('pichanga-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storageKey="pichanga-theme"
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              classNames: {
                toast: 'bg-card border-border text-foreground',
                title: 'font-medium',
                description: 'text-muted-foreground',
                success: 'border-primary',
                error: 'border-destructive',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
