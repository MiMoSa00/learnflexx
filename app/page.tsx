// import { Header } from "@/app/components/layout/header"
// import { Footer } from "@/app/components/layout/footer"
import { HeroSection } from "@/app/components/layout/home/hero-section"
import { CategoriesSection } from "@/app/components/layout/home/categories-section"
import { FeaturedCourses } from "@/app/components/layout/home/featured-courses"
import { HowItWorks } from "@/app/components/layout/home/how-it-works"
import { BenefitsSection } from "@/app/components/layout/home/benefits-section"
import { StatsSection } from "@/app/components/layout/home/stats-section"
import { TestimonialsSection } from "@/app/components/layout/home/testimonials-section"
import { CTASection } from "@/app/components/layout/home/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      {/* <Header /> */}
      <main className="flex-1 w-full space-y-2 sm:space-y-3 md:space-y-4">
        {/* Minimal spacing: 0.5rem on mobile, 0.75rem on sm, 1rem on md */}
        <HeroSection />
        <CategoriesSection />
        <FeaturedCourses />
        <HowItWorks />
        <BenefitsSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      {/* <Footer /> */}
    </div>
  )
}