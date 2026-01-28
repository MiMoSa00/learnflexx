"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
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
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Chrome,
} from "lucide-react"
import { cn } from "@/app/lib/utils"

// Mock course data (in real app, fetch from API)
const courseData: Record<string, {
  title: string
  provider: string
  price: number
  originalPrice?: number
}> = {
  "1": {
    title: "Full Stack Web Development Bootcamp",
    provider: "TechHub Academy",
    price: 150000,
    originalPrice: 200000,
  },
  "2": {
    title: "Professional Photography Masterclass",
    provider: "Creative Vision Studios",
    price: 85000,
  },
  "5": {
    title: "Business Management Certificate",
    provider: "Executive Learning",
    price: 120000,
    originalPrice: 150000,
  },
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

export default function CheckoutLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams?.get('course') || "1"
  
  const [activeForm, setActiveForm] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const course = courseData[courseId as keyof typeof courseData]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push(`/checkout/review?course=${courseId}`)
    }, 1500)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push(`/checkout/review?course=${courseId}`)
    }, 1500)
  }

  const handleSocialLogin = (provider: string) => {
    setLoading(true)
    // In real app: signIn(provider, { callbackUrl: `/checkout/review?course=${courseId}` })
    setTimeout(() => {
      setLoading(false)
      router.push(`/checkout/review?course=${courseId}`)
    }, 1500)
  }

  return (
    <main className="min-h-screen py-6 md:py-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <ScrollReveal direction="left">
          <Link href={`/course-details/${courseId}`}>
            <BouncyButton variant="ghost" className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Course
            </BouncyButton>
          </Link>
        </ScrollReveal>

        {/* Progress Indicator */}
        <ScrollReveal direction="up">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="hidden sm:inline text-sm font-medium text-primary">Login</span>
              </div>
              <div className="w-12 md:w-24 h-0.5 bg-muted"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <span className="hidden sm:inline text-sm text-muted-foreground">Review</span>
              </div>
              <div className="w-12 md:w-24 h-0.5 bg-muted"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <span className="hidden sm:inline text-sm text-muted-foreground">Payment</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">Step 1 of 3</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="up" delay={100}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {activeForm === "login" ? "Welcome Back!" : "Create Your Account"}
                  </CardTitle>
                  <CardDescription>
                    {activeForm === "login" 
                      ? "Sign in to continue with your enrollment"
                      : "Sign up to start your learning journey"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Social Login */}
                  <div className="space-y-3">
                    <BouncyButton
                      variant="outline"
                      className="w-full h-12"
                      onClick={() => handleSocialLogin('google')}
                      disabled={loading}
                    >
                      <Chrome className="w-5 h-5 mr-2" />
                      Continue with Google
                    </BouncyButton>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  {/* Login Form */}
                  {activeForm === "login" && (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            value={loginData.email}
                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-muted-foreground">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>

                      <BouncyButton
                        type="submit"
                        variant="primary"
                        className="w-full h-12 text-lg"
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign In"}
                      </BouncyButton>

                      <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setActiveForm("signup")}
                          className="text-primary hover:underline font-medium"
                        >
                          Sign up
                        </button>
                      </p>
                    </form>
                  )}

                  {/* Signup Form */}
                  {activeForm === "signup" && (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="firstName"
                              placeholder="John"
                              className="pl-10"
                              value={signupData.firstName}
                              onChange={(e) => setSignupData({...signupData, firstName: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              className="pl-10"
                              value={signupData.lastName}
                              onChange={(e) => setSignupData({...signupData, lastName: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            value={signupData.email}
                            onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+234 800 000 0000"
                            className="pl-10"
                            value={signupData.phone}
                            onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            value={signupData.password}
                            onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <BouncyButton
                        type="submit"
                        variant="primary"
                        className="w-full h-12 text-lg"
                        disabled={loading}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </BouncyButton>

                      <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setActiveForm("login")}
                          className="text-primary hover:underline font-medium"
                        >
                          Sign in
                        </button>
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Sidebar - Course Summary */}
          <div className="lg:col-span-1">
            <ScrollReveal direction="up" delay={150}>
              <div className="sticky top-24">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {course?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {course?.provider}
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Course Price:</span>
                        <span className="font-semibold text-foreground">
                          {course && formatPrice(course.price)}
                        </span>
                      </div>
                      {course?.originalPrice && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Discount:</span>
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            -{formatPrice(course.originalPrice - course.price)}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        {course && formatPrice(course.price)}
                      </span>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-muted-foreground">
                        Payment plans available on the next step
                      </p>
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