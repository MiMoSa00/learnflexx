"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
         <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150">
                <div className="w-full h-full border border-white/10 rounded-full animate-spin-slow" />
                <div className="absolute inset-8 border border-white/10 rounded-full animate-spin-slow" style={{ animationDirection: "reverse" }} />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Start Your Learning Journey</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>

              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Join thousands of learners who are already building new skills and 
                advancing their careers with Learn Flex. Start today with flexible 
                payment options that work for you.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/courses">
                  <BouncyButton 
                    variant="secondary" 
                    size="lg" 
                    className="gap-2 bg-white text-primary hover:bg-white/90"
                  >
                    Browse Courses
                    <ArrowRight className="w-5 h-5" />
                  </BouncyButton>
                </Link>
                <Link href="/signup">
                  <BouncyButton 
                    variant="outline" 
                    size="lg" 
                    className="gap-2 border-white text-white hover:bg-white/10"
                  >
                    Create Free Account
                  </BouncyButton>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-10 border-t border-white/20">
                <div className="flex items-center gap-2 text-white/80">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Flexible payments available</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Verified providers only</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
