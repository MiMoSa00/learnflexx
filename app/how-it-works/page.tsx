"use client"

import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import Link from "next/link"
import { 
  Search,
  MousePointer,
  CreditCard,
  BookOpen,
  CheckCircle,
  Building2,
  FileText,
  Users,
  Wallet,
  ArrowRight,
  Sparkles
} from "lucide-react"

const learnerSteps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse our extensive catalog of courses from verified training providers across Nigeria.",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: MousePointer,
    title: "Choose",
    description: "Select a course that matches your goals. Compare prices, duration, and payment options.",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    icon: CreditCard,
    title: "Enroll",
    description: "Pay in full or choose a flexible installment plan. Set up easy direct debit for automatic payments.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: BookOpen,
    title: "Learn",
    description: "Access your course online or attend in-person. Receive guidance and support throughout your journey.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: CheckCircle,
    title: "Succeed",
    description: "Complete your course, earn your certificate, and advance your career with new skills.",
    color: "from-yellow-500 to-yellow-600"
  }
]

const providerSteps = [
  {
    icon: FileText,
    title: "Apply",
    description: "Submit your application with your business details and course offerings.",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: CheckCircle,
    title: "Get Verified",
    description: "Our team reviews your credentials and verifies your business within 7-14 days.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: BookOpen,
    title: "List Courses",
    description: "Create your course listings with details, pricing, and availability.",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    icon: Users,
    title: "Attract Learners",
    description: "Reach thousands of potential students through our marketing and discovery features.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Wallet,
    title: "Get Paid",
    description: "Receive monthly settlements directly to your bank account. We handle all payment collection.",
    color: "from-yellow-500 to-yellow-600"
  }
]

const benefits = {
  learners: [
    "Flexible payment plans (2-6 months)",
    "Verified training providers",
    "Secure bank-grade payments",
    "Wide course selection",
    "Email & SMS reminders",
    "24/7 support access"
  ],
  providers: [
    "Reach more students",
    "Guaranteed monthly settlements",
    "No upfront costs",
    "Easy course management",
    "Payment collection handled",
    "Marketing support"
  ]
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal direction="down" delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Simple & Easy
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">How </span>
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                LearnFlex
              </span>
              <span className="text-foreground"> Works</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're a learner looking to upskill or a provider looking to reach more students, 
              we've made the process seamless.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* For Learners */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="down" delay={0}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
                <BookOpen className="w-4 h-4" />
                For Learners
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Start Learning in 5 Simple Steps
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From discovery to certification, we make your learning journey smooth and affordable
              </p>
            </div>
          </ScrollReveal>

          {/* Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-cyan-200 to-green-200 dark:from-indigo-800 dark:via-cyan-800 dark:to-green-800 hidden lg:block" style={{ transform: 'translateY(-50%)' }}></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {learnerSteps.map((step, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 100}>
                  <div className="relative text-center">
                    {/* Step Number */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-sm font-bold text-indigo-600 z-10">
                      {index + 1}
                    </div>
                    
                    {/* Card */}
                    <div className="pt-6 px-4 pb-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <ScrollReveal direction="up" delay={500}>
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {benefits.learners.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/courses">
                  <BouncyButton variant="secondary" size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                    Browse Courses
                    <ArrowRight className="w-5 h-5" />
                  </BouncyButton>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* For Providers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="down" delay={0}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
                <Building2 className="w-4 h-4" />
                For Training Providers
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Partner With Us in 5 Easy Steps
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join our network of verified providers and reach thousands of eager learners
              </p>
            </div>
          </ScrollReveal>

          {/* Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-cyan-200 to-purple-200 dark:from-green-800 dark:via-cyan-800 dark:to-purple-800 hidden lg:block" style={{ transform: 'translateY(-50%)' }}></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {providerSteps.map((step, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 100}>
                  <div className="relative text-center">
                    {/* Step Number */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-sm font-bold text-green-600 z-10">
                      {index + 1}
                    </div>
                    
                    {/* Card */}
                    <div className="pt-6 px-4 pb-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <ScrollReveal direction="up" delay={500}>
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-green-600 to-cyan-500">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {benefits.providers.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/contact">
                  <BouncyButton variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                    Become a Provider
                    <ArrowRight className="w-5 h-5" />
                  </BouncyButton>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={0}>
            <div className="text-center p-12 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Join thousands of learners and training providers on LearnFlex today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <BouncyButton variant="primary" size="lg">
                    Start Learning
                    <ArrowRight className="w-5 h-5" />
                  </BouncyButton>
                </Link>
                <Link href="/faq">
                  <BouncyButton variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    Have Questions?
                  </BouncyButton>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
