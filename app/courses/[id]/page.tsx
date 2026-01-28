"use client"

import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Badge } from "@/app/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  Clock,
  Users,
  Star,
  // Monitor,
  CheckCircle,
  Award,
  BookOpen,
  Video,
  FileText,
  CreditCard,
  ExternalLink,
  ChevronLeft,
  ShoppingCart,
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import {
  getUserCoursePurchases,
  canAccessCourse,
  getCourseAccessLink,
  hasPendingPaymentForCourse,
  type CoursePurchase,
} from "@/app/lib/payment-status"

// Mock course data
const courseData = {
  "1": {
    id: "1",
    title: "Full Stack Web Development Bootcamp",
    provider: "TechHub Academy",
    price: 150000,
    originalPrice: 200000,
    duration: "12 weeks",
    mode: "Online",
    rating: 4.9,
    students: 1234,
    category: "Digital Skills",
    featured: true,
    description: "Master full-stack web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and launch your career as a professional developer.",
    highlights: [
      "Build 10+ real-world projects",
      "Learn React, Node.js, and MongoDB",
      "Get job-ready portfolio",
      "Certificate of completion",
      "Lifetime access to course materials",
      "1-on-1 mentorship sessions"
    ],
    curriculum: [
      { title: "HTML & CSS Fundamentals", lessons: 12, duration: "6 hours" },
      { title: "JavaScript Essentials", lessons: 18, duration: "10 hours" },
      { title: "React.js Masterclass", lessons: 24, duration: "15 hours" },
      { title: "Node.js & Express", lessons: 20, duration: "12 hours" },
      { title: "MongoDB & Database Design", lessons: 15, duration: "8 hours" },
      { title: "Full Stack Project", lessons: 10, duration: "20 hours" }
    ],
    instructor: {
      name: "John Smith",
      title: "Senior Software Engineer",
      bio: "10+ years of experience in web development",
      image: null
    },
    requirements: [
      "Basic computer skills",
      "Commitment to learn",
      "No prior coding experience needed"
    ],
    whatYouLearn: [
      "Build responsive websites with HTML, CSS, and JavaScript",
      "Create dynamic web applications using React",
      "Develop backend APIs with Node.js and Express",
      "Work with MongoDB databases",
      "Deploy applications to production",
      "Best practices for modern web development"
    ]
  },
  "2": {
    id: "2",
    title: "Professional Photography Masterclass",
    provider: "Creative Vision Studios",
    price: 85000,
    originalPrice: null,
    duration: "8 weeks",
    mode: "Hybrid",
    rating: 4.7,
    students: 856,
    category: "Creative Arts",
    featured: false,
    description: "Learn professional photography techniques from industry experts. Master camera settings, composition, lighting, and post-processing to create stunning images.",
    highlights: [
      "Hands-on practice sessions",
      "Portfolio development",
      "Industry networking opportunities",
      "Certificate of completion",
      "Access to studio equipment",
      "Guest lectures from professionals"
    ],
    curriculum: [
      { title: "Camera Basics & Settings", lessons: 10, duration: "5 hours" },
      { title: "Composition & Framing", lessons: 12, duration: "6 hours" },
      { title: "Lighting Techniques", lessons: 15, duration: "8 hours" },
      { title: "Post-Processing with Adobe", lessons: 18, duration: "10 hours" },
      { title: "Portfolio Development", lessons: 8, duration: "15 hours" }
    ],
    instructor: {
      name: "Sarah Johnson",
      title: "Award-winning Photographer",
      bio: "15+ years in professional photography",
      image: null
    },
    requirements: [
      "DSLR or mirrorless camera",
      "Laptop for editing",
      "Passion for photography"
    ],
    whatYouLearn: [
      "Master manual camera settings",
      "Understand composition principles",
      "Work with natural and artificial lighting",
      "Edit photos professionally",
      "Build a professional portfolio",
      "Start your photography business"
    ]
  },
  // Add more courses as needed
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const courseId = params?.id as string
  const [userPurchases, setUserPurchases] = useState<Record<string, CoursePurchase>>({})

  // Get course data
  const course = courseData[courseId as keyof typeof courseData]

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

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Link href="/courses">
            <BouncyButton variant="primary">Browse Courses</BouncyButton>
          </Link>
        </div>
      </div>
    )
  }

  // Check purchase status
  const hasFullAccess = canAccessCourse(userPurchases, courseId)
  const hasPendingPayment = hasPendingPaymentForCourse(userPurchases, courseId)
  const accessLink = getCourseAccessLink(userPurchases, courseId)

  // Handle enrollment/payment click
  const handleEnrollClick = () => {
    if (!session) {
      // Redirect to login with return URL
      router.push(`/login?redirect=/courses/${courseId}`)
      return
    }

    // Redirect to payment/checkout page
    router.push(`/dashboard/payments?course=${courseId}`)
  }

  const handleAccessCourse = () => {
    if (accessLink) {
      window.open(accessLink, '_blank')
    }
  }

  // Determine CTA button for sidebar
  const getCTAButton = () => {
    if (!session) {
      // Not logged in - show enroll button
      return (
        <BouncyButton 
          onClick={handleEnrollClick}
          variant="primary" 
          className="w-full h-14 text-lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Enroll Now - {formatPrice(course.price)}
        </BouncyButton>
      )
    }

    if (hasFullAccess) {
      // Fully paid - show access course button
      return (
        <div className="space-y-3">
          <BouncyButton 
            onClick={handleAccessCourse}
            variant="primary" 
            className="w-full h-14 text-lg"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Access Course
          </BouncyButton>
          <p className="text-sm text-center text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" />
            You're enrolled in this course
          </p>
        </div>
      )
    }

    if (hasPendingPayment) {
      // Has pending payment - show pay now button
      return (
        <div className="space-y-3">
          <BouncyButton 
            onClick={handleEnrollClick}
            variant="primary" 
            className="w-full h-14 text-lg"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Complete Payment
          </BouncyButton>
          <p className="text-sm text-center text-orange-600 dark:text-orange-400">
            Payment pending - Complete to access course
          </p>
        </div>
      )
    }

    // Logged in but not purchased - show enroll button
    return (
      <BouncyButton 
        onClick={handleEnrollClick}
        variant="primary" 
        className="w-full h-14 text-lg"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Enroll Now - {formatPrice(course.price)}
      </BouncyButton>
    )
  }

  return (
    <main className="flex-1 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <ScrollReveal direction="left">
          <Link href="/courses">
            <BouncyButton variant="ghost" className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </BouncyButton>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <ScrollReveal direction="up">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                    {course.category}
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                    {course.title}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-4">
                    by {course.provider}
                  </p>

                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold text-foreground">{course.rating}</span>
                      <span className="text-muted-foreground">({course.students} students)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      {course.duration}
                    </div>
                    <Badge variant="secondary" className={cn(
                      course.mode === "Online" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                      course.mode === "Offline" && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                      course.mode === "Hybrid" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    )}>
                      {course.mode}
                    </Badge>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction="up" delay={100}>
              <Card>
                <CardHeader>
                  <CardTitle>About This Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* What You'll Learn */}
            <ScrollReveal direction="up" delay={150}>
              <Card>
                <CardHeader>
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.whatYouLearn.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Curriculum */}
            <ScrollReveal direction="up" delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.curriculum.map((module, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-2">
                            {module.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {module.lessons} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {module.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Requirements */}
            <ScrollReveal direction="up" delay={250}>
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ScrollReveal direction="up" delay={100}>
              <div className="sticky top-28 space-y-6">
                {/* Price Card */}
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    {!hasFullAccess && (
                      <div className="mb-6">
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-4xl font-bold text-foreground">
                            {formatPrice(course.price)}
                          </span>
                          {course.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              {formatPrice(course.originalPrice)}
                            </span>
                          )}
                        </div>
                        {course.originalPrice && (
                          <Badge variant="destructive">
                            Save {formatPrice(course.originalPrice - course.price)}
                          </Badge>
                        )}
                      </div>
                    )}

                    {getCTAButton()}

                    <div className="mt-6 pt-6 border-t border-border space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Video className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">On-demand video</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">Downloadable resources</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Award className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">Certificate of completion</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">Lifetime access</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Course Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {course.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{highlight}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Payment Options Info */}
                {!hasFullAccess && (
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Flexible Payment Options
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Pay in full or choose our installment plan to spread the cost over multiple payments.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </main>
  )
}