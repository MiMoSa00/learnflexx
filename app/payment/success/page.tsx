"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import { CheckCircle, Download, ShoppingCart, LayoutDashboard, Mail, MapPin, Key, ExternalLink } from "lucide-react"

const courseData: Record<string, { 
  title: string
  provider: string
  type: "online" | "offline"
  venue?: string
  accessCode?: string
  accessLink?: string
}> = {
  "1": { title: "Full Stack Web Development Bootcamp", provider: "TechHub Academy", type: "online", accessLink: "https://platform.techhub.com" },
  "2": { title: "Professional Photography Masterclass", provider: "Creative Vision Studios", type: "offline", venue: "24 Admiralty Way, Lekki Phase 1, Lagos", accessCode: "PH2026-4782" },
  "3": { title: "Digital Marketing & Social Media", provider: "Growth Academy", type: "online", accessLink: "https://learn.growthacademy.com" },
  "4": { title: "UI/UX Design Fundamentals", provider: "Design Masters", type: "online", accessLink: "https://platform.designmasters.com" },
  "5": { title: "Business Management Certificate", provider: "Executive Learning", type: "offline", venue: "5 Abuja Business District, Central Area, Abuja", accessCode: "BM2026-9134" },
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const courseId = searchParams?.get('course') || "1"
  const enrollmentId = searchParams?.get('enrollment') || `ENR-${Date.now()}`
  const plan = searchParams?.get('plan') || "full"

  const course = courseData[courseId]

  const handleDownloadReceipt = () => {
    alert("Receipt download started")
    // In real app: Generate and download PDF receipt
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-background to-primary/5 dark:from-background">
      <div className="w-full max-w-2xl">
        <ScrollReveal direction="up">
          <Card className="border-green-200 dark:border-green-800 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center text-white">
              {/* Success Animation */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Payment Successful!
              </h1>
              <p className="text-lg sm:text-xl text-green-50">
                You're all set to start learning
              </p>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Enrollment Details */}
              <div className="text-center pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  Enrollment Confirmation
                </p>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {enrollmentId}
                </p>
                <Badge className="mt-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {plan === "full" ? "Fully Paid" : "Installment Active"}
                </Badge>
              </div>

              {/* Course Details */}
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {course?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  by {course?.provider}
                </p>
              </div>

              <Separator />

              {/* Next Steps - Online */}
              {course?.type === "online" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Next Steps
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-foreground mb-3">
                      ✅ Check your email for access details and login credentials
                    </p>
                    <p className="text-sm text-foreground">
                      📧 Sent to your registered email address
                    </p>
                  </div>
                  {course.accessLink && (
                    <a href={course.accessLink} target="_blank" rel="noopener noreferrer">
                      <BouncyButton variant="primary" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Access Course Now
                      </BouncyButton>
                    </a>
                  )}
                </div>
              )}

              {/* Next Steps - Offline */}
              {course?.type === "offline" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Training Location
                  </h3>
                  
                  {/* Access Code - Prominent */}
                  {course.accessCode && (
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Key className="w-5 h-5 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Your Access Code</p>
                      </div>
                      <p className="text-3xl sm:text-4xl font-bold text-primary font-mono mb-2">
                        {course.accessCode}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Present this code at the training center
                      </p>
                    </div>
                  )}

                  {/* Venue */}
                  {course.venue && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-foreground mb-2">Venue Address:</p>
                      <p className="text-sm text-muted-foreground">{course.venue}</p>
                    </div>
                  )}

                  <Link href={`/course-access/${courseId}`}>
                    <BouncyButton variant="primary" className="w-full">
                      View Full Course Details
                    </BouncyButton>
                  </Link>
                </div>
              )}

              <Separator />

              {/* Actions */}
              <div className="space-y-3">
                <BouncyButton
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </BouncyButton>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/courses">
                    <BouncyButton variant="outline" className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Browse Courses
                    </BouncyButton>
                  </Link>
                  <Link href="/dashboard/my-courses">
                    <BouncyButton variant="primary" className="w-full">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      My Dashboard
                    </BouncyButton>
                  </Link>
                </div>
              </div>

              {/* Support */}
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Need help?{" "}
                  <Link href="/support" className="text-primary hover:underline font-medium">
                    Contact Support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </main>
  )
}
