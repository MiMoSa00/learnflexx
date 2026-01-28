"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Menu, X, ChevronDown, Search, Moon, Sun, User, LogOut, Settings, LogIn, UserPlus } from "lucide-react"

const categories = [
  { name: "Digital Skills", href: "/courses?category=digital-skills" },
  { name: "Vocational", href: "/courses?category=vocational" },
  { name: "Creative Arts", href: "/courses?category=creative-arts" },
  { name: "Professional Development", href: "/courses?category=professional" },
  { name: "Business & Entrepreneurship", href: "/courses?category=business" },
]

interface HeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    } else {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    const html = document.documentElement
    html.classList.toggle('dark')
    setIsDark(!isDark)
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light')
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // Determine which hamburger to show
  const isHomePage = pathname === "/"
  const shouldShowSidebarHamburger = session && showMenuButton && onMenuClick
  const shouldHideMainHamburger = !session && isHomePage

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg py-2 sm:py-3"
          : "bg-transparent py-3 sm:py-5"
      )}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <nav className="flex items-center justify-between">
          {/* Left: Sidebar Hamburger (only when logged in) + Logo */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Sidebar Hamburger - Only shows when logged in */}
            {shouldShowSidebarHamburger && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-1 sm:p-1.5 hover:bg-muted rounded-lg transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </button>
            )}

            {/* Logo - Closer to left edge */}
            <Link href="/" className="flex items-center group -ml-2 sm:-ml-1">
              <div className="relative w-20 h-7 sm:w-28 sm:h-9 md:w-36 md:h-11 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/flexlogo.jpeg"
                  alt="LearnFlex Logo"
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 144px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors font-medium text-sm xl:text-base">
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link href={category.href} className="cursor-pointer">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/courses"
              className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm xl:text-base"
            >
              All Courses
            </Link>
            <Link
              href="/how-it-works"
              className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm xl:text-base"
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm xl:text-base"
            >
              About
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-9 w-9 xl:h-10 xl:w-10">
              <Search className="w-4 h-4 xl:w-5 xl:h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="hover:bg-primary/10 transition-colors duration-300 h-9 w-9 xl:h-10 xl:w-10"
            >
              {isDark ? <Sun className="w-4 h-4 xl:w-5 xl:h-5" /> : <Moon className="w-4 h-4 xl:w-5 xl:h-5" />}
            </Button>

            {/* Auth Section - Desktop */}
            {!mounted ? (
              <div className="w-20 h-10" />
            ) : status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-muted px-2 xl:px-3 py-2 rounded-lg transition-colors">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        className="w-7 h-7 xl:w-8 xl:h-8 rounded-full border-2 border-primary"
                      />
                    ) : (
                      <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="w-4 h-4 xl:w-5 xl:h-5 text-primary-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground hidden xl:inline max-w-[100px] truncate">
                      {session.user?.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground truncate">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold hover:bg-primary/10 text-sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="btn-bouncy font-semibold bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Section - User Icon + Hamburger */}
          <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
            {/* Mobile User Dropdown - Always visible */}
            {!mounted ? (
              <div className="w-8 h-8" />
            ) : status === "loading" ? (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-primary"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground truncate">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors">
                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">
                      <LogIn className="w-4 h-4 mr-2" />
                      Log in
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="cursor-pointer">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign up
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Hamburger Menu - Hidden on homepage when NOT logged in */}
            {!shouldHideMainHamburger && (
              <button
                className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Menu - Unified */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-[800px] opacity-100 mt-3 sm:mt-4" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-border">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {/* Navigation Links */}
              <Link
                href="/courses"
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-muted transition-colors font-medium text-sm sm:text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Courses
              </Link>
              
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-muted-foreground font-medium">
                Categories
              </div>
              
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 pl-6 sm:pl-8 rounded-lg sm:rounded-xl hover:bg-muted transition-colors text-xs sm:text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              
              <Link
                href="/how-it-works"
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-muted transition-colors font-medium text-sm sm:text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              
              <Link
                href="/about"
                className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-muted transition-colors font-medium text-sm sm:text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="border-t border-border my-1.5 sm:my-2" />
              
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-muted transition-colors font-medium flex items-center gap-2 justify-center text-sm sm:text-base"
              >
                {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}