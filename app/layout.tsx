import type { Metadata } from 'next'
import { Poppins, Hanken_Grotesk, Geist_Mono } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Odkrywaj wydarzenia',
  description: 'Przeglądaj popularne wydarzenia w pobliżu, wybieraj według kategorii lub zajrzyj do świetnych kalendarzy społeczności.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pl"
      className={cn("bg-background", poppins.variable, hankenGrotesk.variable, geistMono.variable)}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
