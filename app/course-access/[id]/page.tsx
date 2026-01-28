"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
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
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  Key,
  Phone,
  Mail,
  Download,
  AlertCircle,
  CheckCircle,
  Globe,
  BookOpen,
//   User,
//   CreditCard,
  ChevronLeft,
  Map,
  Navigation,
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import {
  getCourseAccessDetails,
//   isOnlineCourse,
//   isOfflineCourse,
//   formatSessionDate,
  getDaysUntilNextSession,
  type CourseAccessDetails,
} from "@/app/lib/course-checker"

// Mock enrollment data
const enrollmentData = {
  "1": {
    enrollmentDate: "2026-01-15",
    enrollmentId: "ENR-2026-001234",
    paymentStatus: "paid",
    courseName: "Full Stack Web Development Bootcamp",
    provider: "TechHub Academy",
  },
  "2": {
    enrollmentDate: "2026-01-10",
    enrollmentId: "ENR-2026-001189",
    paymentStatus: "paid",
    courseName: "Professional Photography Masterclass",
    provider: "Creative Vision Studios",
  },
  "5": {
    enrollmentDate: "2026-01-12",
    enrollmentId: "ENR-2026-001245",
    paymentStatus: "installment",
    courseName: "Business Management Certificate",
    provider: "Executive Learning",
  },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function CourseAccessPage() {
  const params = useParams()
//   const _router = useRouter()
const { data: _session } = useSession()
  const courseId = params?.id as string
  
  const [accessDetails, setAccessDetails] = useState<CourseAccessDetails | null>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch course access details
    const details = getCourseAccessDetails(courseId)
    const enrollmentInfo = enrollmentData[courseId as keyof typeof enrollmentData]
    
    setAccessDetails(details)
    setEnrollment(enrollmentInfo)
    setLoading(false)
  }, [courseId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">
            You don't have access to this course or it doesn't exist.
          </p>
          <Link href="/dashboard/my-courses">
            <BouncyButton variant="primary">Back to My Courses</BouncyButton>
          </Link>
        </div>
      </div>
    )
  }

  const handleDownloadConfirmation = () => {
    // In real app, this would generate and download PDF
    alert("Enrollment confirmation will be downloaded")
  }

  const handleContactProvider = () => {
    // In real app, this would open contact modal or redirect
    if (accessDetails?.type === "offline") {
      window.location.href = `mailto:${accessDetails.providerContact.email}`
    }
  }

  return (
    <main className="min-h-screen py-6 md:py-8 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <ScrollReveal direction="left">
          <Link href="/dashboard/my-courses">
            <BouncyButton variant="ghost" className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to My Courses
            </BouncyButton>
          </Link>
        </ScrollReveal>

        {/* Page Header */}
        <ScrollReveal direction="up">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Course Access
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {enrollment.courseName}
            </p>
            <p className="text-sm text-muted-foreground">
              by {enrollment.provider}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Online Course Access */}
            {accessDetails?.type === "online" && (
              <>
                <ScrollReveal direction="up" delay={100}>
                  <Card className="border-green-200 dark:border-green-800 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">Access Your Course Online</h2>
                      </div>
                      <p className="text-green-50">
                        Your course is ready! Click below to start learning.
                      </p>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <a
                          href={accessDetails.accessLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <BouncyButton variant="primary" className="w-full h-14 text-lg">
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Access Course Platform
                          </BouncyButton>
                        </a>

                        {accessDetails.loginCredentials && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                              <Key className="w-4 h-4 text-blue-600" />
                              Login Instructions
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {accessDetails.loginCredentials.instructions}
                            </p>
                          </div>
                        )}

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                            Getting Started
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {accessDetails.gettingStartedGuide}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </>
            )}

            {/* Offline Course Access */}
            {accessDetails?.type === "offline" && (
              <>
                {/* Access Code - Prominent Display */}
                <ScrollReveal direction="up" delay={100}>
                  <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                        <Key className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        Your Access Code
                      </h2>
                      <div className="my-6">
                        <div className="inline-block bg-background border-2 border-primary rounded-lg px-8 py-4">
                          <p className="text-4xl md:text-5xl font-bold text-primary font-mono tracking-wider">
                            {accessDetails.accessCode}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        {accessDetails.accessInstructions}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>

                {/* Venue Information */}
                <ScrollReveal direction="up" delay={150}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Training Venue
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {accessDetails.venue.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {accessDetails.venue.address}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <a
                          href={accessDetails.venue.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <BouncyButton variant="outline" className="w-full">
                            <Map className="w-4 h-4 mr-2" />
                            View on Map
                          </BouncyButton>
                        </a>
                        <a
                          href={accessDetails.venue.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <BouncyButton variant="outline" className="w-full">
                            <Navigation className="w-4 h-4 mr-2" />
                            Get Directions
                          </BouncyButton>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>

                {/* Schedule */}
                <ScrollReveal direction="up" delay={200}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Class Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm p-3 bg-muted rounded-lg">
                          <span className="text-muted-foreground">Course Duration:</span>
                          <span className="font-semibold text-foreground">
                            {formatDate(accessDetails.schedule.startDate)} -{" "}
                            {accessDetails.schedule.endDate && formatDate(accessDetails.schedule.endDate)}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-foreground">
                            Upcoming Sessions:
                          </h4>
                          {accessDetails.schedule.sessions.slice(0, 3).map((session, index) => {
                            const daysUntil = getDaysUntilNextSession(session.date)
                            return (
                              <div
                                key={index}
                                className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="font-semibold text-foreground">
                                      {session.topic || `Session ${index + 1}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDate(session.date)}
                                    </p>
                                  </div>
                                  {daysUntil <= 7 && daysUntil > 0 && (
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30">
                                      In {daysUntil} days
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {session.startTime} - {session.endTime}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>

                {/* Contact Provider */}
                <ScrollReveal direction="up" delay={250}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary" />
                        Contact Training Provider
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={`tel:${accessDetails.providerContact.phone}`}
                          className="text-primary hover:underline"
                        >
                          {accessDetails.providerContact.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={`mailto:${accessDetails.providerContact.email}`}
                          className="text-primary hover:underline"
                        >
                          {accessDetails.providerContact.email}
                        </a>
                      </div>
                      <BouncyButton
                        variant="outline"
                        className="w-full mt-4"
                        onClick={handleContactProvider}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </BouncyButton>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Enrollment Details */}
              <ScrollReveal direction="up" delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Enrollment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Enrollment Date</p>
                      <p className="font-semibold text-foreground">
                        {formatDate(enrollment.enrollmentDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Enrollment ID</p>
                      <p className="font-mono text-sm text-foreground">
                        {enrollment.enrollmentId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                      <Badge
                        className={cn(
                          enrollment.paymentStatus === "paid" &&
                            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                          enrollment.paymentStatus === "installment" &&
                            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        )}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {enrollment.paymentStatus === "paid" ? "Fully Paid" : "Installment Active"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Support Section */}
              <ScrollReveal direction="up" delay={150}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <BouncyButton variant="outline" className="w-full" onClick={handleContactProvider}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Provider
                    </BouncyButton>
                    <BouncyButton variant="outline" className="w-full">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Report an Issue
                    </BouncyButton>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Download Confirmation */}
              <ScrollReveal direction="up" delay={200}>
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="p-6">
                    <BouncyButton
                      variant="outline"
                      className="w-full"
                      onClick={handleDownloadConfirmation}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Enrollment Confirmation
                    </BouncyButton>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}