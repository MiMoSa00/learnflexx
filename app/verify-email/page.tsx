"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card, CardContent } from "@/app/components/ui/card"
import Link from "next/link"
import { Mail, Loader2, Check, AlertCircle, ArrowRight, RefreshCw } from "lucide-react"

function VerifyEmailContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("")
  const [resending, setResending] = useState(false)

  useEffect(() => {
    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setEmail(user.email || "")
        
        if (user.email_confirmed_at) {
          setStatus('success')
          setTimeout(() => router.push('/dashboard'), 3000)
        } else {
          setStatus('pending')
        }
      } else {
        // Check for error in URL params
        const errorParam = searchParams.get('error')
        if (errorParam) {
          setStatus('error')
          setError(errorParam === 'access_denied' ? 'Verification link has expired' : 'Verification failed')
        } else {
          setStatus('pending')
        }
      }
    }

    checkVerification()
  }, [supabase, searchParams, router])

  const handleResendEmail = async () => {
    if (!email) {
      setError("No email found. Please log in again.")
      return
    }

    setResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) throw error

      setStatus('pending')
      setError(null)
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <ScrollReveal direction="down" delay={0}>
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              status === 'success' 
                ? 'bg-gradient-to-br from-green-500 to-emerald-400' 
                : status === 'error'
                ? 'bg-gradient-to-br from-red-500 to-orange-400'
                : 'bg-gradient-to-br from-indigo-500 to-cyan-400'
            }`}>
              {status === 'loading' ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : status === 'success' ? (
                <Check className="w-8 h-8 text-white" />
              ) : status === 'error' ? (
                <AlertCircle className="w-8 h-8 text-white" />
              ) : (
                <Mail className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              {status === 'success' ? 'Email Verified!' 
                : status === 'error' ? 'Verification Failed'
                : 'Verify Your Email'}
            </h1>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              {status === 'loading' && (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Checking verification status...</p>
                </div>
              )}

              {status === 'success' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">You're All Set!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your email has been verified successfully.<br />
                    Redirecting to dashboard...
                  </p>
                  <Link href="/dashboard">
                    <BouncyButton variant="primary" className="w-full">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </BouncyButton>
                  </Link>
                </div>
              )}

              {status === 'error' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Verification Failed</h3>
                  <p className="text-muted-foreground mb-6">
                    {error || "We couldn't verify your email. The link may have expired."}
                  </p>
                  <BouncyButton
                    variant="primary"
                    onClick={handleResendEmail}
                    disabled={resending}
                    className="w-full mb-4"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Resend Verification Email
                      </>
                    )}
                  </BouncyButton>
                  <Link href="/login">
                    <BouncyButton variant="outline" className="w-full">
                      Back to Login
                    </BouncyButton>
                  </Link>
                </div>
              )}

              {status === 'pending' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Check Your Inbox</h3>
                  <p className="text-muted-foreground mb-2">
                    We've sent a verification link to:
                  </p>
                  <p className="font-semibold text-foreground mb-6">{email || 'your email'}</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Click the link in the email to verify your account.<br />
                    Don't see it? Check your spam folder.
                  </p>
                  <BouncyButton
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={resending}
                    className="w-full mb-4"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Resend Email
                      </>
                    )}
                  </BouncyButton>
                  <Link href="/login">
                    <p className="text-sm text-indigo-600 hover:underline">Back to Login</p>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
