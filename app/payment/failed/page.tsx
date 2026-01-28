"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card, CardContent } from "@/app/components/ui/card"
import { XCircle, RotateCcw, MessageCircle, ArrowLeft, CreditCard, Building2, Phone } from "lucide-react"
import { Suspense } from "react"
const failureReasons: Record<string, string> = {
  "insufficient_funds": "Insufficient funds in your account",
  "invalid_account": "Invalid bank account details",
  "timeout": "Payment request timed out",
  "network_error": "Network connection error",
  "declined": "Payment was declined by your bank",
  "default": "An error occurred while processing your payment"
}

export default function PaymentFailedPage() {
    return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ReviewPageContent />
    </Suspense>
  )
}

function ReviewPageContent() {
  const searchParams = useSearchParams()
  const courseId = searchParams?.get('course') || "1"
  const reason = searchParams?.get('reason') || "default"
  
  const errorMessage = failureReasons[reason] || failureReasons.default

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-background to-primary/5 dark:from-background">
      <div className="w-full max-w-2xl">
        <ScrollReveal direction="up">
          <Card className="border-red-200 dark:border-red-800 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-8 text-center text-white">
              {/* Error Animation */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Payment Failed
              </h1>
              <p className="text-lg text-red-50">
                We couldn't process your payment
              </p>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Error Reason */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-1">
                      Reason for Failure
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-500">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* What to do next */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">What you can do:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Check your account balance and try again</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Verify your bank account details are correct</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Contact your bank for more information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Try a different payment method</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Link href={`/checkout/payment?course=${courseId}`}>
                  <BouncyButton variant="primary" className="w-full h-12 text-base">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </BouncyButton>
                </Link>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href={`/course-details/${courseId}`}>
                    <BouncyButton variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Course
                    </BouncyButton>
                  </Link>
                  <Link href="/support">
                    <BouncyButton variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </BouncyButton>
                  </Link>
                </div>
              </div>

              {/* Alternative Payment Methods */}
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-4">
                  Alternative Payment Options
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Bank Transfer</p>
                      <p className="text-xs text-muted-foreground">Direct transfer to our account</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Visit Our Office</p>
                      <p className="text-xs text-muted-foreground">Make payment in person</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                    <Phone className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Call Us</p>
                      <p className="text-xs text-muted-foreground">+234 800 000 0000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Notice */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Having trouble?{" "}
                  <Link href="/support" className="text-primary hover:underline font-medium">
                    Our support team is here to help
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