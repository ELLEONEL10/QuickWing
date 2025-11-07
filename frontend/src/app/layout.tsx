import { ReactNode } from 'react';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from 'src/components/header'   // ← Header from 'src/components/header';   // ← file not found
import { Footer } from "src/components/footer" 

import type React from "react"
import { ThemeProvider } from "src/components/theme-provider"
import "./globals.css"

const client = new QueryClient();

export const metadata = {
  title: "SkyWay - Book Flights with Ease",
  description: "Find and book the best flights at the lowest prices",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
