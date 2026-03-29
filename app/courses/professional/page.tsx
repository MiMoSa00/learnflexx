"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card } from "@/app/components/ui/card"
import { 
  Briefcase, 
  Award,
  Users,
  Target,
  TrendingUp,
  FileText,
  Star,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Loader2,
  MessageSquare,
  BarChart
} from "lucide-react"

const categoryInfo = {
  name: "Professional Development",
  slug: "professional",
  description: "Advance your career with leadership, management, and professional skills",
  icon: Briefcase,
  color: "from-purple-500 to-violet-600",
}

const subCategories = [
  { name: "Leadership", icon: Target, count: 20 },
  { name: "Management", icon: TrendingUp, count: 18 },
  { name: "Communication", icon: MessageSquare, count: 15 },
  { name: "Project Management", icon: FileText, count: 22 },
  { name: "HR & Recruitment", icon: Users, count: 12 },
  { name: "Analytics", icon: BarChart, count: 14 },
]

const courses = [
  { id: 30, title: "Leadership & Team Management", provider: "Executive Academy NG", price: 250000, rating: 4.9, students: 1100, duration: "12 weeks", type: "Hybrid" },
  { id: 31, title: "Project Management Professional (PMP)", provider: "PM Institute Nigeria", price: 350000, rating: 4.9, students: 890, duration: "16 weeks", type: "Online" },
  { id: 32, title: "Business Communication Mastery", provider: "CommsPro Academy", price: 120000, rating: 4.8, students: 760, duration: "8 weeks", type: "Online" },
  { id: 33, title: "Strategic HR Management", provider: "HR Excellence NG", price: 180000, rating: 4.7, students: 540, duration: "10 weeks", type: "Hybrid" },
  { id: 34, title: "Data Analytics for Managers", provider: "Analytics Hub", price: 200000, rating: 4.8, students: 620, duration: "12 weeks", type: "Online" },
  { id: 35, title: "Executive Coaching Certification", provider: "Coach Academy Africa", price: 400000, rating: 4.9, students: 320, duration: "20 weeks", type: "In-person" },
]

function ProfessionalContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.provider.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "popular") return b.students - a.students
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    return 0
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const Icon = categoryInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className={`py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${categoryInfo.color} relative overflow-hidden`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                  {categoryInfo.name}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl">
                  {categoryInfo.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={100}>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {subCategories.map((sub, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm"
                >
                  <sub.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{sub.name}</span>
                  <span className="text-white/60">({sub.count})</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Search & Filters */}
          <ScrollReveal direction="up" delay={50}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search professional development courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border border-input bg-white dark:bg-gray-800 text-foreground shadow-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm sm:text-base"
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-input bg-white dark:bg-gray-800 text-foreground text-sm sm:text-base"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Showing {sortedCourses.length} courses in Professional Development
            </p>
          </ScrollReveal>

          {/* Course Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedCourses.map((course, index) => (
              <ScrollReveal key={course.id} direction="up" delay={100 + index * 50}>
                <Link href={`/courses/${course.id}`}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden group">
                    <div className={`h-32 sm:h-40 bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center relative overflow-hidden`}>
                      <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white/30" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity text-sm sm:text-base">View Course</span>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-5">
                      <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 line-clamp-2">{course.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3">{course.provider}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                          {course.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {course.students}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {course.duration}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-base sm:text-lg font-bold text-purple-600">{formatCurrency(course.price)}</p>
                          <p className="text-xs text-muted-foreground">or installments</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                          {course.type}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={200}>
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">Want to see more courses?</p>
              <Link href="/courses">
                <BouncyButton variant="primary" className="bg-purple-600 hover:bg-purple-700">
                  Browse All Courses
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </BouncyButton>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

export default function ProfessionalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    }>
      <ProfessionalContent />
    </Suspense>
  )
}
