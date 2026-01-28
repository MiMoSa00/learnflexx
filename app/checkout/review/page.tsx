"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card"
import {
  ChevronLeft,
  Check,
  Tag,
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { cn } from "@/app/lib/utils"

// Mock course data
const courseData: Record<string, {
  title: string
  provider: string
  price: number
  originalPrice?: number
  category: string
}> = {
  "1": {
    title: "Full Stack Web Development Bootcamp",
    provider: "TechHub Academy",
    price: 150000,
    originalPrice: 200000,
    category: "Digital Skills",
  },
  "2": {
    title: "Professional Photography Masterclass",
    provider: "Creative Vision Studios",
    price: 85000,
    category: "Creative Arts",
  },
  "3": {
    title: "Digital Marketing & Social Media",
    provider: "Growth Academy",
    price: 65000,
    originalPrice: 80000,
    category: "Business",
  },
  "4": {
    title: "UI/UX Design Fundamentals",
    provider: "Design Masters",
    price: 95000,
    category: "Digital Skills",
  },
  "5": {
    title: "Business Management Certificate",
    provider: "Executive Learning",
    price: 120000,
    originalPrice: 150000,
    category: "Business",
  },
}

// Mock user data (in real app, from session)
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+234 803 123 4567",
  isMember: true,
}

// Mock promo codes
const promoCodes: Record<string, { discount: number; type: "percentage" | "fixed" }> = {
  "SAVE10": { discount: 10, type: "percentage" },
  "FIRST20": { discount: 20, type: "percentage" },
  "WELCOME5000": { discount: 5000, type: "fixed" },
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

function calculateInstallment(totalAmount: number, months: number): number {
  // Add 5% service fee for installments
  const serviceFee = totalAmount * 0.05
  return Math.ceil((totalAmount + serviceFee) / months)
}

export default function CheckoutReviewPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const courseId = searchParams?.get('course') || "1"

  const [paymentPlan, setPaymentPlan] = useState<"full" | "installment">("full")
  const [installmentMonths, setInstallmentMonths] = useState(3)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<typeof promoCodes[string] | null>(null)
  const [promoError, setPromoError] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const course = courseData[courseId]
  const user = mockUser // In real app: session?.user

  // Calculate pricing
  const basePrice = course?.price || 0
  const memberDiscount = user?.isMember ? basePrice * 0.1 : 0 // 10% member discount
  const promoDiscount = appliedPromo 
    ? appliedPromo.type === "percentage" 
      ? basePrice * (appliedPromo.discount / 100)
      : appliedPromo.discount
    : 0

  const finalPrice = basePrice - memberDiscount - promoDiscount
  const monthlyPayment = paymentPlan === "installment" 
    ? calculateInstallment(finalPrice, installmentMonths)
    : finalPrice

  const totalWithFees = paymentPlan === "installment"
    ? monthlyPayment * installmentMonths
    : finalPrice

  const handleApplyPromo = () => {
    setPromoError("")
    const code = promoCode.toUpperCase().trim()
    
    if (!code) {
      setPromoError("Please enter a promo code")
      return
    }

    if (promoCodes[code]) {
      setAppliedPromo(promoCodes[code])
      setPromoError("")
    } else {
      setAppliedPromo(null)
      setPromoError("Invalid promo code")
    }
  }

  const handleRemovePromo = () => {
    setPromoCode("")
    setAppliedPromo(null)
    setPromoError("")
  }

  const handleContinue = () => {
    if (!termsAccepted) {
      alert("Please accept the terms and conditions to continue")
      return
    }

    setLoading(true)
    
    // Build query parameters for payment page
    const params = new URLSearchParams({
      course: courseId,
      plan: paymentPlan,
      amount: finalPrice.toString(),
    })

    // Add installment-specific parameters
    if (paymentPlan === "installment") {
      params.append("months", installmentMonths.toString())
      params.append("monthly", monthlyPayment.toString())
      params.append("total", totalWithFees.toString())
    }

    // Add promo code if applied
    if (appliedPromo && promoCode) {
      params.append("promo", promoCode.toUpperCase())
      params.append("discount", promoDiscount.toString())
    }

    // In real app: Save checkout session to database
    // await saveCheckoutSession({ courseId, paymentPlan, ... })
    
    // Navigate to payment page
    setTimeout(() => {
      router.push(`/checkout/payment?${params.toString()}`)
    }, 800)
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <Link href="/courses">
            <BouncyButton variant="primary">Browse Courses</BouncyButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-6 md:py-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <ScrollReveal direction="left">
          <Link href={`/checkout/login?course=${courseId}`}>
            <BouncyButton variant="ghost" className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </BouncyButton>
          </Link>
        </ScrollReveal>

        {/* Progress Indicator */}
        <ScrollReveal direction="up">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3 md:mb-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs sm:text-base">
                  <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                </div>
                <span className="hidden sm:inline text-xs md:text-sm text-muted-foreground">Login</span>
              </div>
              <div className="w-8 sm:w-12 md:w-24 h-0.5 bg-primary"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-base">
                  2
                </div>
                <span className="hidden sm:inline text-xs md:text-sm font-medium text-primary">Review</span>
              </div>
              <div className="w-8 sm:w-12 md:w-24 h-0.5 bg-muted"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold text-xs sm:text-base">
                  3
                </div>
                <span className="hidden sm:inline text-xs md:text-sm text-muted-foreground">Payment</span>
              </div>
            </div>
            <p className="text-center text-xs sm:text-sm text-muted-foreground">Step 2 of 3</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <ScrollReveal direction="up" delay={100}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium text-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium text-foreground">{user.phone}</p>
                  </div>
                  {user.isMember && (
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Member - 10% Discount Applied
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Payment Plan Selection */}
            <ScrollReveal direction="up" delay={150}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Choose Payment Plan
                  </CardTitle>
                  <CardDescription>
                    Select how you'd like to pay for your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Full Payment */}
                  <div
                    onClick={() => setPaymentPlan("full")}
                    className={cn(
                      "p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all",
                      paymentPlan === "full"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1">
                        <div className={cn(
                          "w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0",
                          paymentPlan === "full" ? "border-primary bg-primary" : "border-muted-foreground"
                        )}>
                          {paymentPlan === "full" && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1">
                            Pay in Full
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                            Pay once and start learning immediately
                          </p>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-xl sm:text-2xl font-bold text-foreground">
                              {formatPrice(finalPrice)}
                            </span>
                            {course.originalPrice && (
                              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                {formatPrice(course.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Installment Payment */}
                  <div
                    onClick={() => setPaymentPlan("installment")}
                    className={cn(
                      "p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all",
                      paymentPlan === "installment"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0",
                        paymentPlan === "installment" ? "border-primary bg-primary" : "border-muted-foreground"
                      )}>
                        {paymentPlan === "installment" && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1">
                          Pay in Installments
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                          Spread your payment over multiple months
                        </p>

                        {paymentPlan === "installment" && (
                          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                              {[2, 3, 4, 6].map((months) => (
                                <button
                                  key={months}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setInstallmentMonths(months)
                                  }}
                                  className={cn(
                                    "p-2 sm:p-3 rounded-lg border-2 text-center transition-all",
                                    installmentMonths === months
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border hover:border-primary/50"
                                  )}
                                >
                                  <p className="text-xs font-medium">{months} months</p>
                                  <p className="text-base sm:text-lg font-bold mt-1">
                                    {formatPrice(calculateInstallment(finalPrice, months))}
                                  </p>
                                  <p className="text-[10px] sm:text-xs opacity-75">per month</p>
                                </button>
                              ))}
                            </div>

                            {/* Payment Schedule */}
                            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-2">
                              <h4 className="font-semibold text-xs sm:text-sm text-foreground flex items-center gap-2">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                Payment Schedule
                              </h4>
                              <div className="space-y-1 text-xs sm:text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Today:</span>
                                  <span className="font-semibold text-foreground">
                                    {formatPrice(monthlyPayment)}
                                  </span>
                                </div>
                                {Array.from({ length: installmentMonths - 1 }).map((_, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Month {i + 2}:
                                    </span>
                                    <span className="font-semibold text-foreground">
                                      {formatPrice(monthlyPayment)}
                                    </span>
                                  </div>
                                ))}
                                <Separator className="my-2" />
                                <div className="flex justify-between font-semibold">
                                  <span className="text-foreground">Total:</span>
                                  <span className="text-foreground">
                                    {formatPrice(totalWithFees)}
                                  </span>
                                </div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                                  * Includes 5% service fee for installment plan
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Promo Code */}
            <ScrollReveal direction="up" delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Promo Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appliedPromo ? (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-green-700 dark:text-green-400 mb-1">
                            Code Applied: {promoCode}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-500">
                            You saved{" "}
                            {appliedPromo.type === "percentage"
                              ? `${appliedPromo.discount}%`
                              : formatPrice(appliedPromo.discount)}
                            !
                          </p>
                        </div>
                        <BouncyButton
                          variant="ghost"
                          size="sm"
                          onClick={handleRemovePromo}
                        >
                          Remove
                        </BouncyButton>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          className="flex-1"
                        />
                        <BouncyButton
                          variant="outline"
                          onClick={handleApplyPromo}
                        >
                          Apply
                        </BouncyButton>
                      </div>
                      {promoError && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {promoError}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Try: SAVE10, FIRST20, or WELCOME5000
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Terms */}
            <ScrollReveal direction="up" delay={250}>
              <Card>
                <CardContent className="p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 rounded"
                    />
                    <span className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Continue Button */}
            <ScrollReveal direction="up" delay={300}>
              <BouncyButton
                variant="primary"
                className="w-full h-12 sm:h-14 text-base sm:text-lg"
                onClick={handleContinue}
                disabled={!termsAccepted || loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Continue to Payment"
                )}
              </BouncyButton>
            </ScrollReveal>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <ScrollReveal direction="up" delay={150}>
              <div className="lg:sticky lg:top-24">
                <Card className="border-primary/20">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        by {course.provider}
                      </p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {course.category}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Base Price:</span>
                        <span className="font-semibold text-foreground">
                          {formatPrice(basePrice)}
                        </span>
                      </div>

                      {memberDiscount > 0 && (
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">Member Discount:</span>
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            -{formatPrice(memberDiscount)}
                          </span>
                        </div>
                      )}

                      {promoDiscount > 0 && (
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">Promo Discount:</span>
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            -{formatPrice(promoDiscount)}
                          </span>
                        </div>
                      )}

                      {paymentPlan === "installment" && (
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">Service Fee (5%):</span>
                          <span className="text-orange-600 dark:text-orange-400 font-semibold">
                            +{formatPrice(totalWithFees - finalPrice)}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      {paymentPlan === "full" ? (
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-semibold text-sm sm:text-base text-foreground">Total:</span>
                          <span className="text-2xl sm:text-3xl font-bold text-primary">
                            {formatPrice(finalPrice)}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-baseline gap-2">
                            <span className="font-semibold text-sm sm:text-base text-foreground">Today:</span>
                            <span className="text-xl sm:text-2xl font-bold text-primary">
                              {formatPrice(monthlyPayment)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm gap-2">
                            <span className="text-muted-foreground">
                              {installmentMonths - 1} more payments:
                            </span>
                            <span className="font-semibold text-foreground">
                              {formatPrice(monthlyPayment)} /mo
                            </span>
                          </div>
                          <div className="flex justify-between text-xs sm:text-sm pt-2 border-t gap-2">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-semibold text-foreground">
                              {formatPrice(totalWithFees)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </main>
  )
}