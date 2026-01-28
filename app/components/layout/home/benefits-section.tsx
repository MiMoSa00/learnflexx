"use client"

import { Shield, CreditCard, Award, Clock, Users, Headphones } from "lucide-react"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"

const benefits = [
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Pay in installments over 2, 3, 4, or 6 months. Make learning affordable with our flexible payment plans.",
  },
  {
    icon: Shield,
    title: "Verified Providers",
    description: "All training providers are thoroughly vetted and verified to ensure you get quality education.",
  },
  {
    icon: Award,
    title: "Wide Selection",
    description: "Choose from over 1,000 courses across multiple categories from digital skills to vocational training.",
  },
  {
    icon: Clock,
    title: "Learn Your Way",
    description: "Online, offline, or hybrid options. Choose the learning mode that fits your lifestyle and schedule.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a community of learners. Connect, share, and grow together with fellow students.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our support team is always ready to help you with any questions or issues you might have.",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <ScrollReveal direction="left">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
                Everything You Need to 
                <span className="text-primary"> Succeed</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Learn Flex is designed to make quality education accessible to everyone. 
                We partner with the best training providers and offer flexible payment 
                options so you can focus on what matters most - learning.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "1000+", label: "Courses" },
                  { value: "50+", label: "Providers" },
                  { value: "5000+", label: "Learners" },
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-muted/50 rounded-xl">
                    <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Content - Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 100}>
                <div className="group p-5 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
