import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stellar Wallet 💫',
  description: 'A modern Stellar wallet built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
