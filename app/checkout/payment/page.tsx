"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/app/lib/supabase/client"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import { Suspense } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
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
  Building2,
  Copy,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { usePWABanks, Bank } from "@/app/hooks/usePWABanks"
import { usePWACollect } from "@/app/hooks/usePWACollect"
import { useTransactionStatus } from "@/app/hooks/useTransactionStatus"

const courseData: Record<string, { title: string; provider: string }> = {
  "1": { title: "Full Stack Web Development Bootcamp", provider: "TechHub Academy" },
  "2": { title: "Professional Photography Masterclass", provider: "Creative Vision Studios" },
  "3": { title: "Digital Marketing & Social Media", provider: "Growth Academy" },
  "4": { title: "UI/UX Design Fundamentals", provider: "Design Masters" },
  "5": { title: "Business Management Certificate", provider: "Executive Learning" },
}

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
      <PaymentPageContent />
    </Suspense>
  )
}

function PaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const courseId = searchParams?.get('course') || "1"
  const plan = searchParams?.get('plan') as "full" | "installment" || "full"
  const amount = parseFloat(searchParams?.get('amount') || "0")
  const months = parseInt(searchParams?.get('months') || "3")
  const monthly = parseFloat(searchParams?.get('monthly') || "0")
  const total = parseFloat(searchParams?.get('total') || "0")
  
  // State
  const [paymentStep, setPaymentStep] = useState<"select" | "bank-details" | "ussd" | "success" | "failed">("select")
  const [ussdCode, setUssdCode] = useState("")
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [mandateAccepted, setMandateAccepted] = useState(false)
  const [selectedBank, setSelectedBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [copied, setCopied] = useState(false)
  const [transactionRef, setTransactionRef] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState("")

  // Hooks
  const { data: banksData, isLoading: banksLoading } = usePWABanks()
  const collectMutation = usePWACollect()
  
  // Status polling
  const { 
    status: txStatus, 
    isPolling, 
    startPolling, 
    stopPolling,
    remainingTime 
  } = useTransactionStatus({
    transaction_ref: transactionRef,
    enabled: paymentStep === "ussd" && !!transactionRef,
    pollingInterval: 5000,
    maxAttempts: 60, // 5 minutes
    onSuccess: () => {
      setPaymentStep("success")
      setTimeout(() => {
        router.push(`/payment/success?course=${courseId}&enrollment=ENR-${Date.now()}`)
      }, 2000)
    },
    onFailed: () => {
      setPaymentStep("failed")
      setErrorMessage("Payment was declined. Please try again.")
    },
    onTimeout: () => {
      setPaymentStep("failed")
      setErrorMessage("Payment timeout. Please try again.")
    },
  })

  const course = courseData[courseId]
  const banks: Bank[] = banksData?.banks || []

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUserData(profile)
        } else {
          // Fallback to session metadata
          setUserData({
            first_name: session.user.user_metadata?.full_name?.split(' ')[0] || '',
            last_name: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            email: session.user.email,
            phone: session.user.user_metadata?.phone || '',
          })
        }
      }
    }
    fetchUser()
  }, [supabase])

  // Countdown timer
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

  const handlePayWithBank = async () => {
    if (!selectedBank || !accountNumber) {
      setErrorMessage("Please select a bank and enter your account number")
      return
    }

    if (accountNumber.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit account number")
      return
    }

    setErrorMessage("")

    try {
      console.log("=== PAY WITH BANK DEBUG ===")
      console.log("All banks:", banks)
      console.log("Selected bank name:", selectedBank)
      
      const selectedBankData = banks.find(b => b.bank_name === selectedBank)
      console.log("Selected bank data:", selectedBankData)
      
      if (!selectedBankData) {
        setErrorMessage("Invalid bank selection. Please select a bank from the list.")
        return
      }
      
      if (!selectedBankData.bank_cbn_code) {
        setErrorMessage("Bank code not found. Please try selecting a different bank.")
        console.error("Bank has no bank_cbn_code:", selectedBankData)
        return
      }

      console.log("Sending to collect API:", {
        account_number: accountNumber,
        bank_code: selectedBankData.bank_cbn_code,
        amount: amount,
      })

      const result = await collectMutation.mutateAsync({
        account_number: accountNumber,
        bank_code: selectedBankData.bank_cbn_code,
        amount: amount,
        customer: {
          customer_ref: userData?.phone || userData?.email || "customer",
          firstname: userData?.first_name || "Customer",
          surname: userData?.last_name || "User",
          email: userData?.email || "customer@example.com",
          mobile_no: userData?.phone || "08000000000",
        },
        transaction_desc: `Payment for ${course?.title || 'Course'}`,
      })

      if (result.status === "Successful" || result.ussd_code) {
        // Generate USSD code format if not provided
        const generatedUSSD = result.ussd_code || `*${selectedBankData.bank_cbn_code}*000*${result.reference}#`
        setUssdCode(generatedUSSD)
        setTransactionRef(result.transaction_ref)
        setPaymentStep("ussd")
        setCountdown(300) // Reset to 5 minutes
        startPolling()
      } else {
        setErrorMessage(result.message || "Failed to initiate payment. Please try again.")
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      setErrorMessage(error.response?.data?.error?.message || "Failed to initiate payment. Please try again.")
    }
  }

  const handleRetry = () => {
    setPaymentStep("select")
    setErrorMessage("")
    setUssdCode("")
    setTransactionRef("")
    setCountdown(300)
    stopPolling()
  }

  const handleSetupMandate = () => {
    if (!selectedBank || !mandateAccepted) {
      alert("Please select a bank and accept the mandate terms")
      return
    }
    router.push(`/create-mandate?course=${courseId}&plan=installment`)
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
            
            {/* Success State */}
            {paymentStep === "success" && (
              <ScrollReveal direction="up">
                <Card className="border-green-500/30 bg-green-50 dark:bg-green-900/20">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                      Payment Successful!
                    </h3>
                    <p className="text-muted-foreground">
                      Redirecting to confirmation page...
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Failed State */}
            {paymentStep === "failed" && (
              <ScrollReveal direction="up">
                <Card className="border-red-500/30">
                  <CardContent className="p-6 sm:p-8 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-400">
                      Payment Failed
                    </h3>
                    <p className="text-muted-foreground">
                      {errorMessage || "Something went wrong. Please try again."}
                    </p>
                    <BouncyButton
                      variant="primary"
                      onClick={handleRetry}
                      className="mt-4"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </BouncyButton>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* USSD Display */}
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
                        {isPolling ? "Checking for payment confirmation..." : "Waiting for payment..."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            )}

            {/* Bank Selection - Full Payment */}
            {plan === "full" && paymentStep === "select" && (
              <ScrollReveal direction="up">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Pay with Bank Account</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                    {/* Error Message */}
                    {errorMessage && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errorMessage}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Select Your Bank
                        </label>
                        <Select value={selectedBank} onValueChange={setSelectedBank}>
                          <SelectTrigger className="h-11 sm:h-12">
                            <SelectValue placeholder={banksLoading ? "Loading banks..." : "Choose your bank"} />
                          </SelectTrigger>
                          <SelectContent>
                            {banks.map((bank, index) => (
                              <SelectItem key={`${bank.bank_cbn_code || index}-${index}`} value={bank.bank_name}>
                                {bank.bank_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Account Number
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter your 10-digit account number"
                          className="w-full h-11 sm:h-12 px-3 rounded-md border border-input bg-background text-sm"
                        />
                      </div>
                    </div>

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
                        disabled={collectMutation.isPending || !selectedBank || !accountNumber}
                      >
                        {collectMutation.isPending ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Initiating Payment...
                          </span>
                        ) : (
                          <>
                            <Building2 className="w-5 h-5 mr-2" />
                            Continue to Pay
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
                            <SelectValue placeholder={banksLoading ? "Loading banks..." : "Choose your bank"} />
                          </SelectTrigger>
                          <SelectContent>
                            {banks.map((bank, index) => (
                              <SelectItem key={`installment-${bank.bank_cbn_code || index}-${index}`} value={bank.bank_name}>
                                {bank.bank_name}
                              </SelectItem>
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
                        disabled={!selectedBank || !mandateAccepted}
                      >
                        Authorize & Setup Mandate
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
