"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ScrollReveal, StaggerReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card } from "@/app/components/ui/card"
import Link from "next/link"
import { 
  Search, 
  Filter,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Loader2
} from "lucide-react"

// Mock courses data
const allCourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    provider: "Tech Academy Lagos",
    price: 150000,
    rating: 4.8,
    students: 1250,
    duration: "12 weeks",
    category: "technology",
    location: "Lagos",
    type: "Hybrid",
    image: null
  },
  {
    id: 2,
    title: "Digital Marketing Masterclass",
    provider: "Marketing Pro Institute",
    price: 85000,
    rating: 4.6,
    students: 890,
    duration: "8 weeks",
    category: "marketing",
    location: "Online",
    type: "Online",
    image: null
  },
  {
    id: 3,
    title: "Data Science with Python",
    provider: "Data School Nigeria",
    price: 200000,
    rating: 4.9,
    students: 750,
    duration: "16 weeks",
    category: "technology",
    location: "Abuja",
    type: "In-person",
    image: null
  },
  {
    id: 4,
    title: "UI/UX Design Fundamentals",
    provider: "Creative Hub Academy",
    price: 120000,
    rating: 4.7,
    students: 560,
    duration: "10 weeks",
    category: "design",
    location: "Lagos",
    type: "Hybrid",
    image: null
  },
  {
    id: 5,
    title: "Project Management Professional",
    provider: "PM Expert Institute",
    price: 180000,
    rating: 4.5,
    students: 430,
    duration: "6 weeks",
    category: "business",
    location: "Online",
    type: "Online",
    image: null
  }
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
]

const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "0-50000", label: "Under ₦50,000" },
  { value: "50000-100000", label: "₦50,000 - ₦100,000" },
  { value: "100000-200000", label: "₦100,000 - ₦200,000" },
  { value: "200000+", label: "Above ₦200,000" },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""
  
  const [query, setQuery] = useState(queryParam)
  const [results, setResults] = useState(allCourses)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    type: "all"
  })

  useEffect(() => {
    const search = async () => {
      setLoading(true)
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filtered = allCourses
      
      // Filter by search query
      if (query) {
        const q = query.toLowerCase()
        filtered = filtered.filter(course =>
          course.title.toLowerCase().includes(q) ||
          course.provider.toLowerCase().includes(q) ||
          course.category.toLowerCase().includes(q)
        )
      }
      
      // Filter by category
      if (filters.category !== "all") {
        filtered = filtered.filter(c => c.category === filters.category)
      }
      
      // Filter by course type
      if (filters.type !== "all") {
        filtered = filtered.filter(c => c.type.toLowerCase() === filters.type.toLowerCase())
      }
      
      // Filter by price range
      if (filters.priceRange !== "all") {
        const [min, max] = filters.priceRange.split("-").map(n => parseInt(n.replace("+", "")))
        filtered = filtered.filter(c => {
          if (filters.priceRange.includes("+")) return c.price >= min
          return c.price >= min && c.price <= max
        })
      }
      
      setResults(filtered)
      setLoading(false)
    }
    
    search()
  }, [query, filters])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="down" delay={0}>
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-4">
              Search Courses
            </h1>
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, providers, topics..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-white dark:bg-gray-800 text-foreground shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <BouncyButton
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </BouncyButton>
            </div>
          </div>
        </ScrollReveal>

        {/* Filters */}
        {showFilters && (
          <ScrollReveal direction="down" delay={50}>
            <Card className="p-4 mb-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Course Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="all">All Types</option>
                    <option value="online">Online</option>
                    <option value="in-person">In-person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        )}

        {/* Results Count */}
        <ScrollReveal direction="up" delay={100}>
          <p className="text-muted-foreground mb-4">
            {loading ? "Searching..." : `${results.length} courses found`}
            {query && ` for "${query}"`}
          </p>
        </ScrollReveal>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
          </div>
        ) : results.length === 0 ? (
          <ScrollReveal direction="up" delay={100}>
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <BouncyButton variant="outline" onClick={() => { setQuery(""); setFilters({ category: "all", priceRange: "all", type: "all" }) }}>
                Clear Filters
              </BouncyButton>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid gap-4">
            {results.map((course, index) => (
              <ScrollReveal key={course.id} direction="up" delay={100 + index * 50}>
                <Link href={`/courses/${course.id}`}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white/30">{course.title[0]}</span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-foreground text-lg mb-1">{course.title}</h3>
                            <p className="text-muted-foreground text-sm">{course.provider}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-indigo-600">{formatCurrency(course.price)}</p>
                            <p className="text-xs text-muted-foreground">or installments</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {course.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students} students
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {course.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
