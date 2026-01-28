"use client"

import Link from "next/link"
import Image from "next/image"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"

const footerLinks = {
  forLearners: [
    { name: "Browse Courses", href: "/courses" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Payment Options", href: "/how-it-works#payments" },
    { name: "FAQs", href: "/faq" },
  ],
  forProviders: [
    { name: "Become a Provider", href: "/providers" },
    { name: "Provider Dashboard", href: "/provider/dashboard" },
    { name: "Settlements", href: "/provider/settlements" },
    { name: "Provider FAQs", href: "/faq#providers" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="bg-slate text-slate-foreground mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <ScrollReveal direction="up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  Stay updated with LearnFlex
                </h3>
                <p className="text-sm sm:text-base text-white/70">
                  Get the latest courses and learning tips delivered to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 w-full sm:min-w-64 text-sm sm:text-base h-10 sm:h-11"
                />
                <Button className="btn-bouncy bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap text-sm sm:text-base h-10 sm:h-11">
                  Subscribe
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-3 sm:px-4 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="up">
              <Link href="/" className="inline-block mb-4 sm:mb-6">
                <div className="relative w-32 h-10 sm:w-40 sm:h-12 md:w-48 md:h-14 hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/flexlogo.jpeg"
                    alt="LearnFlex Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
              <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6 leading-relaxed">
                Connecting learners with verified training providers. Discover courses, 
                enroll with flexible payments, and unlock your potential.
              </p>
              <div className="flex flex-col gap-2 sm:gap-3 text-sm sm:text-base text-white/70">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                  <span className="break-all">hello@learnflex.com</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                  <span>+234 800 LEARN FLEX</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Links Columns */}
          <div>
            <ScrollReveal direction="up" delay={100}>
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">For Learners</h4>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {footerLinks.forLearners.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm sm:text-base text-white/70 hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal direction="up" delay={200}>
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">For Providers</h4>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {footerLinks.forProviders.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm sm:text-base text-white/70 hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal direction="up" delay={300}>
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm sm:text-base text-white/70 hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal direction="up" delay={400}>
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm sm:text-base text-white/70 hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-white/50 text-xs sm:text-sm text-center md:text-left">
              &copy; 2024 LearnFlex. All rights reserved.
            </p>
            <div className="flex items-center gap-2 sm:gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-slate transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}