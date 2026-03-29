"use client"

import { ScrollReveal, StaggerReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { AnimatedCounter } from "@/app/components/layout/animations/animated-counter"
import Link from "next/link"
import { 
  Target, 
  Heart, 
  Shield, 
  Zap, 
  Users, 
  BookOpen, 
  Building2,
  ArrowRight,
  Linkedin,
  Twitter,
  Star
} from "lucide-react"

const stats = [
  { value: 5000, label: "Learners Enrolled", suffix: "+" },
  { value: 150, label: "Courses Available", suffix: "+" },
  { value: 50, label: "Training Providers", suffix: "+" },
  { value: 98, label: "Satisfaction Rate", suffix: "%" },
]

const values = [
  {
    icon: Target,
    title: "Accessibility",
    description: "Making quality education accessible to everyone through flexible payment options.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30"
  },
  {
    icon: Heart,
    title: "Empowerment",
    description: "Empowering Nigerians to acquire new skills and advance their careers.",
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30"
  },
  {
    icon: Shield,
    title: "Trust",
    description: "Building trust through verified providers and secure payment processing.",
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Continuously improving our platform to serve learners better.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
  }
]

const team = [
  {
    name: "Adebayo Ogunlesi",
    role: "Founder & CEO",
    image: null,
    initials: "AO",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Chioma Nwosu",
    role: "Head of Operations",
    image: null,
    initials: "CN",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Emeka Okonkwo",
    role: "Lead Developer",
    image: null,
    initials: "EO",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Fatima Ibrahim",
    role: "Head of Partnerships",
    image: null,
    initials: "FI",
    linkedin: "#",
    twitter: "#"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Democratizing Education
              </span>
              <br />
              <span className="text-foreground">Across Nigeria</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={100}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              LearnFlex is on a mission to make quality education accessible to every Nigerian 
              through flexible payment options and verified training providers.
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <BouncyButton variant="primary" size="lg">
                  Start Learning
                  <ArrowRight className="w-5 h-5" />
                </BouncyButton>
              </Link>
              <Link href="/contact">
                <BouncyButton variant="outline" size="lg">
                  Partner With Us
                </BouncyButton>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-cyan-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 100}>
                <div className="text-center text-white">
                  <div className="text-4xl sm:text-5xl font-bold mb-2">
                    <AnimatedCounter end={stat.value} duration={2000} />
                    {stat.suffix}
                  </div>
                  <p className="text-white/80">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" delay={0}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    LearnFlex was born from a simple observation: too many talented Nigerians 
                    were missing out on career-changing education because of financial barriers.
                  </p>
                  <p>
                    We saw brilliant minds unable to afford upfront course fees, even though they 
                    could manage smaller, spread-out payments. We saw training providers struggling 
                    to fill seats because of payment friction.
                  </p>
                  <p>
                    In 2024, we launched LearnFlex to bridge this gap. By partnering with banks 
                    and training providers, we created a platform where learners can enroll in 
                    courses and pay in affordable installments.
                  </p>
                  <p className="font-semibold text-foreground">
                    Today, we're proud to have helped thousands of Nigerians upgrade their skills 
                    and advance their careers.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="right" delay={100}>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-1">
                  <div className="w-full h-full rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <div className="text-center p-8">
                      <BookOpen className="w-24 h-24 text-indigo-500 mx-auto mb-4" />
                      <p className="text-2xl font-bold text-foreground">Learn Today,</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                        Pay Flexibly
                      </p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-2xl -z-10 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-cyan-400 rounded-xl -z-10 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="down" delay={0}>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do at LearnFlex
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 100}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                  <div className={`w-14 h-14 rounded-xl ${value.bgColor} flex items-center justify-center mb-4`}>
                    <value.icon className={`w-7 h-7 ${value.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="down" delay={0}>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Passionate individuals working to transform education in Nigeria
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 100}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    {member.initials}
                  </div>
                  <h3 className="font-bold text-foreground">{member.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{member.role}</p>
                  <div className="flex justify-center gap-3">
                    <a href={member.linkedin} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                      <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </a>
                    <a href={member.twitter} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors">
                      <Twitter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <ScrollReveal direction="up" delay={0}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerians who are upgrading their skills with flexible payments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <BouncyButton variant="secondary" size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </BouncyButton>
              </Link>
              <Link href="/courses">
                <BouncyButton variant="ghost" size="lg" className="border-2 border-white text-white hover:bg-white/10">
                  Browse Courses
                </BouncyButton>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
