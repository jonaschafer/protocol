import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Exercise View',
  description: 'Exercise view component from Figma design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

