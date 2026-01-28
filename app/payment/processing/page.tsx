"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Suspense } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  ChevronLeft,
  Check,
  CreditCard,
  Shield,
  Lock,
  Clock,
//   AlertCircle,
  Building2,
//   Calendar,
  Copy,
  CheckCircle2,
} from "lucide-react"
// import { cn } from "@/app/lib/utils"

const courseData: Record<string, { title: string; provider: string }> = {
  "1": { title: "Full Stack Web Development Bootcamp", provider: "TechHub Academy" },
  "2": { title: "Professional Photography Masterclass", provider: "Creative Vision Studios" },
  "3": { title: "Digital Marketing & Social Media", provider: "Growth Academy" },
  "4": { title: "UI/UX Design Fundamentals", provider: "Design Masters" },
  "5": { title: "Business Management Certificate", provider: "Executive Learning" },
}

const banks = [
  "Access Bank", "GTBank", "First Bank", "UBA", "Zenith Bank",
  "Stanbic IBTC", "Fidelity Bank", "Union Bank", "Ecobank", "FCMB"
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

export default function CheckoutPaymentPage() {
     return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ReviewPageContent />
    </Suspense>
  )
}

function ReviewPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const courseId = searchParams?.get('course') || "1"
  const plan = searchParams?.get('plan') as "full" | "installment" || "full"
  const amount = parseFloat(searchParams?.get('amount') || "0")
  const months = parseInt(searchParams?.get('months') || "3")
  const monthly = parseFloat(searchParams?.get('monthly') || "0")
  const total = parseFloat(searchParams?.get('total') || "0")
  
  const [paymentStep, setPaymentStep] = useState<"select" | "ussd" | "mandate">("select")
  const [ussdCode, setUssdCode] = useState("")
  const [countdown, setCountdown] = useState(300)
  const [mandateAccepted, setMandateAccepted] = useState(false)
  const [selectedBank, setSelectedBank] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const course = courseData[courseId]

  useEffect(() => {
    if (paymentStep === "ussd" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev > 0 ? prev - 1 : 0)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [paymentStep, countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCopyUSSD = () => {
    navigator.clipboard.writeText(ussdCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePayWithBank = () => {
    setLoading(true)
    setTimeout(() => {
      const mockUSSD = `*737*000*${Math.floor(Math.random() * 900000 + 100000)}#`
      setUssdCode(mockUSSD)
      setPaymentStep("ussd")
      setLoading(false)
      
      setTimeout(() => {
        router.push(`/payment/success?course=${courseId}&enrollment=ENR-${Date.now()}`)
      }, 15000)
    }, 2000)
  }

  const handleSetupMandate = () => {
    if (!selectedBank || !mandateAccepted) {
      alert("Please select a bank and accept the mandate terms")
      return
    }
    setLoading(true)
    setTimeout(() => {
      router.push(`/payment/processing?course=${courseId}&plan=installment`)
    }, 2000)
  }

  return (
    <main className="min-h-screen py-4 sm:py-6 md:py-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        <ScrollReveal direction="left">
          <Link href={`/checkout/review?course=${courseId}`}>
            <BouncyButton variant="ghost" className="mb-4 sm:mb-6 text-sm">
              <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
              Back
            </BouncyButton>
          </Link>
        </ScrollReveal>

        {/* Progress */}
        <ScrollReveal direction="up">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                </div>
                <span className="hidden sm:inline text-xs md:text-sm text-muted-foreground">Login</span>
              </div>
              <div className="w-8 sm:w-12 md:w-24 h-0.5 bg-green-500"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                </div>
                <span className="hidden sm:inline text-xs md:text-sm text-muted-foreground">Review</span>
              </div>
              <div className="w-8 sm:w-12 md:w-24 h-0.5 bg-primary"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-base">
                  3
                </div>
                <span className="hidden sm:inline text-xs md:text-sm font-medium text-primary">Payment</span>
              </div>
            </div>
            <p className="text-center text-xs sm:text-sm text-muted-foreground">Step 3 of 3</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Full Payment - USSD Display */}
            {plan === "full" && paymentStep === "ussd" && (
              <ScrollReveal direction="up">
                <Card className="border-primary/30">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Complete Your Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
                    <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4 sm:p-6 text-center">
                      <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                        Dial this USSD code on your phone
                      </p>
                      <div className="bg-background border-2 border-primary rounded-lg p-4 sm:p-6 mb-3 sm:mb-4">
                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary font-mono tracking-wider">
                          {ussdCode}
                        </p>
                      </div>
                      <BouncyButton
                        variant="outline"
                        onClick={handleCopyUSSD}
                        className="w-full sm:w-auto"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                          </>
                        )}
                      </BouncyButton>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-orange-700 dark:text-orange-400">
                              Time Remaining
                            </p>
                            <p className="text-lg sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {formatTime(countdown)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 py-4 sm:py-6">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>

                      <p className="text-center text-sm sm:text-base text-muted-foreground">
                        Waiting for payment confirmation...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Full Payment - Initial */}
            {plan === "full" && paymentStep === "select" && (
              <ScrollReveal direction="up">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                    <div className="p-4 sm:p-6 border-2 border-primary/20 rounded-xl bg-primary/5">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <span className="text-sm sm:text-base text-muted-foreground">Amount to Pay:</span>
                        <span className="text-2xl sm:text-3xl font-bold text-primary">
                          {formatPrice(amount)}
                        </span>
                      </div>
                      <BouncyButton
                        variant="primary"
                        className="w-full h-12 sm:h-14 text-base sm:text-lg"
                        onClick={handlePayWithBank}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Initiating Payment...
                          </span>
                        ) : (
                          <>
                            <Building2 className="w-5 h-5 mr-2" />
                            Pay with Bank Account
                          </>
                        )}
                      </BouncyButton>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Installment Payment */}
            {plan === "installment" && (
              <ScrollReveal direction="up">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Setup Direct Debit Mandate</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Select Your Bank
                        </label>
                        <Select value={selectedBank} onValueChange={setSelectedBank}>
                          <SelectTrigger className="h-11 sm:h-12">
                            <SelectValue placeholder="Choose your bank" />
                          </SelectTrigger>
                          <SelectContent>
                            {banks.map(bank => (
                              <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2 sm:mb-3">
                          Payment Schedule
                        </h4>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Today (1st payment):</span>
                            <span className="font-semibold text-foreground">{formatPrice(monthly)}</span>
                          </div>
                          {Array.from({ length: months - 1 }).map((_, i) => (
                            <div key={i} className="flex justify-between">
                              <span className="text-muted-foreground">Month {i + 2}:</span>
                              <span className="font-semibold text-foreground">{formatPrice(monthly)}</span>
                            </div>
                          ))}
                          <Separator className="my-2" />
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>{formatPrice(total)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={mandateAccepted}
                            onChange={(e) => setMandateAccepted(e.target.checked)}
                            className="mt-1 rounded"
                          />
                          <span className="text-xs sm:text-sm text-foreground">
                            I authorize automatic debit of {formatPrice(monthly)} from my bank account every month for {months} months. I understand the first payment will be processed immediately.
                          </span>
                        </label>
                      </div>

                      <BouncyButton
                        variant="primary"
                        className="w-full h-12 sm:h-14 text-base sm:text-lg"
                        onClick={handleSetupMandate}
                        disabled={loading || !selectedBank || !mandateAccepted}
                      >
                        {loading ? "Setting up..." : "Authorize & Pay First Installment"}
                      </BouncyButton>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Security Badges */}
            <ScrollReveal direction="up" delay={100}>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4 sm:py-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span>256-bit SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <ScrollReveal direction="up" delay={100}>
              <div className="lg:sticky lg:top-24">
                <Card className="border-primary/20">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1">{course?.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{course?.provider}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Plan:</span>
                        <Badge variant="secondary" className="text-xs">
                          {plan === "full" ? "Full Payment" : `${months} Months`}
                        </Badge>
                      </div>
                      {plan === "full" ? (
                        <div className="flex justify-between font-semibold text-base sm:text-lg">
                          <span>Total:</span>
                          <span className="text-primary">{formatPrice(amount)}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Today:</span>
                            <span className="font-semibold">{formatPrice(monthly)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Per Month:</span>
                            <span className="font-semibold">{formatPrice(monthly)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span className="text-primary">{formatPrice(total)}</span>
                          </div>
                        </>
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