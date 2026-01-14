import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Protocol',
  description: 'Exercise view component from Figma design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: '10px 10px 0 10px' }}>
          {children}
        </div>
      </body>
    </html>
  )
}

