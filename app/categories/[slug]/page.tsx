"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams } from "next/navigation"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card } from "@/app/components/ui/card"
import Link from "next/link"
import { 
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Users,
  Filter,
  SlidersHorizontal,
  Loader2,
  Code,
  Briefcase,
  Palette,
  TrendingUp,
  BookOpen
} from "lucide-react"

const categoryData: Record<string, { 
  name: string; 
  description: string; 
  icon: any;
  color: string;
  bgColor: string;
}> = {
  technology: {
    name: "Technology",
    description: "Master coding, data science, cloud computing, and more",
    icon: Code,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
  },
  business: {
    name: "Business",
    description: "Learn entrepreneurship, management, and finance",
    icon: Briefcase,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30"
  },
  design: {
    name: "Design",
    description: "Explore UI/UX, graphic design, and creative tools",
    icon: Palette,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30"
  },
  marketing: {
    name: "Marketing",
    description: "Digital marketing, SEO, social media, and more",
    icon: TrendingUp,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/30"
  }
}

// Mock courses data
const allCourses = [
  { id: 1, title: "Complete Web Development Bootcamp", provider: "Tech Academy Lagos", price: 150000, rating: 4.8, students: 1250, duration: "12 weeks", category: "technology", location: "Lagos", type: "Hybrid" },
  { id: 2, title: "Digital Marketing Masterclass", provider: "Marketing Pro Institute", price: 85000, rating: 4.6, students: 890, duration: "8 weeks", category: "marketing", location: "Online", type: "Online" },
  { id: 3, title: "Data Science with Python", provider: "Data School Nigeria", price: 200000, rating: 4.9, students: 750, duration: "16 weeks", category: "technology", location: "Abuja", type: "In-person" },
  { id: 4, title: "UI/UX Design Fundamentals", provider: "Creative Hub Academy", price: 120000, rating: 4.7, students: 560, duration: "10 weeks", category: "design", location: "Lagos", type: "Hybrid" },
  { id: 5, title: "Project Management Professional", provider: "PM Expert Institute", price: 180000, rating: 4.5, students: 430, duration: "6 weeks", category: "business", location: "Online", type: "Online" },
  { id: 6, title: "Mobile App Development", provider: "AppDev Nigeria", price: 175000, rating: 4.7, students: 620, duration: "14 weeks", category: "technology", location: "Lagos", type: "Hybrid" },
  { id: 7, title: "Brand Strategy & Identity", provider: "Creative Hub Academy", price: 95000, rating: 4.5, students: 340, duration: "6 weeks", category: "design", location: "Online", type: "Online" },
  { id: 8, title: "Social Media Marketing", provider: "Marketing Pro Institute", price: 65000, rating: 4.4, students: 1100, duration: "4 weeks", category: "marketing", location: "Online", type: "Online" }
]

function CategoryContent() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [courses, setCourses] = useState<typeof allCourses>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("popular")

  const category = categoryData[slug] || {
    name: slug?.charAt(0).toUpperCase() + slug?.slice(1) || "Category",
    description: "Explore courses in this category",
    icon: BookOpen,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30"
  }

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filtered = allCourses.filter(c => c.category === slug)
      
      // Sort
      if (sortBy === "popular") {
        filtered.sort((a, b) => b.students - a.students)
      } else if (sortBy === "rating") {
        filtered.sort((a, b) => b.rating - a.rating)
      } else if (sortBy === "price-low") {
        filtered.sort((a, b) => a.price - b.price)
      } else if (sortBy === "price-high") {
        filtered.sort((a, b) => b.price - a.price)
      }
      
      setCourses(filtered)
      setLoading(false)
    }
    
    fetchCourses()
  }, [slug, sortBy])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const Icon = category.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero */}
      <div className={`py-12 px-4 sm:px-6 lg:px-8 ${category.bgColor}`}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="down" delay={0}>
            <Link href="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Categories
            </Link>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${category.bgColor} border-2 border-white/50 flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${category.color}`} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{category.name}</h1>
                <p className="text-muted-foreground mt-1">{category.description}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Toolbar */}
          <ScrollReveal direction="up" delay={50}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-muted-foreground">
                {loading ? "Loading..." : `${courses.length} courses found`}
              </p>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </ScrollReveal>

          {/* Courses Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
            </div>
          ) : courses.length === 0 ? (
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center py-12">
                <Icon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6">
                  We're working on adding courses to this category
                </p>
                <Link href="/courses">
                  <BouncyButton variant="primary">
                    Browse All Courses
                  </BouncyButton>
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <ScrollReveal key={course.id} direction="up" delay={100 + index * 50}>
                  <Link href={`/courses/${course.id}`}>
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden group">
                      {/* Image */}
                      <div className="h-40 bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center relative overflow-hidden">
                        <span className="text-6xl font-bold text-white/20">{course.title[0]}</span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">View Course</span>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-foreground mb-1 line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{course.provider}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {course.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-indigo-600">{formatCurrency(course.price)}</p>
                            <p className="text-xs text-muted-foreground">or installments</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-muted-foreground">
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
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <CategoryContent />
    </Suspense>
  )
}
