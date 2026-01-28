"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs"
import {
  Card,
  CardContent,
} from "@/app/components/ui/card"
import {
  Search,
  BookOpen,
  Clock,
  Calendar,
  ExternalLink,
  PlayCircle,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Eye,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import {
  getUserCoursePurchases,
  getCourseAccessLink,
  hasPendingPaymentForCourse,
  canAccessCourse,
  type CoursePurchase,
  type CourseStatus,
} from "@/app/lib/payment-status"

// Type definitions
interface Course {
  id: string
  title: string
  provider: string
  thumbnail: string
  enrollmentDate: string
  enrollmentId: string
  progress: number
  courseType: "online" | "offline"
  nextClass?: string
  category: string
  venue?: string
  accessCode?: string
  completedDate?: string
}

// Mock enrolled courses data (courses user has started enrollment for)
const enrolledCourses: Course[] = [
  {
    id: "1",
    title: "Full Stack Web Development Bootcamp",
    provider: "TechHub Academy",
    thumbnail: "/courses/web-dev.jpg",
    enrollmentDate: "2026-01-15",
    enrollmentId: "ENR-2026-001234",
    progress: 65,
    courseType: "online",
    nextClass: "2026-01-23T10:00:00",
    category: "Digital Skills",
  },
  {
    id: "2",
    title: "Professional Photography Masterclass",
    provider: "Creative Vision Studios",
    thumbnail: "/courses/photography.jpg",
    enrollmentDate: "2026-01-10",
    enrollmentId: "ENR-2026-001189",
    progress: 30,
    courseType: "offline",
    venue: "24 Admiralty Way, Lekki Phase 1, Lagos",
    accessCode: "PH2026-4782",
    nextClass: "2026-01-24T14:00:00",
    category: "Creative Arts",
  },
  {
    id: "3",
    title: "Digital Marketing & Social Media",
    provider: "Growth Academy",
    thumbnail: "/courses/marketing.jpg",
    enrollmentDate: "2025-12-05",
    enrollmentId: "ENR-2025-009876",
    progress: 100,
    courseType: "online",
    completedDate: "2026-01-18",
    category: "Business",
  },
  {
    id: "4",
    title: "UI/UX Design Fundamentals",
    provider: "Design Masters",
    thumbnail: "/courses/uiux.jpg",
    enrollmentDate: "2026-01-20",
    enrollmentId: "ENR-2026-001301",
    progress: 0,
    courseType: "online",
    category: "Digital Skills",
  },
  {
    id: "5",
    title: "Business Management Certificate",
    provider: "Executive Learning",
    thumbnail: "/courses/business.jpg",
    enrollmentDate: "2026-01-12",
    enrollmentId: "ENR-2026-001245",
    progress: 45,
    courseType: "offline",
    venue: "5 Abuja Business District, Central Area, Abuja",
    accessCode: "BM2026-9134",
    nextClass: "2026-01-25T09:00:00",
    category: "Business",
  },
]

const statusConfig: Record<CourseStatus, {
  label: string
  color: string
  icon: LucideIcon
}> = {
  "not-purchased": {
    label: "Not Started",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    icon: Eye,
  },
  paid: {
    label: "Active",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: PlayCircle,
  },
  installment: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Clock,
  },
  "pending-payment": {
    label: "Payment Pending",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: AlertCircle,
  },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

interface CourseCardProps {
  course: Course
  index: number
  purchaseData?: CoursePurchase
}

function CourseCard({ course, index, purchaseData }: CourseCardProps) {
  const status = purchaseData?.status || "not-purchased"
  const StatusIcon = statusConfig[status].icon

  // Determine what buttons to show and their behavior
  const getActionButtons = () => {
    const accessLink = purchaseData?.accessLink

    if (status === "paid") {
      // Fully paid - show access course button
      return (
        <div className="flex gap-2">
          {accessLink ? (
            <a href={accessLink} target="_blank" rel="noopener noreferrer" className="flex-1">
              <BouncyButton variant="primary" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Access Course
              </BouncyButton>
            </a>
          ) : (
            <Link href={`/dashboard/courses/${course.id}`} className="flex-1">
              <BouncyButton variant="primary" className="w-full">
                <PlayCircle className="w-4 h-4 mr-2" />
                Access Course
              </BouncyButton>
            </Link>
          )}
        </div>
      )
    }

    if (status === "pending-payment" || status === "installment") {
      // Has pending payment - show pay now button + view details
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/payments?course=${course.id}`} className="flex-1">
            <BouncyButton variant="primary" className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </BouncyButton>
          </Link>
          <Link href={`/course-details/${course.id}`}>
            <BouncyButton variant="outline">
              <Eye className="w-4 h-4" />
            </BouncyButton>
          </Link>
        </div>
      )
    }

    // Not purchased or no payment data - show view details
    return (
      <Link href={`/course-details/${course.id}`} className="flex-1">
        <BouncyButton variant="outline" className="w-full">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </BouncyButton>
      </Link>
    )
  }

  // Get status message
  const getStatusMessage = () => {
    if (course.completedDate) {
      return {
        text: `Completed: ${formatDate(course.completedDate)}`,
        color: "text-green-600 dark:text-green-400",
        icon: CheckCircle,
      }
    }

    if (status === "pending-payment" && purchaseData?.amountDue) {
      return {
        text: `Due: ${formatPrice(purchaseData.amountDue)}${purchaseData.dueDate ? ` by ${formatDate(purchaseData.dueDate)}` : ""}`,
        color: "text-orange-600 dark:text-orange-400",
        icon: AlertCircle,
      }
    }

    if (status === "installment") {
      return {
        text: `Payment plan active - ${purchaseData?.installmentsPaid || 0}/${purchaseData?.totalInstallments || 0} paid`,
        color: "text-blue-600 dark:text-blue-400",
        icon: Clock,
      }
    }

    if (course.nextClass && status === "paid") {
      return {
        text: `Next: ${formatDate(course.nextClass)}`,
        color: "text-muted-foreground",
        icon: Clock,
      }
    }

    return null
  }

  const statusMessage = getStatusMessage()

  return (
    <ScrollReveal direction="up" delay={index * 50}>
      <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden border-border">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={cn("flex items-center gap-1", statusConfig[status].color)}>
              <StatusIcon className="w-3 h-3" />
              {statusConfig[status].label}
            </Badge>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {course.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            by {course.provider}
          </p>

          {/* Progress Bar (only for paid courses that are in progress) */}
          {status === "paid" && !course.completedDate && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-foreground">{course.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Enrollment Details */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Enrolled: {formatDate(course.enrollmentDate)}
            </div>
            
            {statusMessage && (
              <div className={cn("flex items-center gap-2", statusMessage.color)}>
                <statusMessage.icon className="w-4 h-4" />
                {statusMessage.text}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {getActionButtons()}

          {/* Enrollment ID */}
          <p className="text-xs text-muted-foreground mt-3 text-center">
            ID: {course.enrollmentId}
          </p>
        </CardContent>
      </Card>
    </ScrollReveal>
  )
}

function EmptyState({ message, icon: Icon }: { message: string; icon: LucideIcon }) {
  return (
    <div className="text-center py-16">
      <ScrollReveal direction="up">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <Icon className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No courses found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {message}
        </p>
        <Link href="/courses">
          <BouncyButton variant="primary">
            Browse Courses
          </BouncyButton>
        </Link>
      </ScrollReveal>
    </div>
  )
}

export default function MyCoursesPage() {
  const { data: session } = useSession()
  const [userPurchases, setUserPurchases] = useState<Record<string, CoursePurchase>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [activeTab, setActiveTab] = useState<"all" | CourseStatus>("all")

  // Fetch user purchases
  useEffect(() => {
    async function fetchPurchases() {
      if (session?.user?.id) {
        const purchases = await getUserCoursePurchases(session.user.id)
        setUserPurchases(purchases)
      }
    }
    fetchPurchases()
  }, [session])

  const filteredCourses = useMemo(() => {
    let result = [...enrolledCourses]

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter((course) => {
        const status = userPurchases[course.id]?.status || "not-purchased"
        return status === activeTab
      })
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.provider.toLowerCase().includes(query) ||
          course.enrollmentId.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.enrollmentDate).getTime() - new Date(b.enrollmentDate).getTime())
        break
      case "progress":
        result.sort((a, b) => b.progress - a.progress)
        break
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [searchQuery, sortBy, activeTab, userPurchases])

  const stats = useMemo(() => {
    return {
      total: enrolledCourses.length,
      paid: enrolledCourses.filter((c) => userPurchases[c.id]?.status === "paid").length,
      installment: enrolledCourses.filter((c) => userPurchases[c.id]?.status === "installment").length,
      pending: enrolledCourses.filter((c) => userPurchases[c.id]?.status === "pending-payment").length,
    }
  }, [userPurchases])

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <ScrollReveal direction="up">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <GraduationCap className="w-10 h-10 text-primary" />
              My Courses
            </h1>
            <p className="text-muted-foreground">
              Manage and access all your enrolled courses
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Cards */}
        <ScrollReveal direction="up" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Courses</p>
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.paid}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.installment}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Payment</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Search and Filter Bar */}
        <ScrollReveal direction="up" delay={150}>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses, providers, enrollment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="progress">By Progress</SelectItem>
                <SelectItem value="title">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal direction="up" delay={200}>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | CourseStatus)} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="all">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="paid">
                Active ({stats.paid})
              </TabsTrigger>
              <TabsTrigger value="installment">
                In Progress ({stats.installment})
              </TabsTrigger>
              <TabsTrigger value="pending-payment">
                Pending ({stats.pending})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      purchaseData={userPurchases[course.id]}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="You haven't enrolled in any courses yet. Start learning today!"
                  icon={BookOpen}
                />
              )}
            </TabsContent>

            <TabsContent value="paid" className="mt-6">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      purchaseData={userPurchases[course.id]}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No active courses at the moment."
                  icon={PlayCircle}
                />
              )}
            </TabsContent>

            <TabsContent value="installment" className="mt-6">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      purchaseData={userPurchases[course.id]}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No courses with payment plans."
                  icon={Clock}
                />
              )}
            </TabsContent>

            <TabsContent value="pending-payment" className="mt-6">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      purchaseData={userPurchases[course.id]}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="All payments are up to date!"
                  icon={CheckCircle}
                />
              )}
            </TabsContent>
          </Tabs>
        </ScrollReveal>
      </div>
    </div>
  )
}