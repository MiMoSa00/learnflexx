"use client"

import React from "react"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import { Slider } from "@/app/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { Checkbox } from "@/app/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Clock,
  Users,
  Star,
  MapPin,
  Monitor,
  X,
  CreditCard,
  ExternalLink,
  Eye,
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import {
  getUserCoursePurchases,
  getCourseButtonConfig,
  getStatusBadgeConfig,
  getPriceDisplayText,
  type CoursePurchase,
} from "@/app/lib/payment-status"

// Mock data
const courses = [
  {
    id: "1",
    title: "Full Stack Web Development Bootcamp",
    provider: "TechHub Academy",
    price: 200,
    originalPrice: null,
    duration: "12 weeks",
    mode: "Online",
    rating: 4.9,
    students: 1234,
    category: "Digital Skills",
    featured: true,
  },
  {
    id: "2",
    title: "Professional Photography Masterclass",
    provider: "Creative Vision Studios",
    price: 200,
    originalPrice: null,
    duration: "8 weeks",
    mode: "Hybrid",
    rating: 4.7,
    students: 856,
    location: "Lagos",
    category: "Creative Arts",
    featured: false,
  },
  {
    id: "3",
    title: "Digital Marketing & Social Media",
    provider: "Growth Academy",
    price: 200,
    originalPrice: null,
    duration: "6 weeks",
    mode: "Online",
    rating: 4.8,
    students: 2341,
    category: "Business",
    featured: true,
  },
  {
    id: "4",
    title: "UI/UX Design Fundamentals",
    provider: "Design Masters",
    price: 200,
    originalPrice: null,
    duration: "10 weeks",
    mode: "Online",
    rating: 4.6,
    students: 678,
    category: "Digital Skills",
    featured: false,
  },
  {
    id: "5",
    title: "Business Management Certificate",
    provider: "Executive Learning",
    price: 200,
    originalPrice: null,
    duration: "16 weeks",
    mode: "Offline",
    rating: 4.9,
    students: 432,
    location: "Abuja",
    category: "Business",
    featured: true,
  },
]

const categories = [
  "Digital Skills",
  "Creative Arts",
  "Business",
  "Professional Development",
  "Vocational",
  "Languages",
]

const modes = ["Online", "Offline", "Hybrid"]

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

interface FiltersState {
  search: string
  categories: string[]
  modes: string[]
  priceRange: [number, number]
  sortBy: string
}

function FiltersSidebar({
  filters,
  setFilters,
  onClear,
}: {
  filters: FiltersState
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>
  onClear: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    categories: checked
                      ? [...prev.categories, category]
                      : prev.categories.filter((c) => c !== category),
                  }))
                }}
              />
              <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div>
        <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3">Learning Mode</h3>
        <div className="space-y-2">
          {modes.map((mode) => (
            <label key={mode} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={filters.modes.includes(mode)}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    modes: checked
                      ? [...prev.modes, mode]
                      : prev.modes.filter((m) => m !== mode),
                  }))
                }}
              />
              <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {mode}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3">Price Range</h3>
        <Slider
          value={[filters.priceRange[0], filters.priceRange[1]]}
          onValueChange={(value: number[]) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: [value[0], value[1]] as [number, number],
            }))
          }
          min={0}
          max={500000}
          step={10000}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground gap-2">
          <span className="truncate">{formatPrice(filters.priceRange[0])}</span>
          <span className="truncate">{formatPrice(filters.priceRange[1])}</span>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={onClear}
        className="w-full py-2 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  )
}

function CourseCard({
  course,
  index,
  userPurchases,
  isLoggedIn,
}: {
  course: typeof courses[0]
  index: number
  userPurchases: Record<string, CoursePurchase>
  isLoggedIn: boolean
}) {
  // Get button configuration based on purchase status
  const buttonConfig = getCourseButtonConfig(userPurchases, course.id, isLoggedIn)
  const statusBadge = getStatusBadgeConfig(userPurchases, course.id, isLoggedIn)
  const priceDisplay = getPriceDisplayText(userPurchases, course.id, course.price, isLoggedIn)

  // Get button icon
  const ButtonIcon = buttonConfig.action === "access" 
    ? ExternalLink 
    : buttonConfig.action === "pay" 
    ? CreditCard 
    : Eye

  return (
    <ScrollReveal direction="up" delay={index * 50}>
      <div className="group bg-card rounded-xl sm:rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 sm:hover:-translate-y-2">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1 sm:gap-2 max-w-[60%]">
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px] sm:text-xs font-medium",
                course.mode === "Online" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                course.mode === "Offline" && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                course.mode === "Hybrid" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              )}
            >
              {course.mode}
            </Badge>
            {course.featured && (
              <Badge className="bg-primary text-primary-foreground text-[10px] sm:text-xs">
                Featured
              </Badge>
            )}
          </div>

          {/* Status Badge or Discount */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 max-w-[35%]">
            {statusBadge ? (
              <Badge className={cn("text-[10px] sm:text-xs truncate", statusBadge.className)}>
                {statusBadge.label}
              </Badge>
            ) : (
              course.originalPrice && (
                <Badge variant="destructive" className="text-[10px] sm:text-xs">
                  {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                </Badge>
              )
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5">
          <span className="text-[10px] sm:text-xs text-primary font-medium uppercase tracking-wider block truncate">
            {course.category}
          </span>

          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mt-1 mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug sm:leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
            {course.title}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 truncate">
            by {course.provider}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs">{course.students.toLocaleString()}</span>
            </div>
            {course.location && (
              <div className="flex items-center gap-1 max-w-[120px]">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate text-[10px] sm:text-xs">{course.location}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current flex-shrink-0" />
              <span className="font-semibold text-xs sm:text-sm text-foreground">{course.rating}</span>
            </div>
            <span className="text-muted-foreground text-[10px] sm:text-xs truncate">
              ({course.students})
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
            <div className="w-full sm:w-auto min-w-0">
              <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                <span className="text-base sm:text-lg md:text-xl font-bold text-foreground truncate max-w-full">
                  {priceDisplay.text}
                </span>
                {!isLoggedIn && course.originalPrice && (
                  <span className="text-xs sm:text-sm text-muted-foreground line-through truncate">
                    {formatPrice(course.originalPrice)}
                  </span>
                )}
              </div>
              {priceDisplay.subtext && (
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">
                  {priceDisplay.subtext}
                </p>
              )}
            </div>

            {buttonConfig.external ? (
              <a href={buttonConfig.href} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto shrink-0">
                <BouncyButton variant={buttonConfig.variant} size="sm" className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
                  <ButtonIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">{buttonConfig.text}</span>
                </BouncyButton>
              </a>
            ) : (
              <Link href={buttonConfig.href} className="w-full sm:w-auto shrink-0">
                <BouncyButton variant={buttonConfig.variant} size="sm" className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
                  <ButtonIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">{buttonConfig.text}</span>
                </BouncyButton>
              </Link>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

export default function CoursesPage() {
  const { data: session } = useSession()
  const [userPurchases, setUserPurchases] = useState<Record<string, CoursePurchase>>({})
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    categories: [],
    modes: [],
    priceRange: [0, 500000],
    sortBy: "popular",
  })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Fetch user purchases when logged in
  useEffect(() => {
    async function fetchPurchases() {
      if (session?.user?.id) {
        const purchases = await getUserCoursePurchases(session.user.id)
        setUserPurchases(purchases)
      } else {
        setUserPurchases({})
      }
    }
    fetchPurchases()
  }, [session])

  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      modes: [],
      priceRange: [0, 500000],
      sortBy: "popular",
    })
  }

  const filteredCourses = useMemo(() => {
    let result = [...courses]

    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(search) ||
          c.provider.toLowerCase().includes(search) ||
          c.category.toLowerCase().includes(search)
      )
    }

    if (filters.categories.length > 0) {
      result = result.filter((c) => filters.categories.includes(c.category))
    }

    if (filters.modes.length > 0) {
      result = result.filter((c) => filters.modes.includes(c.mode))
    }

    result = result.filter(
      (c) => c.price >= filters.priceRange[0] && c.price <= filters.priceRange[1]
    )

    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        result.sort((a, b) => Number(b.id) - Number(a.id))
        break
      case "popular":
      default:
        result.sort((a, b) => b.students - a.students)
        break
    }

    return result
  }, [filters])

  const activeFilterCount =
    filters.categories.length +
    filters.modes.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000 ? 1 : 0)

  return (
    <main className="flex-1 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1600px]">
        <ScrollReveal direction="up">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 leading-tight">
              Browse Courses
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Discover courses from verified training providers
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-11 pr-3"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="lg:hidden flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-muted rounded-lg text-xs sm:text-sm font-medium hover:bg-muted/80 transition-colors whitespace-nowrap flex-shrink-0">
                    <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <Badge className="text-[10px] sm:text-xs px-1.5 py-0.5">{activeFilterCount}</Badge>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-80 max-w-[320px]">
                  <SheetHeader>
                    <SheetTitle className="text-base sm:text-lg">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
                    <FiltersSidebar
                      filters={filters}
                      setFilters={setFilters}
                      onClear={clearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortBy: value }))
                }
              >
                <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] text-xs sm:text-sm h-10 sm:h-11 flex-shrink-0">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular" className="text-xs sm:text-sm">Most Popular</SelectItem>
                  <SelectItem value="newest" className="text-xs sm:text-sm">Newest</SelectItem>
                  <SelectItem value="price-low" className="text-xs sm:text-sm">Price: Low-High</SelectItem>
                  <SelectItem value="price-high" className="text-xs sm:text-sm">Price: High-Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1 flex-shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "grid"
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                  )}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "list"
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                  )}
                  aria-label="List view"
                >
                  <List className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {activeFilterCount > 0 && (
          <ScrollReveal direction="up" delay={150}>
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm text-muted-foreground shrink-0">Filters:</span>
              {filters.categories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors text-[10px] sm:text-xs max-w-[150px]"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      categories: prev.categories.filter((c) => c !== cat),
                    }))
                  }
                >
                  <span className="truncate">{cat}</span>
                  <X className="w-3 h-3 flex-shrink-0" />
                </Badge>
              ))}
              {filters.modes.map((mode) => (
                <Badge
                  key={mode}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors text-[10px] sm:text-xs"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      modes: prev.modes.filter((m) => m !== mode),
                    }))
                  }
                >
                  {mode}
                  <X className="w-3 h-3 flex-shrink-0" />
                </Badge>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs sm:text-sm text-primary hover:underline shrink-0"
              >
                Clear
              </button>
            </div>
          </ScrollReveal>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
            <ScrollReveal direction="left">
              <div className="sticky top-24 bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border max-h-[calc(100vh-7rem)] overflow-y-auto">
                <h2 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6">Filters</h2>
                <FiltersSidebar
                  filters={filters}
                  setFilters={setFilters}
                  onClear={clearFilters}
                />
              </div>
            </ScrollReveal>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'course' : 'courses'}
              </p>
            </div>

            {filteredCourses.length > 0 ? (
              <div
                className={cn(
                  "grid gap-4 sm:gap-5 md:gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {filteredCourses.map((course, index) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    userPurchases={userPurchases}
                    isLoggedIn={!!session}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  No courses found
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search terms
                </p>
                <BouncyButton onClick={clearFilters} variant="primary" className="text-sm sm:text-base">
                  Clear Filters
                </BouncyButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}