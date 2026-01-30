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
  CheckCircle,
  Award,
  BookOpen,
  Video,
  FileText,
  CreditCard,
  ExternalLink,
  ChevronLeft,
  ShoppingCart,
  MapPin,
  Globe,
  Key,
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import {
  getUserCoursePurchases,
  canAccessCourse,
  getCourseAccessLink,
  hasPendingPaymentForCourse,
  type CoursePurchase,
} from "@/app/lib/payment-status"

// Import or define your course data here
// This should match the structure from your my-courses page
const courseData = {
  "1": {
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
    courseType: "online" as const,
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
    price: 200,
    originalPrice: null,
    duration: "8 weeks",
    mode: "Hybrid",
    rating: 4.7,
    students: 856,
    category: "Creative Arts",
    courseType: "offline" as const,
    venue: "24 Admiralty Way, Lekki Phase 1, Lagos",
    accessCode: "PH2026-4782",
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
  "3": {
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
    courseType: "online" as const,
    description: "Master digital marketing strategies and social media management. Learn to create effective campaigns, analyze metrics, and grow your online presence.",
    highlights: [
      "Complete digital marketing framework",
      "Social media strategy development",
      "Analytics and ROI tracking",
      "Content creation techniques",
      "Industry-recognized certificate",
      "Real campaign projects"
    ],
    curriculum: [
      { title: "Digital Marketing Fundamentals", lessons: 8, duration: "4 hours" },
      { title: "Social Media Marketing", lessons: 12, duration: "6 hours" },
      { title: "Content Strategy", lessons: 10, duration: "5 hours" },
      { title: "Analytics & Metrics", lessons: 8, duration: "4 hours" },
      { title: "Campaign Management", lessons: 12, duration: "6 hours" }
    ],
    instructor: {
      name: "Michael Chen",
      title: "Digital Marketing Expert",
      bio: "Former CMO, 12+ years in digital marketing",
    },
    requirements: [
      "Basic computer skills",
      "Social media accounts",
      "Willingness to learn"
    ],
    whatYouLearn: [
      "Create effective marketing strategies",
      "Master social media platforms",
      "Analyze campaign performance",
      "Build brand awareness",
      "Generate leads and conversions",
      "Optimize marketing ROI"
    ]
  },
  "4": {
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
    courseType: "online" as const,
    description: "Learn the principles of user interface and user experience design. Create beautiful, intuitive designs that users love.",
    highlights: [
      "Complete design toolkit",
      "Portfolio projects",
      "Industry tools (Figma, Adobe XD)",
      "User research techniques",
      "Certificate of completion",
      "Career guidance"
    ],
    curriculum: [
      { title: "Design Principles", lessons: 10, duration: "5 hours" },
      { title: "User Research", lessons: 12, duration: "6 hours" },
      { title: "Wireframing & Prototyping", lessons: 15, duration: "8 hours" },
      { title: "Visual Design", lessons: 18, duration: "10 hours" },
      { title: "Usability Testing", lessons: 10, duration: "6 hours" }
    ],
    instructor: {
      name: "Emma Williams",
      title: "Senior UX Designer",
      bio: "8+ years designing for Fortune 500 companies",
    },
    requirements: [
      "Computer with design software",
      "Creative mindset",
      "No prior design experience needed"
    ],
    whatYouLearn: [
      "Design thinking methodology",
      "Create user personas",
      "Build wireframes and prototypes",
      "Conduct user research",
      "Design beautiful interfaces",
      "Test and iterate designs"
    ]
  },
  "5": {
    id: "5",
    title: "Business Management Certificate",
    provider: "Executive Learning",
    price: 200,
    originalPrice: null,
    duration: "16 weeks",
    mode: "Offline",
    rating: 4.9,
    students: 432,
    category: "Business",
    courseType: "offline" as const,
    venue: "5 Abuja Business District, Central Area, Abuja",
    accessCode: "BM2026-9134",
    description: "Comprehensive business management program covering leadership, strategy, finance, and operations. Perfect for aspiring managers and entrepreneurs.",
    highlights: [
      "Executive-level curriculum",
      "Case study analysis",
      "Networking opportunities",
      "Professional certificate",
      "Guest speaker sessions",
      "Career advancement support"
    ],
    curriculum: [
      { title: "Business Strategy", lessons: 12, duration: "8 hours" },
      { title: "Financial Management", lessons: 15, duration: "10 hours" },
      { title: "Leadership Skills", lessons: 10, duration: "6 hours" },
      { title: "Operations Management", lessons: 12, duration: "8 hours" },
      { title: "Marketing Management", lessons: 10, duration: "6 hours" },
      { title: "Capstone Project", lessons: 8, duration: "20 hours" }
    ],
    instructor: {
      name: "Dr. James Okonkwo",
      title: "Business Professor",
      bio: "20+ years in business education and consulting",
    },
    requirements: [
      "Bachelor's degree or equivalent experience",
      "Professional work experience",
      "Commitment to attend all sessions"
    ],
    whatYouLearn: [
      "Develop business strategies",
      "Manage teams effectively",
      "Understand financial statements",
      "Optimize operations",
      "Make data-driven decisions",
      "Lead organizational change"
    ]
  },
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
  const { data: session, status } = useSession()
  
  const courseId = params?.id as string || ""
  const [userPurchases, setUserPurchases] = useState<Record<string, CoursePurchase>>({})

  const course = courseData[courseId as keyof typeof courseData]

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Course Not Found</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Link href="/dashboard/my-courses">
            <BouncyButton variant="primary">Back to My Courses</BouncyButton>
          </Link>
        </div>
      </div>
    )
  }

  const hasFullAccess = canAccessCourse(userPurchases, courseId)
  const hasPendingPayment = hasPendingPaymentForCourse(userPurchases, courseId)
  const accessLink = getCourseAccessLink(userPurchases, courseId)

  // Check if user is logged in and redirect accordingly
  const handleEnrollClick = () => {
    // If session is still loading, wait a moment
    if (status === "loading") {
      return
    }
    
    // If user is authenticated (logged in), skip login and go directly to review
    if (status === "authenticated" && session) {
      router.push(`/checkout/review?course=${courseId}`)
      return
    }
    
    // If user is not authenticated (not logged in), redirect to login
    router.push(`/checkout/login?course=${courseId}`)
  }

  const handleAccessCourse = () => {
    if (accessLink) {
      window.open(accessLink, '_blank')
    }
  }

  const getCTAButton = () => {
    if (!session) {
      return (
        <BouncyButton 
          onClick={handleEnrollClick}
          variant="primary" 
          className="w-full h-12 sm:h-14"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Enroll - {formatPrice(course.price)}
        </BouncyButton>
      )
    }

    if (hasFullAccess) {
      return (
        <div className="space-y-3">
          <BouncyButton 
            onClick={handleAccessCourse}
            variant="primary" 
            className="w-full h-12 sm:h-14"
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Access Course
          </BouncyButton>
          <p className="text-xs sm:text-sm text-center text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            You're enrolled
          </p>
        </div>
      )
    }

    if (hasPendingPayment) {
      return (
        <div className="space-y-3">
          <BouncyButton 
            onClick={handleEnrollClick}
            variant="primary" 
            className="w-full h-12 sm:h-14"
          >
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Pay Now
          </BouncyButton>
          <p className="text-xs sm:text-sm text-center text-orange-600 dark:text-orange-400">
            Payment pending
          </p>
        </div>
      )
    }

    return (
      <BouncyButton 
        onClick={handleEnrollClick}
        variant="primary" 
        className="w-full h-12 sm:h-14"
      >
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Enroll - {formatPrice(course.price)}
      </BouncyButton>
    )
  }

  return (
    <main className="flex-1 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1600px]">
        <ScrollReveal direction="left">
          <Link href="/dashboard/my-courses">
            <BouncyButton variant="ghost" className="mb-4 sm:mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to My Courses
            </BouncyButton>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal direction="up">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
                    {course.category}
                  </Badge>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
                    {course.title}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground mb-3">
                    by {course.provider}
                  </p>

                  <div className="flex flex-wrap gap-3 sm:gap-4 items-center text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold text-foreground">{course.rating}</span>
                      <span className="text-muted-foreground">({course.students})</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{course.duration}</span>
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

            {course.courseType === "offline" && 'venue' in course && course.venue && (
              <ScrollReveal direction="up" delay={50}>
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Training Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground mb-1">Physical Address</p>
                        <p className="text-sm text-muted-foreground">{course.venue}</p>
                      </div>
                    </div>
                    {'accessCode' in course && course.accessCode && (
                      <div className="flex items-start gap-3 pt-3 border-t">
                        <Key className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground mb-1">Access Code</p>
                          <Badge variant="secondary" className="font-mono">
                            {course.accessCode}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-2">
                            Use this code to access the training center
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {course.courseType === "online" && (
              <ScrollReveal direction="up" delay={50}>
                <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Globe className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground mb-1 text-lg">100% Online Course</p>
                        <p className="text-sm text-muted-foreground">
                          Learn from anywhere at your own pace. Access course materials 24/7 from any device.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

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

            <ScrollReveal direction="up" delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.curriculum.map((module, index) => (
                    <div key={index} className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                      <h4 className="font-semibold text-foreground mb-2">
                        {module.title}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                  ))}
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={250}>
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-1">
            <ScrollReveal direction="up" delay={100}>
              <div className="sticky top-24 space-y-6">
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    {!hasFullAccess && (
                      <div className="mb-6">
                        <div className="flex flex-wrap items-baseline gap-3 mb-2">
                          <span className="text-4xl font-bold text-foreground">
                            {formatPrice(course.price)}
                          </span>
                          {'originalPrice' in course && course.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              {formatPrice(course.originalPrice)}
                            </span>
                          )}
                        </div>
                        {'originalPrice' in course && course.originalPrice && (
                          <Badge variant="destructive">
                            Save {formatPrice(course.originalPrice - course.price)}
                          </Badge>
                        )}
                      </div>
                    )}

                    {getCTAButton()}

                    <div className="mt-6 pt-6 border-t space-y-3">
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
                        <span className="text-foreground">Certificate</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">Lifetime access</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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

                {!hasFullAccess && (
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Flexible Payment
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Pay in full or choose installments
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