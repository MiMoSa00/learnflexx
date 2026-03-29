"use client"

import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { Card, CardContent } from "@/app/components/ui/card"
import Link from "next/link"
import { FileText, ChevronRight } from "lucide-react"

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "services", title: "2. Our Services" },
  { id: "accounts", title: "3. User Accounts" },
  { id: "payments", title: "4. Payments & Installments" },
  { id: "content", title: "5. Content & Intellectual Property" },
  { id: "conduct", title: "6. User Conduct" },
  { id: "providers", title: "7. Training Providers" },
  { id: "liability", title: "8. Limitation of Liability" },
  { id: "termination", title: "9. Termination" },
  { id: "changes", title: "10. Changes to Terms" },
  { id: "contact", title: "11. Contact Information" },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="down" delay={0}>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <ScrollReveal direction="left" delay={100}>
            <Card className="lg:sticky lg:top-24 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-fit">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Contents</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-indigo-500 py-1.5 transition-colors"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {section.title}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal direction="right" delay={200}>
            <div className="lg:col-span-3 space-y-8">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    Welcome to LearnFlex. By accessing or using our platform, you agree to be bound by these Terms of Service. 
                    Please read them carefully before using our services.
                  </p>

                  <section id="acceptance" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground">
                      By creating an account or using LearnFlex, you confirm that you have read, understood, and agree to these Terms. 
                      If you do not agree, you may not use our services. You must be at least 18 years old to use LearnFlex.
                    </p>
                  </section>

                  <section id="services" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">2. Our Services</h2>
                    <p className="text-muted-foreground">
                      LearnFlex is a platform that connects learners with training providers. We facilitate:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Course discovery and enrollment</li>
                      <li>Flexible payment options including installment plans</li>
                      <li>Payment processing and collection</li>
                      <li>Communication between learners and providers</li>
                    </ul>
                    <p className="text-muted-foreground">
                      We do not provide educational content directly. Training providers are responsible for course delivery and quality.
                    </p>
                  </section>

                  <section id="accounts" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">3. User Accounts</h2>
                    <p className="text-muted-foreground">
                      You are responsible for maintaining the confidentiality of your account credentials. You agree to:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Provide accurate and complete information</li>
                      <li>Update your information as needed</li>
                      <li>Notify us immediately of unauthorized access</li>
                      <li>Not share your account with others</li>
                    </ul>
                  </section>

                  <section id="payments" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">4. Payments & Installments</h2>
                    <p className="text-muted-foreground">
                      When you enroll in a course, you agree to pay the full amount either upfront or through our installment plans. 
                      For installment payments:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>You authorize us to debit your bank account on scheduled dates</li>
                      <li>Failed payments may result in temporary suspension of course access</li>
                      <li>You remain liable for all outstanding payments even if you discontinue the course</li>
                      <li>Processing fees may apply to installment payments</li>
                    </ul>
                  </section>

                  <section id="content" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">5. Content & Intellectual Property</h2>
                    <p className="text-muted-foreground">
                      All content on LearnFlex, including course materials, is owned by respective training providers or LearnFlex. 
                      You may not reproduce, distribute, or create derivative works without permission.
                    </p>
                  </section>

                  <section id="conduct" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">6. User Conduct</h2>
                    <p className="text-muted-foreground">
                      You agree not to:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Use the platform for illegal purposes</li>
                      <li>Harass other users or providers</li>
                      <li>Attempt to hack or disrupt our services</li>
                      <li>Provide false information</li>
                      <li>Violate intellectual property rights</li>
                    </ul>
                  </section>

                  <section id="providers" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">7. Training Providers</h2>
                    <p className="text-muted-foreground">
                      Training providers on our platform are independent entities. LearnFlex:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Verifies provider credentials but does not guarantee course quality</li>
                      <li>Charges a 15% platform fee on successful enrollments</li>
                      <li>Processes settlements monthly</li>
                      <li>May remove providers who violate our policies</li>
                    </ul>
                  </section>

                  <section id="liability" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">8. Limitation of Liability</h2>
                    <p className="text-muted-foreground">
                      LearnFlex is not liable for the quality of courses, actions of training providers, 
                      or any indirect damages arising from use of our platform. Our maximum liability is limited 
                      to the amount you paid for the relevant service.
                    </p>
                  </section>

                  <section id="termination" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">9. Termination</h2>
                    <p className="text-muted-foreground">
                      We may suspend or terminate your account for violation of these Terms. 
                      Upon termination, you remain liable for any outstanding payments.
                    </p>
                  </section>

                  <section id="changes" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">10. Changes to Terms</h2>
                    <p className="text-muted-foreground">
                      We may update these Terms periodically. Continued use of LearnFlex after changes constitutes acceptance. 
                      We will notify you of significant changes via email or platform notification.
                    </p>
                  </section>

                  <section id="contact" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">11. Contact Information</h2>
                    <p className="text-muted-foreground">
                      For questions about these Terms, contact us at:
                    </p>
                    <ul className="list-none text-muted-foreground space-y-1">
                      <li>Email: legal@learnflex.ng</li>
                      <li>Address: Victoria Island, Lagos, Nigeria</li>
                    </ul>
                  </section>
                </CardContent>
              </Card>

              {/* Related Links */}
              <div className="flex flex-wrap gap-4">
                <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy →</Link>
                <Link href="/refund-policy" className="text-indigo-600 hover:underline">Refund Policy →</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
