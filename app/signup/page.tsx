"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Header } from "@/app/components/layout/header"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Checkbox } from "@/app/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  GraduationCap,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/app/lib/utils"
// import { setCurrentUser } from "@/app/lib/localStorage-auth"
import { createClient } from "@/app/lib/supabase/client"

const nigerianStates = [
  "Lagos",
  "Abuja",
  "Kano",
  "Rivers",
  "Oyo",
  "Kaduna",
  "Delta",
  "Enugu",
  "Anambra",
  "Ogun",
  "Edo",
  "Imo",
  "Kwara",
  "Osun",
  "Katsina",
  "Bauchi",
  "Niger",
  "Borno",
  "Benue",
  "Plateau",
]

interface PasswordStrength {
  hasMinLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
}

function getPasswordStrength(password: string): PasswordStrength {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }
}

function getStrengthScore(strength: PasswordStrength): number {
  return Object.values(strength).filter(Boolean).length
}

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthScore = getStrengthScore(passwordStrength)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (strengthScore < 4) {
      newErrors.password = "Password is not strong enough"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.location) {
      newErrors.location = "Please select your location"
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            location: formData.location,
          },
        },
      })

      if (error) {
        throw error
      }

      // Profile creation is now handled by a Database Trigger (SUPABASE_TRIGGER.sql)

      if (data.session) {
        // User is signed in
        router.push("/dashboard")
        router.refresh()
      } else if (data.user) {
        // Email confirmation required
        alert("Account created! Please check your email to confirm.")
        router.push("/login")
      }
      
    } catch (err: any) {
      setErrors({ submit: err.message || "Signup failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      // Use Supabase Google Auth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })
      
      if (error) throw error
    } catch (err: any) {
      setErrors({ submit: err.message || "Google sign-up failed." })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - Illustration */}
            <div className="hidden lg:block">
              <ScrollReveal direction="left">
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute -top-8 -left-8 w-48 sm:w-64 h-48 sm:h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
                  <div className="absolute -bottom-8 -right-8 w-48 sm:w-64 h-48 sm:h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

                  <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-border">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-primary flex items-center justify-center">
                        <GraduationCap className="w-5 sm:w-6 h-5 sm:h-6 text-primary-foreground" />
                      </div>
                      <span className="text-lg sm:text-2xl font-bold text-foreground">
                        Learn<span className="text-primary">Flex</span>
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                      Start your learning journey
                    </h2>

                    <p className="text-sm sm:text-base text-muted-foreground mb-8">
                      Join thousands of learners who are transforming their careers through quality education.
                    </p>

                    {/* Benefits */}
                    <div className="space-y-4">
                      {[
                        "Access to 1000+ verified courses",
                        "Flexible payment options",
                        "Learn at your own pace",
                        "Certificate upon completion",
                      ].map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 animate-slide-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <span className="text-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -right-4 top-1/4 bg-card px-4 py-2 rounded-xl shadow-lg border border-border animate-float">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium">5000+ Learners</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Side - Form */}
            <div>
              <ScrollReveal direction="right">
                <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-xl w-full">
                  <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                      Create your account
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/login" className="text-primary hover:underline font-medium">
                        Log in
                      </Link>
                    </p>
                  </div>

                  {errors.submit && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
                      <p className="text-xs sm:text-sm text-destructive">{errors.submit}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" className="text-xs sm:text-sm">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        className={cn("text-xs sm:text-sm py-2 sm:py-3", errors.fullName && "border-destructive")}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={cn("text-xs sm:text-sm py-2 sm:py-3", errors.email && "border-destructive")}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234 XXX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className={cn("text-xs sm:text-sm py-2 sm:py-3", errors.phone && "border-destructive")}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <Label htmlFor="location" className="text-xs sm:text-sm">Location</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value: string) => handleChange("location", value)}
                      >
                        <SelectTrigger className={cn("text-xs sm:text-sm", errors.location && "border-destructive")}>
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {nigerianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.location && (
                        <p className="text-xs text-destructive mt-1">{errors.location}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          className={cn("pr-10 text-xs sm:text-sm py-2 sm:py-3", errors.password && "border-destructive")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" /> : <Eye className="w-4 sm:w-5 h-4 sm:h-5" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-3 space-y-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={cn(
                                  "h-1 flex-1 rounded-full transition-colors",
                                  strengthScore >= level
                                    ? strengthScore <= 2
                                      ? "bg-red-500"
                                      : strengthScore === 3
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                    : "bg-muted"
                                )}
                              />
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                            {[
                              { check: passwordStrength.hasMinLength, text: "8+ characters" },
                              { check: passwordStrength.hasUppercase, text: "Uppercase" },
                              { check: passwordStrength.hasLowercase, text: "Lowercase" },
                              { check: passwordStrength.hasNumber, text: "Number" },
                            ].map((item, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "flex items-center gap-1",
                                  item.check ? "text-green-600" : "text-muted-foreground"
                                )}
                              >
                                {item.check ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <X className="w-3 h-3" />
                                )}
                                {item.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {errors.password && (
                        <p className="text-xs text-destructive mt-1">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange("confirmPassword", e.target.value)}
                          className={cn("pr-10 text-xs sm:text-sm py-2 sm:py-3", errors.confirmPassword && "border-destructive")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" /> : <Eye className="w-4 sm:w-5 h-4 sm:h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Terms */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm">
                        <Checkbox
                          checked={agreedToTerms}
                          onCheckedChange={(checked: boolean) => setAgreedToTerms(checked)}
                          className="mt-0.5"
                        />
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          I agree to the{" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </span>
                      </label>
                      {errors.terms && (
                        <p className="text-xs text-destructive mt-1">{errors.terms}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <BouncyButton
                      type="submit"
                      variant="primary"
                      className="w-full text-xs sm:text-sm py-2 sm:py-3 justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
                        </>
                      )}
                    </BouncyButton>

                    {/* Divider */}
                    <div className="relative my-4 sm:my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs sm:text-sm">
                        <span className="bg-card px-3 sm:px-4 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    {/* Google Sign Up */}
                    <button
                      type="button"
                      onClick={handleGoogleSignUp}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-xl hover:bg-muted transition-colors text-xs sm:text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 sm:w-5 h-4 sm:h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}