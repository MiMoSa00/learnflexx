"use client"

import { Search, BookOpen, CreditCard, GraduationCap } from "lucide-react"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { cn } from "@/app/lib/utils"

const steps = [
  {
    step: 1,
    title: "Discover",
    description: "Browse through our extensive catalog of courses from verified training providers. Filter by category, mode, location, and price.",
    icon: Search,
    color: "from-blue-500 to-indigo-600",
  },
  {
    step: 2,
    title: "Choose",
    description: "Find the perfect course that matches your goals. View detailed information, curriculum, and reviews from other learners.",
    icon: BookOpen,
    color: "from-purple-500 to-pink-600",
  },
  {
    step: 3,
    title: "Enroll",
    description: "Sign up and choose your payment plan. Pay in full or select flexible installments that work for your budget.",
    icon: CreditCard,
    color: "from-green-500 to-emerald-600",
  },
  {
    step: 4,
    title: "Learn",
    description: "Access your course immediately for online learning, or receive your access code for in-person sessions. Start your journey!",
    icon: GraduationCap,
    color: "from-orange-500 to-amber-600",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started with Learn Flex is easy. Follow these simple steps 
              to find and enroll in your perfect course.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-accent/40 to-primary/20 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <ScrollReveal key={step.step} direction="up" delay={index * 150}>
                <div className="relative group">
                  {/* Card */}
                  <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 text-center">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div 
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
                        `bg-gradient-to-br ${step.color}`
                      )}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (hidden on last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-4 h-4 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
