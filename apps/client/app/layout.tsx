import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '../lib/query-client'
import { AccessibilityProvider } from '../components/ui/accessibility'
import { SkipLinks } from '../components/ui/skip-links'
import { RealTimeNotification, WebSocketStatus } from '../components/ui/RealTimeNotification'
import { OfflineIndicator, OfflineActionsIndicator } from '../components/ui/OfflineIndicator'
import { RealTimeProviders } from '../components/ui/RealTimeProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Peppermint - Modern Ticketing System',
  description: 'A modern, elegant ticketing system built with Next.js and Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased`} suppressHydrationWarning>
        <AccessibilityProvider>
          <QueryProvider>
            <SkipLinks />
            <RealTimeProviders>
              <main id="main-content" role="main">
                {children}
              </main>
            </RealTimeProviders>
          </QueryProvider>
        </AccessibilityProvider>
      </body>
    </html>
  )
} 