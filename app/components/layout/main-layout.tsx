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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Check if user is logged in
  useEffect(() => {
    setMounted(true)
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [pathname]) // Re-check on route change

  // Pages that should NOT show header/footer/sidebar
  const authPages = ["/login", "/signup"]
  const isAuthPage = authPages.includes(pathname)

  // Auth pages - no layout
  if (isAuthPage) {
    return <>{children}</>
  }

  // Don't render sidebar until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={false}
        />
        <div className="flex flex-1 pt-14 sm:pt-16 md:pt-[72px]">
          <main className="flex-1 lg:ml-0 min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  // All other pages - show header, sidebar (only if logged in), and footer
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - fixed at top */}
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        showMenuButton={isLoggedIn} // Only show hamburger if logged in
      />

      {/* Content area with sidebar */}
      <div className="flex flex-1 pt-14 sm:pt-16 md:pt-[72px]"> 
        {/* Reduced spacing: pt-14 (56px) on mobile, pt-16 (64px) on sm, pt-[72px] on md+ */}
        
        {/* Sidebar - only render if user is logged in */}
        {isLoggedIn && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>

      {/* Footer - at bottom */}
      <Footer />
    </div>
  )
}