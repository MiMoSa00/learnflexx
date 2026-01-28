"use client"

import Link from "next/link"
import { 
  Code, 
  Palette, 
  TrendingUp, 
  Briefcase, 
  Camera, 
  Wrench,
  Music,
  Languages,
  ArrowRight
} from "lucide-react"
import { ScrollReveal, StaggerReveal } from "@/app/components/layout/animations/scroll-reveal"
import { cn } from "@/app/lib/utils"

const categories = [
  {
    name: "Digital Skills",
    description: "Web development, programming, IT",
    icon: Code,
    color: "from-blue-500 to-indigo-600",
    courses: 234,
    href: "/courses?category=digital-skills",
  },
  {
    name: "Creative Arts",
    description: "Design, photography, video production",
    icon: Palette,
    color: "from-pink-500 to-rose-600",
    courses: 156,
    href: "/courses?category=creative-arts",
  },
  {
    name: "Business",
    description: "Entrepreneurship, management, finance",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-600",
    courses: 189,
    href: "/courses?category=business",
  },
  {
    name: "Professional Development",
    description: "Leadership, communication, productivity",
    icon: Briefcase,
    color: "from-orange-500 to-amber-600",
    courses: 98,
    href: "/courses?category=professional",
  },
  {
    name: "Photography",
    description: "Portrait, landscape, editing",
    icon: Camera,
    color: "from-purple-500 to-violet-600",
    courses: 67,
    href: "/courses?category=photography",
  },
  {
    name: "Vocational",
    description: "Trades, crafts, technical skills",
    icon: Wrench,
    color: "from-cyan-500 to-teal-600",
    courses: 145,
    href: "/courses?category=vocational",
  },
  {
    name: "Music",
    description: "Instruments, production, theory",
    icon: Music,
    color: "from-red-500 to-pink-600",
    courses: 78,
    href: "/courses?category=music",
  },
  {
    name: "Languages",
    description: "English, French, Spanish, more",
    icon: Languages,
    color: "from-indigo-500 to-blue-600",
    courses: 112,
    href: "/courses?category=languages",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Browse Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              Explore What You Want to Learn
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From digital skills to creative arts, find courses that match your interests 
              and career goals from our wide range of categories.
            </p>
          </div>
        </ScrollReveal>

        {/* Categories Grid */}
        <StaggerReveal
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          childClassName="h-full"
          direction="up"
          staggerDelay={100}
        >
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <div className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 h-full">
                {/* Icon */}
                <div 
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                    `bg-linear-to-br ${category.color}`
                  )}
                >
                  <category.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{category.courses}</span> courses
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>

                {/* Hover Glow Effect */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10",
                  `bg-linear-to-br ${category.color}`
                )} />
              </div>
            </Link>
          ))}
        </StaggerReveal>

        {/* View All Button */}
        <ScrollReveal direction="up" delay={400}>
          <div className="text-center mt-12">
            <Link href="/courses">
              <button className="btn-bouncy inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                View All Categories
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
