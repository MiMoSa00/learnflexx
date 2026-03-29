"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
import { cn } from "@/app/lib/utils"
import { Badge } from "@/app/components/ui/badge"
import {
  BookOpen,
  LayoutDashboard,
  User,
  CreditCard,
  Settings,
  ChevronRight,
} from "lucide-react"

const dashboardMenuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/my-courses",
    icon: BookOpen,
    badge: 5,
  },
  {
    title: "Payments",
    href: "/payment",
    icon: CreditCard,
    badge: 2,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

// Sidebar is desktop-only — on mobile the dashboard links live in the header nav strip
export function Sidebar() {
  const supabase = createClient()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href
    return pathname.startsWith(href)
  }

  if (!isLoggedIn) return null

  return (
    // hidden on mobile, sticky on desktop
    <aside className="hidden lg:block sticky top-[80px] w-[240px] xl:w-[280px] h-[calc(100vh-80px)] self-start bg-card border-r border-border overflow-hidden shrink-0">
      <nav className="h-full overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {dashboardMenuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm",
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform duration-200",
                      active && "scale-110"
                    )}
                  />
                  <span className="font-medium truncate">{item.title}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant={active ? "secondary" : "default"}
                      className={cn(
                        "h-5 min-w-5 px-1.5 text-xs",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight
                    className={cn(
                      "w-3 h-3 opacity-0 -translate-x-1 transition-all duration-200",
                      active && "opacity-100 translate-x-0"
                    )}
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}