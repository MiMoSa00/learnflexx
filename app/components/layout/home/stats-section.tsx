"use client"

import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { AnimatedCounter } from "@/app/components/layout/animations/animated-counter"

const stats = [
  {
    value: 5000,
    suffix: "+",
    label: "Active Learners",
    description: "Students enrolled in courses",
  },
  {
    value: 1200,
    suffix: "+",
    label: "Courses Available",
    description: "Across multiple categories",
  },
  {
    value: 50,
    suffix: "+",
    label: "Training Providers",
    description: "Verified and trusted partners",
  },
  {
    value: 98,
    suffix: "%",
    label: "Satisfaction Rate",
    description: "Based on learner feedback",
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-slate text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by Thousands of Learners
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Join our growing community of learners who are transforming their careers 
              and lives through quality education.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100}>
              <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl sm:text-5xl font-bold text-accent mb-2">
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix} 
                    duration={2500}
                  />
                </div>
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-white/60">
                  {stat.description}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
