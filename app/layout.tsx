import React from "react"
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from './providers'
import { MainLayout } from './components/layout/main-layout'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap'
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'Learn Flex - Discover Courses, Unlock Potential',
  description: 'Find and enroll in the best courses with flexible payment options. From digital skills to professional development, Learn Flex connects you with verified training providers.',
  generator: 'Learn Flex',
  keywords: ['online courses', 'learning platform', 'education', 'professional development', 'digital skills', 'training providers'],
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

export const viewport: Viewport = {
  themeColor: '#3F51B5',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakarta.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}