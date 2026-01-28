"use client"

import Link from "next/link"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
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
        <div className="container mx-auto px-4 py-12">
          <ScrollReveal direction="up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 rounded-2xl p-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Stay updated with Learn Flex
                </h3>
                <p className="text-white/70">
                  Get the latest courses and learning tips delivered to your inbox.
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                 className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-w-64"
                />
                <Button className="btn-bouncy bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="up">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-white">
                  Learn<span className="text-accent">Flex</span>
                </span>
              </Link>
              <p className="text-white/70 mb-6 leading-relaxed">
                Connecting learners with verified training providers. Discover courses, 
                enroll with flexible payments, and unlock your potential.
              </p>
              <div className="flex flex-col gap-3 text-white/70">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent" />
                  <span>hello@learnflex.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent" />
                  <span>+234 800 LEARN FLEX</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Links Columns */}
          <div>
            <ScrollReveal direction="up" delay={100}>
              <h4 className="font-semibold text-white mb-4">For Learners</h4>
              <ul className="flex flex-col gap-3">
                {footerLinks.forLearners.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-accent transition-colors"
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
              <h4 className="font-semibold text-white mb-4">For Providers</h4>
              <ul className="flex flex-col gap-3">
                {footerLinks.forProviders.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-accent transition-colors"
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
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="flex flex-col gap-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-accent transition-colors"
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
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="flex flex-col gap-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-accent transition-colors"
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              2024 Learn Flex. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-slate transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
