"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import Link from "next/link"
import { 
  AlertTriangle, 
  X, 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  Check, 
  Loader2,
  XCircle,
  DollarSign
} from "lucide-react"

// Mock enrollment data - replace with real data
const mockEnrollment = {
  id: "enr-123",
  courseName: "Complete Web Development Bootcamp",
  providerName: "Tech Academy Lagos",
  totalAmount: 150000,
  paidAmount: 75000,
  remainingAmount: 75000,
  installmentPlan: "4 months",
  nextPaymentDate: "2024-02-15",
  nextPaymentAmount: 37500,
  remainingInstallments: 2
}

type CancelOption = 'cancel_only' | 'pay_full' | null

function CancelInstallmentContent() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.id as string
  
  const [enrollment, setEnrollment] = useState(mockEnrollment)
  const [selectedOption, setSelectedOption] = useState<CancelOption>(null)
  const [confirmStep, setConfirmStep] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<CancelOption>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleProceed = () => {
    if (selectedOption) {
      setConfirmStep(true)
    }
  }

  const handleConfirm = async () => {
    if (!agreedToTerms) return
    
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setSuccess(selectedOption)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <ScrollReveal direction="up" delay={0}>
          <Card className="max-w-md mx-auto border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                success === 'pay_full' 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-yellow-100 dark:bg-yellow-900/30'
              }`}>
                {success === 'pay_full' ? (
                  <Check className="w-10 h-10 text-green-500" />
                ) : (
                  <XCircle className="w-10 h-10 text-yellow-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {success === 'pay_full' ? 'Payment Complete!' : 'Mandate Cancelled'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {success === 'pay_full' 
                  ? 'Your course payment has been completed. You now have full lifetime access.'
                  : 'Your installment mandate has been cancelled. Your course access is now limited.'}
              </p>
              <Link href="/dashboard/courses">
                <BouncyButton variant="primary" className="w-full">
                  Return to My Courses
                </BouncyButton>
              </Link>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <ScrollReveal direction="down" delay={0}>
          <Link href={`/dashboard/courses`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to My Courses
          </Link>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal direction="down" delay={50}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cancel Installment Plan</h1>
                <p className="text-muted-foreground text-sm">{enrollment.courseName}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {!confirmStep ? (
          <>
            {/* Current Plan Summary */}
            <ScrollReveal direction="up" delay={100}>
              <Card className="border-0 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Current Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-bold text-foreground">{formatCurrency(enrollment.totalAmount)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <p className="text-muted-foreground">Paid So Far</p>
                      <p className="font-bold text-green-600">{formatCurrency(enrollment.paidAmount)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-bold text-yellow-600">{formatCurrency(enrollment.remainingAmount)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-muted-foreground">Installments Left</p>
                      <p className="font-bold text-foreground">{enrollment.remainingInstallments}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Options */}
            <ScrollReveal direction="up" delay={150}>
              <Card className="border-0 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Choose an Option</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Option 1: Cancel Only */}
                  <button
                    onClick={() => setSelectedOption('cancel_only')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedOption === 'cancel_only'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedOption === 'cancel_only' ? 'bg-yellow-500' : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <X className={`w-5 h-5 ${selectedOption === 'cancel_only' ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">Cancel Installment Only</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Stop future automatic payments. You'll lose access to remaining course content 
                          but keep access to content you've already unlocked.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-yellow-600 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          Course access will be limited
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Pay Full */}
                  <button
                    onClick={() => setSelectedOption('pay_full')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedOption === 'pay_full'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedOption === 'pay_full' ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <DollarSign className={`w-5 h-5 ${selectedOption === 'pay_full' ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-foreground">Pay Remaining Balance</h3>
                          <span className="font-bold text-green-600">{formatCurrency(enrollment.remainingAmount)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay off the remaining balance now and cancel the installment mandate. 
                          Get full lifetime access to all course content.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                          <Check className="w-4 h-4" />
                          Full course access guaranteed
                        </div>
                      </div>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Action Button */}
            <ScrollReveal direction="up" delay={200}>
              <BouncyButton
                variant="primary"
                onClick={handleProceed}
                disabled={!selectedOption}
                className="w-full"
              >
                Continue
              </BouncyButton>
            </ScrollReveal>
          </>
        ) : (
          // Confirmation Step
          <ScrollReveal direction="up" delay={0}>
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {selectedOption === 'pay_full' ? (
                    <>
                      <DollarSign className="w-5 h-5 text-green-500" />
                      Confirm Payment
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      Confirm Cancellation
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedOption === 'pay_full' ? (
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                    <p className="font-semibold text-foreground mb-2">You are about to pay:</p>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(enrollment.remainingAmount)}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This will complete your payment and give you lifetime access to the course.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                    <p className="font-semibold text-foreground mb-2">Important:</p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Your mandate will be cancelled immediately</li>
                      <li>• No further automatic payments will be made</li>
                      <li>• You'll lose access to locked course content</li>
                      <li>• Outstanding balance of {formatCurrency(enrollment.remainingAmount)} remains unpaid</li>
                    </ul>
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-muted-foreground">
                    I understand the consequences and agree to proceed with this action.
                  </span>
                </label>

                <div className="flex gap-3">
                  <BouncyButton
                    variant="outline"
                    onClick={() => setConfirmStep(false)}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                  </BouncyButton>
                  <BouncyButton
                    variant={selectedOption === 'pay_full' ? 'primary' : 'secondary'}
                    onClick={handleConfirm}
                    disabled={!agreedToTerms || loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : selectedOption === 'pay_full' ? (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pay Now
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Cancel Mandate
                      </>
                    )}
                  </BouncyButton>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}

export default function CancelInstallmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <CancelInstallmentContent />
    </Suspense>
  )
}
