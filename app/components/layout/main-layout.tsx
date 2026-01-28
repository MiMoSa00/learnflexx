"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/app/components/layout/header"
import { Footer } from "@/app/components/layout/footer"
import { Sidebar } from "@/app/components/layout/sidebar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Pages that should NOT show header/footer/sidebar
  const authPages = ["/login", "/signup"]
  const isAuthPage = authPages.includes(pathname)

  // Auth pages - no layout
  if (isAuthPage) {
    return <>{children}</>
  }

  // All other pages - show header, sidebar, and footer
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - fixed at top */}
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        showMenuButton={true}
      />

      {/* Content area with sidebar */}
      <div className="flex flex-1 pt-20"> {/* pt-20 for header space */}
        {/* Sidebar - scrolls with page on desktop */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content - shifts right on desktop */}
        <main className="flex-1 lg:ml-0 min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>

      {/* Footer - at bottom */}
      <Footer />
    </div>
  )
}