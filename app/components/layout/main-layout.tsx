"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
import { Header } from "@/app/components/layout/header"
import { Footer } from "@/app/components/layout/footer"
import { Sidebar } from "@/app/components/layout/sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setIsLoggedIn(!!session)
      } catch {
        setIsLoggedIn(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [pathname])

  // Auth pages — no layout chrome
  const authPages = ["/login", "/signup"]
  if (authPages.includes(pathname)) {
    return <>{children}</>
  }

  // Mobile top padding: main row (56px) + optional dashboard strip (~48px on mobile)
  // On desktop (lg+): sidebar is sticky beside main content, only main row height
  const topPadding = "pt-[104px] sm:pt-[108px] lg:pt-[72px]"

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header — fixed, contains both the main nav row and the mobile dashboard strip */}
      <Header />

      {/* Body */}
      <div className={`flex flex-1 ${topPadding}`}>
        {/* Sidebar — desktop only (hidden on mobile via sidebar.tsx) */}
        {mounted && isLoggedIn && (
          <Sidebar />
        )}

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
}