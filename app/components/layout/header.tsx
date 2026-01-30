"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
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
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check for logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
         // Get extra details if needed, or just use metadata
         setUser({
            name: session.user.user_metadata?.full_name || "User",
            email: session.user.email,
            image: session.user.user_metadata?.avatar_url,
         })
      } else {
         setUser(null)
      }
    }
    
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
         setUser({
            name: session.user.user_metadata?.full_name || "User",
            email: session.user.email,
            image: session.user.user_metadata?.avatar_url,
         })
      } else {
         setUser(null)
      }
    })

    return () => subscription.unsubscribe()

  }, [pathname])

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
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  // Determine which hamburger to show
  const isHomePage = pathname === "/"
  const shouldShowSidebarHamburger = user && showMenuButton && onMenuClick
  const shouldHideMainHamburger = !user && isHomePage

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg py-1.5 sm:py-2 md:py-2.5"
          : "bg-transparent py-2 sm:py-3 md:py-4"
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
              <div className="relative w-20 h-7 sm:w-24 sm:h-8 md:w-32 md:h-10 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/flexlogo.jpeg"
                  alt="LearnFlex Logo"
                  fill
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 128px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
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
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-8 w-8 xl:h-9 xl:w-9">
              <Search className="w-4 h-4 xl:w-5 xl:h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="hover:bg-primary/10 transition-colors duration-300 h-8 w-8 xl:h-9 xl:w-9"
            >
              {isDark ? <Sun className="w-4 h-4 xl:w-5 xl:h-5" /> : <Moon className="w-4 h-4 xl:w-5 xl:h-5" />}
            </Button>

            {/* Auth Section - Desktop */}
            {!mounted ? (
              <div className="w-20 h-9" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-muted px-2 xl:px-2.5 py-1.5 rounded-lg transition-colors">
                    {user.image ? (
                      <img 
                        src={user.image} 
                        alt={user.name || "User"} 
                        className="w-7 h-7 xl:w-8 xl:h-8 rounded-full border-2 border-primary"
                      />
                    ) : (
                      <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="w-4 h-4 xl:w-5 xl:h-5 text-primary-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground hidden xl:inline max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
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
                  <Button variant="ghost" size="sm" className="font-semibold hover:bg-primary/10 text-sm h-8 px-3">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="btn-bouncy font-semibold bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-8 px-3">
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
              <div className="w-7 h-7" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-0.5 sm:p-1 hover:bg-muted rounded-lg transition-colors">
                    {user.image ? (
                      <img 
                        src={user.image} 
                        alt={user.name || "User"} 
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
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
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
                  <button className="p-1 sm:p-1.5 hover:bg-muted rounded-lg transition-colors">
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
                className="p-1 sm:p-1.5 hover:bg-muted rounded-lg transition-colors"
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
            isMobileMenuOpen ? "max-h-[800px] opacity-100 mt-2 sm:mt-3" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-card rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-4 shadow-lg border border-border">
            <div className="flex flex-col gap-1 sm:gap-1.5">
              {/* Navigation Links */}
              <Link
                href="/courses"
                className="px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors font-medium text-sm sm:text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Courses
              </Link>
              
              <div className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-muted-foreground font-medium">
                Categories
              </div>
              
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 pl-5 sm:pl-6 md:pl-8 rounded-lg sm:rounded-xl hover:bg-muted transition-colors text-xs sm:text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              
              <Link
                href="/how-it-works"
                className="px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors font-medium text-sm sm:text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              
              <Link
                href="/about"
                className="px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors font-medium text-sm sm:text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="border-t border-border my-1 sm:my-1.5" />
              
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-muted transition-colors font-medium flex items-center gap-2 justify-center text-sm sm:text-base"
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