"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/app/lib/utils"
import { Badge } from "@/app/components/ui/badge"
import {
  Home,
  BookOpen,
  LayoutDashboard,
  User,
  CreditCard,
  Settings,
  X,
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

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "sticky left-0 bg-card dark:bg-gray-800 border-r border-border dark:border-gray-700 transition-transform duration-300",
          "w-[280px] lg:w-[30%] max-w-[320px]",
          "top-[80px]",
          "self-start",
          "h-[calc(100vh-100px)]",
          "overflow-hidden",
          "lg:translate-x-0",
          "fixed lg:sticky",
          isOpen ? "translate-x-0 z-50" : "-translate-x-full z-30"
        )}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-muted dark:hover:bg-gray-700 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Navigation */}
        <nav className="h-full overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {session ? (
              // Show Dashboard menu when logged in
              <>
                {dashboardMenuItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm",
                        active
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:bg-muted dark:hover:bg-gray-700 hover:text-foreground"
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
              </>
            ) : (
              // Show only Home when NOT logged in
              <Link
                href="/"
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm",
                  pathname === "/"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted dark:hover:bg-gray-700 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Home className={cn("w-4 h-4 shrink-0", pathname === "/" && "scale-110")} />
                  <span className="font-medium truncate">Home</span>
                </div>
                <ChevronRight
                  className={cn(
                    "w-3 h-3 opacity-0 -translate-x-1 transition-all duration-200",
                    pathname === "/" && "opacity-100 translate-x-0"
                  )}
                />
              </Link>
            )}
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar