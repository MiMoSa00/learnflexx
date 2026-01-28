"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ArrowRight, Sparkles, Play } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui"
import { TypewriterMultiple } from "@/app/components/layout/animations/typewriter"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"

const searchSuggestions = [
  "Web Development",
  "Data Science",
  "UI/UX Design",
  "Digital Marketing",
  "Photography",
]

const typewriterTexts = [
  "Web Development",
  "Data Science",
  "Digital Marketing",
  "UI/UX Design",
  "Photography",
]

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(63, 81, 181, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(63, 81, 181, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <ScrollReveal direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Over 1,000+ courses available</span>
              </div>
            </ScrollReveal>

            {/* Headline with Typewriter */}
            <ScrollReveal direction="up" delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                <span className="block">Discover courses,</span>
                <span className="block">
                  learn{" "}
                  <span className="text-primary">
                    <TypewriterMultiple
                      texts={typewriterTexts}
                      speed={80}
                      pauseBetween={2500}
                      delay={1000}
                    />
                  </span>
                </span>
              </h1>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction="up" delay={200}>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Find the perfect course from verified providers. Enjoy flexible payment 
                options including installments, and unlock your potential with quality education.
              </p>
            </ScrollReveal>

            {/* Search Bar */}
            <ScrollReveal direction="up" delay={300}>
              <div className="relative mb-6 w-full">
                <div 
                  className={`relative flex items-center bg-card border-2 rounded-2xl shadow-lg transition-all duration-300 ${
                    isFocused ? "border-primary shadow-primary/20" : "border-border"
                  }`}
                >
                  <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for courses, skills, or providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      setIsFocused(true)
                      setShowSuggestions(true)
                    }}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="pl-12 pr-4 py-6 text-sm sm:text-base lg:text-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Link href={`/courses?q=${searchQuery}`}>
                    <BouncyButton
                      variant="primary"
                      size="md"
                      className="mr-2"
                    >
                      Search
                    </BouncyButton>
                  </Link>
                </div>

                {/* Search Suggestions */}
                {isFocused && showSuggestions && (
                  <div className="absolute top-full left-0 mt-2 bg-card border-2 border-primary rounded-xl shadow-2xl p-4 animate-slide-up z-50 w-80 sm:w-96">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-muted-foreground">Popular searches:</p>
                      <button
                        onClick={() => setShowSuggestions(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg shrink-0"
                        aria-label="Close suggestions"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setSearchQuery(suggestion)}
                          className="px-3 py-1.5 text-xs sm:text-sm bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105 whitespace-nowrap"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal direction="up" delay={400}>
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4">
                <Link href="/courses" className="w-full sm:w-auto">
                  <BouncyButton variant="primary" size="lg" className="gap-2 w-full sm:w-auto">
                    Browse Courses
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                  </BouncyButton>
                </Link>
                <Link href="/how-it-works" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2 btn-bouncy border-2 bg-transparent w-full sm:w-auto"
                  >
                    <Play className="w-4 h-4" />
                    How It Works
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Trust Indicators */}
            <ScrollReveal direction="up" delay={500}>
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-6 mt-10 pt-10 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">5,000+</span> learners enrolled
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                    <span className="font-semibold text-foreground">4.8</span> average rating
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Content - Animated Illustration */}
          <div className="hidden lg:block relative">
            <ScrollReveal direction="right" delay={200}>
              <div className="relative">
                {/* Main Card */}
                <div className="relative bg-card rounded-3xl p-8 shadow-2xl border border-border animate-float">
                  <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center animate-bounce-rotate">
                        <svg className="w-12 h-12 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-foreground">Start Learning Today</p>
                      <p className="text-sm text-muted-foreground">1000+ courses available</p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-accent text-accent-foreground px-4 py-2 rounded-xl shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                  <p className="text-sm font-semibold">Flexible Payments</p>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-card border border-border px-4 py-3 rounded-xl shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Verified Providers</p>
                      <p className="text-xs text-muted-foreground">Quality assured</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-8 bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-lg animate-float" style={{ animationDelay: "1.5s" }}>
                  <p className="text-sm font-semibold">Pay in Installments</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
