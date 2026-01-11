import type { Metadata } from 'next'
import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Robotics Updates 2026 - SHFMU Ismail Qemali',
  description: 'Website profesionale për përditësimet e robotikës, organizuar nga SHFMU Ismail Qemali, Prishtinë',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sq">
      <body>
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

