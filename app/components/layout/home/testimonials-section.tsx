"use client"

import { useState } from "react"
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { cn } from "@/app/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Adaobi Nwosu",
    role: "Web Developer",
    course: "Full Stack Development",
    image: null,
    rating: 5,
    text: "Learn Flex made it possible for me to afford the web development course I always wanted. The installment plan was a game-changer. Now I'm working as a junior developer!",
  },
  {
    id: 2,
    name: "Emeka Okonkwo",
    role: "Digital Marketer",
    course: "Digital Marketing Masterclass",
    image: null,
    rating: 5,
    text: "The quality of courses on Learn Flex is exceptional. I completed my digital marketing certification and landed my dream job within 3 months. Highly recommended!",
  },
  {
    id: 3,
    name: "Fatima Ibrahim",
    role: "Photographer",
    course: "Professional Photography",
    image: null,
    rating: 5,
    text: "Being able to learn at my own pace while paying in installments was perfect for me. The photography course was comprehensive and the provider was very supportive.",
  },
  {
    id: 4,
    name: "Chukwuma Eze",
    role: "Electrician",
    course: "Electrical Installation",
    image: null,
    rating: 4,
    text: "I finally got my electrical certification through Learn Flex. The offline training was hands-on and practical. The flexible payment really helped me manage my finances.",
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              What Our Learners Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from real learners who have transformed their careers through Learn Flex courses.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={100}>
            <div className="relative bg-card rounded-3xl p-8 md:p-12 border border-border shadow-xl">
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Quote className="w-6 h-6 text-primary" />
              </div>

              {/* Testimonial Content */}
              <div className="pt-8">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < testimonials[activeIndex].rating
                          ? "text-yellow-500 fill-current"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>

                {/* Text */}
                <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">
                  {'"'}{testimonials[activeIndex].text}{'"'}
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[activeIndex].name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonials[activeIndex].name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonials[activeIndex].role}
                      </div>
                      <div className="text-sm text-primary">
                        {testimonials[activeIndex].course}
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors btn-bouncy"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors btn-bouncy"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === activeIndex
                        ? "w-8 bg-primary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
