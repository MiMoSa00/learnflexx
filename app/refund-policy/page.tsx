"use client"

import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { Card, CardContent } from "@/app/components/ui/card"
import Link from "next/link"
import { RotateCcw, ChevronRight, AlertCircle, CheckCircle } from "lucide-react"

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="down" delay={0}>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-400 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
                Refund Policy
              </span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>
        </ScrollReveal>

        {/* Quick Summary */}
        <ScrollReveal direction="up" delay={100}>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-400">Eligible for Refund</h3>
                    <p className="text-sm text-green-700 dark:text-green-500">Request within 48 hours before course starts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-400">Not Eligible</h3>
                    <p className="text-sm text-red-700 dark:text-red-500">After course has started or accessed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Main Content */}
        <ScrollReveal direction="up" delay={200}>
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 space-y-8">
              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-sm font-bold">1</span>
                  Eligibility for Refund
                </h2>
                <p className="text-muted-foreground mb-4">
                  You may be eligible for a refund if you meet ALL of the following criteria:
                </p>
                <ul className="space-y-2">
                  {[
                    "You request a refund within 48 hours of enrollment",
                    "The course has not yet started",
                    "You have not accessed any course materials",
                    "For offline courses, you have not received or used the access code"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-sm font-bold">2</span>
                  Refund Request Process
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="font-semibold text-foreground mb-2">Step 1: Submit Request</p>
                    <p className="text-sm text-muted-foreground">
                      Email refunds@learnflex.ng with your enrollment ID, course name, and reason for requesting a refund.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="font-semibold text-foreground mb-2">Step 2: Review Period</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will review your request within 3-5 business days and verify eligibility.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="font-semibold text-foreground mb-2">Step 3: Processing</p>
                    <p className="text-sm text-muted-foreground">
                      If approved, refunds are processed within 7-14 business days. Funds are returned to the original payment method.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-sm font-bold">3</span>
                  Installment Plans
                </h2>
                <p className="text-muted-foreground mb-4">
                  For courses enrolled with installment plans:
                </p>
                <ul className="space-y-2">
                  {[
                    "Refunds are calculated based on payments already made",
                    "If eligible, only completed payments will be refunded",
                    "Cancellation of mandate does not automatically trigger a refund",
                    "Outstanding payments remain due unless a refund is approved"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <ChevronRight className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 text-sm font-bold">!</span>
                  Non-Refundable Situations
                </h2>
                <p className="text-muted-foreground mb-4">
                  Refunds will NOT be issued in the following cases:
                </p>
                <ul className="space-y-2">
                  {[
                    "Course has already started or you've accessed materials",
                    "Request made after 48 hours from enrollment",
                    "Course completed or certificate issued",
                    "Violation of Terms of Service leading to account suspension",
                    "Change of mind after accessing course content"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-sm font-bold">5</span>
                  Exceptional Circumstances
                </h2>
                <p className="text-muted-foreground">
                  In exceptional circumstances such as course cancellation by the provider, medical emergencies (with documentation), 
                  or platform errors, we may consider refunds outside the standard policy. Please contact our support team with 
                  relevant documentation to discuss your situation.
                </p>
              </section>

              {/* Contact */}
              <section className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20">
                <h2 className="text-xl font-bold text-foreground mb-4">Need Help?</h2>
                <p className="text-muted-foreground mb-4">
                  For refund requests or questions about this policy:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong className="text-foreground">Email:</strong> <span className="text-indigo-600">refunds@learnflex.ng</span></p>
                  <p><strong className="text-foreground">Support:</strong> <span className="text-indigo-600">support@learnflex.ng</span></p>
                  <p><strong className="text-foreground">Response Time:</strong> 1-2 business days</p>
                </div>
              </section>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Related Links */}
        <ScrollReveal direction="up" delay={300}>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service →</Link>
            <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy →</Link>
            <Link href="/faq" className="text-indigo-600 hover:underline">FAQ →</Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
