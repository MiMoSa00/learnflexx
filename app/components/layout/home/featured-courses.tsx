"use client"

import Link from "next/link"
import { Clock, Users, Star, MapPin, Monitor, ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { Badge } from "@/app/components/ui"
import { cn } from "@/app/lib/utils"

const featuredCourses = [
  {
    id: 1,
    title: "Full Stack Web Development Bootcamp",
    provider: "TechHub Academy",
    image: "/course-1.jpg",
    price: 150000,
    originalPrice: 200000,
    duration: "12 weeks",
    mode: "Online",
    rating: 4.9,
    students: 1234,
    category: "Digital Skills",
    featured: true,
  },
  {
    id: 2,
    title: "Professional Photography Masterclass",
    provider: "Creative Vision Studios",
    image: "/course-2.jpg",
    price: 85000,
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
    id: 3,
    title: "Digital Marketing & Social Media",
    provider: "Growth Academy",
    image: "/course-3.jpg",
    price: 65000,
    originalPrice: 80000,
    duration: "6 weeks",
    mode: "Online",
    rating: 4.8,
    students: 2341,
    category: "Business",
    featured: true,
  },
  {
    id: 4,
    title: "UI/UX Design Fundamentals",
    provider: "Design Masters",
    image: "/course-4.jpg",
    price: 95000,
    originalPrice: null,
    duration: "10 weeks",
    mode: "Online",
    rating: 4.6,
    students: 678,
    category: "Digital Skills",
    featured: false,
  },
  {
    id: 5,
    title: "Business Management Certificate",
    provider: "Executive Learning",
    image: "/course-5.jpg",
    price: 120000,
    originalPrice: 150000,
    duration: "16 weeks",
    mode: "Offline",
    rating: 4.9,
    students: 432,
    location: "Abuja",
    category: "Business",
    featured: true,
  },
  {
    id: 6,
    title: "Electrical Installation Course",
    provider: "Skilled Trades Institute",
    image: "/course-6.jpg",
    price: 75000,
    originalPrice: null,
    duration: "8 weeks",
    mode: "Offline",
    rating: 4.5,
    students: 289,
    location: "Lagos",
    category: "Vocational",
    featured: false,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

interface CourseCardProps {
  course: typeof featuredCourses[0]
  index: number
}

function CourseCard({ course, index }: CourseCardProps) {
  return (
    <ScrollReveal direction="up" delay={index * 100}>
      <Link href={`/courses/${course.id}`}>
        <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Monitor className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs font-medium",
                  course.mode === "Online" && "bg-green-100 text-green-700",
                  course.mode === "Offline" && "bg-orange-100 text-orange-700",
                  course.mode === "Hybrid" && "bg-blue-100 text-blue-700"
                )}
              >
                {course.mode}
              </Badge>
              {course.featured && (
                <Badge className="bg-primary text-primary-foreground text-xs">
                  Featured
                </Badge>
              )}
            </div>

            {/* Discount Badge */}
            {course.originalPrice && (
              <div className="absolute top-3 right-3">
                <Badge variant="destructive" className="text-xs">
                  {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Category */}
            <span className="text-xs text-primary font-medium uppercase tracking-wider">
              {course.category}
            </span>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>

            {/* Provider */}
            <p className="text-sm text-muted-foreground mb-3">
              by {course.provider}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.students.toLocaleString()}
              </div>
              {course.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {course.location}
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold text-foreground">{course.rating}</span>
              </div>
              <span className="text-muted-foreground text-sm">
                ({course.students} students)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end justify-between pt-4 border-t border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(course.price)}
                  </span>
                  {course.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(course.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Installments available
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  )
}

export function FeaturedCourses() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Trending Now
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
                Featured Courses
              </h2>
            </div>
            <Link href="/courses">
              <button className="btn-bouncy inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                View All Courses
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
