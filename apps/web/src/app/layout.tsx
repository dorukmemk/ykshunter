import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Learn Game - Eğlenerek Öğren',
  description: 'Gamification ile öğrenme deneyimi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  )
}
