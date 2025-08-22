import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import AppHeader from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Workflow Execution Monitor',
  description: 'Monitor and trigger workflow executions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppHeader />
        <div className="w-full">
          <div className="w-full px-4">
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}