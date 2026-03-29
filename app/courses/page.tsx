"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card } from "@/app/components/ui/card"
import { 
  BookOpen,
  Code,
  Wrench,
  Palette,
  Briefcase,
  LineChart,
  Star,
  Users,
  Clock,
  Search,
  Loader2,
  SlidersHorizontal,
  X,
  ChevronDown
} from "lucide-react"

const categories = [
  { name: "All", slug: "all", icon: BookOpen, color: "from-indigo-500 to-purple-600", count: 120 },
  { name: "Digital Skills", slug: "digital-skills", icon: Code, color: "from-blue-500 to-indigo-600", count: 35 },
  { name: "Vocational", slug: "vocational", icon: Wrench, color: "from-orange-500 to-amber-600", count: 28 },
  { name: "Creative Arts", slug: "creative-arts", icon: Palette, color: "from-pink-500 to-rose-600", count: 22 },
  { name: "Professional", slug: "professional", icon: Briefcase, color: "from-purple-500 to-violet-600", count: 18 },
  { name: "Business", slug: "business", icon: LineChart, color: "from-emerald-500 to-teal-600", count: 17 },
]

const allCourses = [
  // Digital Skills (8 courses)
  { id: 1, title: "Full Stack Web Development Bootcamp", provider: "TechHub Academy", price: 150000, rating: 4.9, students: 1234, duration: "12 weeks", type: "Hybrid", category: "digital-skills" },
  { id: 2, title: "React & Next.js Masterclass", provider: "Code Academy Nigeria", price: 85000, rating: 4.8, students: 890, duration: "8 weeks", type: "Online", category: "digital-skills" },
  { id: 3, title: "Data Science with Python", provider: "Data School NG", price: 200000, rating: 4.9, students: 750, duration: "16 weeks", type: "In-person", category: "digital-skills" },
  { id: 4, title: "Mobile App Development", provider: "AppDev Nigeria", price: 175000, rating: 4.7, students: 620, duration: "14 weeks", type: "Hybrid", category: "digital-skills" },
  { id: 5, title: "Cloud Architecture (AWS)", provider: "Cloud Masters NG", price: 220000, rating: 4.8, students: 430, duration: "10 weeks", type: "Online", category: "digital-skills" },
  { id: 6, title: "Cybersecurity Fundamentals", provider: "SecureTech Academy", price: 180000, rating: 4.6, students: 380, duration: "12 weeks", type: "Hybrid", category: "digital-skills" },
  { id: 7, title: "UI/UX Design Bootcamp", provider: "Design Studio NG", price: 140000, rating: 4.9, students: 920, duration: "10 weeks", type: "Online", category: "digital-skills" },
  { id: 8, title: "DevOps & CI/CD Pipeline", provider: "Tech Ops Academy", price: 195000, rating: 4.7, students: 340, duration: "12 weeks", type: "Online", category: "digital-skills" },
  
  // Vocational (6 courses)
  { id: 10, title: "Certified Electrical Installation", provider: "Trade Skills Academy", price: 120000, rating: 4.8, students: 890, duration: "10 weeks", type: "In-person", category: "vocational" },
  { id: 11, title: "Automotive Mechanics Masterclass", provider: "AutoTech Institute", price: 180000, rating: 4.9, students: 750, duration: "16 weeks", type: "Hybrid", category: "vocational" },
  { id: 12, title: "Fashion Design & Tailoring", provider: "Style Academy NG", price: 150000, rating: 4.9, students: 1100, duration: "12 weeks", type: "Hybrid", category: "vocational" },
  { id: 13, title: "Plumbing & Pipe Fitting", provider: "BuildRight Training", price: 95000, rating: 4.7, students: 620, duration: "8 weeks", type: "In-person", category: "vocational" },
  { id: 14, title: "HVAC Installation & Repair", provider: "CoolTech Academy", price: 140000, rating: 4.6, students: 480, duration: "10 weeks", type: "In-person", category: "vocational" },
  { id: 15, title: "Welding & Fabrication", provider: "MetalWorks Institute", price: 110000, rating: 4.8, students: 560, duration: "8 weeks", type: "In-person", category: "vocational" },
  
  // Creative Arts (6 courses)
  { id: 20, title: "Professional Photography Masterclass", provider: "Creative Eye Studio", price: 130000, rating: 4.9, students: 980, duration: "10 weeks", type: "Hybrid", category: "creative-arts" },
  { id: 21, title: "Graphic Design with Adobe Suite", provider: "Design Academy NG", price: 110000, rating: 4.8, students: 1450, duration: "12 weeks", type: "Online", category: "creative-arts" },
  { id: 22, title: "Video Production & Editing", provider: "FilmCraft Nigeria", price: 160000, rating: 4.9, students: 720, duration: "14 weeks", type: "Hybrid", category: "creative-arts" },
  { id: 23, title: "Music Production Fundamentals", provider: "SoundWave Academy", price: 140000, rating: 4.7, students: 560, duration: "10 weeks", type: "In-person", category: "creative-arts" },
  { id: 24, title: "Digital Illustration & Art", provider: "ArtSpace Studio", price: 95000, rating: 4.8, students: 840, duration: "8 weeks", type: "Online", category: "creative-arts" },
  { id: 25, title: "3D Animation with Blender", provider: "Motion Graphics NG", price: 175000, rating: 4.6, students: 390, duration: "16 weeks", type: "Online", category: "creative-arts" },
  
  // Professional (6 courses)
  { id: 30, title: "Leadership & Team Management", provider: "Executive Academy NG", price: 250000, rating: 4.9, students: 1100, duration: "12 weeks", type: "Hybrid", category: "professional" },
  { id: 31, title: "Project Management Professional (PMP)", provider: "PM Institute Nigeria", price: 350000, rating: 4.9, students: 890, duration: "16 weeks", type: "Online", category: "professional" },
  { id: 32, title: "Business Communication Mastery", provider: "CommsPro Academy", price: 120000, rating: 4.8, students: 760, duration: "8 weeks", type: "Online", category: "professional" },
  { id: 33, title: "Strategic HR Management", provider: "HR Excellence NG", price: 180000, rating: 4.7, students: 540, duration: "10 weeks", type: "Hybrid", category: "professional" },
  { id: 34, title: "Data Analytics for Managers", provider: "Analytics Hub", price: 200000, rating: 4.8, students: 620, duration: "12 weeks", type: "Online", category: "professional" },
  { id: 35, title: "Executive Coaching Certification", provider: "Coach Academy Africa", price: 400000, rating: 4.9, students: 320, duration: "20 weeks", type: "In-person", category: "professional" },
  
  // Business (6 courses)
  { id: 40, title: "Start Your Business: Complete Guide", provider: "Entrepreneur Hub NG", price: 150000, rating: 4.9, students: 2100, duration: "12 weeks", type: "Hybrid", category: "business" },
  { id: 41, title: "Digital Marketing Masterclass", provider: "MarketPro Academy", price: 130000, rating: 4.8, students: 1850, duration: "10 weeks", type: "Online", category: "business" },
  { id: 42, title: "E-commerce Business Setup", provider: "Digital Commerce NG", price: 110000, rating: 4.7, students: 1200, duration: "8 weeks", type: "Online", category: "business" },
  { id: 43, title: "Financial Management for SMEs", provider: "Finance Academy NG", price: 180000, rating: 4.9, students: 920, duration: "14 weeks", type: "Hybrid", category: "business" },
  { id: 44, title: "Sales & Negotiation Skills", provider: "SalesForce Academy", price: 95000, rating: 4.8, students: 780, duration: "6 weeks", type: "Online", category: "business" },
  { id: 45, title: "Investment & Wealth Building", provider: "Invest Smart NG", price: 220000, rating: 4.9, students: 650, duration: "16 weeks", type: "Hybrid", category: "business" },
]

const COURSES_PER_PAGE = 9

const courseTypes = ["All", "Online", "In-person", "Hybrid"]
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₦100K", min: 0, max: 100000 },
  { label: "₦100K - ₦200K", min: 100000, max: 200000 },
  { label: "Above ₦200K", min: 200000, max: Infinity },
]

function AllCoursesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [visibleCount, setVisibleCount] = useState(COURSES_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)

  // Filter courses
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.provider.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesType = selectedType === "All" || course.type === selectedType
    
    const priceRange = priceRanges[selectedPriceRange]
    const matchesPrice = course.price >= priceRange.min && course.price < priceRange.max
    
    return matchesSearch && matchesCategory && matchesType && matchesPrice
  })

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "popular") return b.students - a.students
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "newest") return b.id - a.id
    return 0
  })

  // Get visible courses based on pagination
  const visibleCourses = sortedCourses.slice(0, visibleCount)
  const hasMoreCourses = visibleCount < sortedCourses.length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedType("All")
    setSelectedPriceRange(0)
    setSearchQuery("")
    setVisibleCount(COURSES_PER_PAGE)
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + COURSES_PER_PAGE, sortedCourses.length))
      setIsLoading(false)
    }, 500)
  }

  // Reset visible count when filters change
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug)
    setVisibleCount(COURSES_PER_PAGE)
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setVisibleCount(COURSES_PER_PAGE)
  }

  const handlePriceChange = (idx: number) => {
    setSelectedPriceRange(idx)
    setVisibleCount(COURSES_PER_PAGE)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setVisibleCount(COURSES_PER_PAGE)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setVisibleCount(COURSES_PER_PAGE)
  }

  const activeFiltersCount = 
    (selectedCategory !== "all" ? 1 : 0) + 
    (selectedType !== "All" ? 1 : 0) + 
    (selectedPriceRange !== 0 ? 1 : 0)

  const getCategoryColor = (categorySlug: string) => {
    const cat = categories.find(c => c.slug === categorySlug)
    return cat?.color || "from-indigo-500 to-purple-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                Explore All Courses
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto px-4">
                Discover over {allCourses.length}+ courses from verified training providers across Nigeria
              </p>
            </div>
          </ScrollReveal>
          
          {/* Search Bar */}
          <ScrollReveal direction="up" delay={100}>
            <div className="relative max-w-xl sm:max-w-2xl mx-auto px-2">
              <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, providers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 sm:pl-12 md:pl-14 pr-4 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-white text-gray-900 shadow-xl focus:ring-4 focus:ring-white/30 focus:outline-none text-sm sm:text-base"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 lg:px-8 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-14 sm:top-16 z-30">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" delay={50}>
            <div className="flex overflow-x-auto gap-1.5 sm:gap-2 md:gap-3 pb-1 sm:pb-2 scrollbar-thin -mx-1 px-1">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm md:text-base ${
                    selectedCategory === cat.slug
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="font-medium">{cat.name}</span>
                  <span className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat.slug ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Filters & Sort Bar */}
          <ScrollReveal direction="up" delay={50}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-indigo-600 text-white rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Desktop Filters */}
              <div className={`flex flex-wrap gap-2 ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
                {/* Type Filter */}
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="appearance-none px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 pr-7 sm:pr-8 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm md:text-base cursor-pointer"
                  >
                    {courseTypes.map(type => (
                      <option key={type} value={type}>{type === "All" ? "All Types" : type}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Price Range Filter */}
                <div className="relative">
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="appearance-none px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 pr-7 sm:pr-8 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm md:text-base cursor-pointer"
                  >
                    {priceRanges.map((range, idx) => (
                      <option key={idx} value={idx}>{range.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg sm:rounded-xl transition-colors"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Clear
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="sm:ml-auto relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 pr-7 sm:pr-8 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm md:text-base cursor-pointer w-full sm:w-auto"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </ScrollReveal>

          {/* Results Count */}
          <ScrollReveal direction="up" delay={100}>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 md:mb-6">
              Showing <span className="font-semibold text-foreground">{visibleCourses.length}</span> of{" "}
              <span className="font-semibold text-foreground">{sortedCourses.length}</span> courses
              {selectedCategory !== "all" && ` in ${categories.find(c => c.slug === selectedCategory)?.name}`}
            </p>
          </ScrollReveal>

          {/* Course Grid */}
          {sortedCourses.length === 0 ? (
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center py-10 sm:py-12 md:py-16">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No courses found</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-4">Try adjusting your filters or search query</p>
                <BouncyButton variant="primary" onClick={clearFilters}>
                  Clear All Filters
                </BouncyButton>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {visibleCourses.map((course, index) => (
                <ScrollReveal key={course.id} direction="up" delay={50 + (index % 6) * 30}>
                  <Link href={`/courses/${course.id}`}>
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 sm:hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden group">
                      {/* Image Header */}
                      <div className={`h-28 sm:h-32 md:h-40 bg-gradient-to-br ${getCategoryColor(course.category)} flex items-center justify-center relative overflow-hidden`}>
                        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white/30" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity text-xs sm:text-sm md:text-base">View Course</span>
                        </div>
                        {/* Category Badge */}
                        <span className="absolute top-2 sm:top-3 left-2 sm:left-3 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/90 text-gray-700 font-medium">
                          {categories.find(c => c.slug === course.category)?.name}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="p-3 sm:p-4 md:p-5">
                        <h3 className="font-bold text-foreground text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 line-clamp-2">{course.title}</h3>
                        <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-2 sm:mb-3">{course.provider}</p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-2 sm:mb-3">
                          <span className="flex items-center gap-0.5 sm:gap-1">
                            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                            {course.rating}
                          </span>
                          <span className="flex items-center gap-0.5 sm:gap-1">
                            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                            {course.students.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-0.5 sm:gap-1">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                            {course.duration}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm sm:text-base md:text-lg font-bold text-indigo-600">{formatCurrency(course.price)}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">or installments</p>
                          </div>
                          <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                            {course.type}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Load More Section */}
          {sortedCourses.length > 0 && (
            <ScrollReveal direction="up" delay={200}>
              <div className="mt-6 sm:mt-8 md:mt-12 text-center">
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4">
                  Showing {visibleCourses.length} of {sortedCourses.length} courses
                </p>
                {hasMoreCourses ? (
                  <BouncyButton 
                    variant="secondary" 
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="min-w-[140px] sm:min-w-[160px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      `Load More (${sortedCourses.length - visibleCourses.length} left)`
                    )}
                  </BouncyButton>
                ) : (
                  <p className="text-xs sm:text-sm text-green-600 font-medium">
                    ✓ You've seen all {sortedCourses.length} courses
                  </p>
                )}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  )
}

export default function AllCoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <AllCoursesContent />
    </Suspense>
  )
}
