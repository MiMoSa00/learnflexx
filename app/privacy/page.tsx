"use client"

import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { Card, CardContent } from "@/app/components/ui/card"
import Link from "next/link"
import { Shield, ChevronRight } from "lucide-react"

const sections = [
  { id: "collection", title: "1. Information We Collect" },
  { id: "use", title: "2. How We Use Your Information" },
  { id: "sharing", title: "3. Information Sharing" },
  { id: "security", title: "4. Data Security" },
  { id: "cookies", title: "5. Cookies & Tracking" },
  { id: "rights", title: "6. Your Rights (NDPR)" },
  { id: "retention", title: "7. Data Retention" },
  { id: "children", title: "8. Children's Privacy" },
  { id: "changes", title: "9. Policy Changes" },
  { id: "contact", title: "10. Contact Us" },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="down" delay={0}>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-cyan-500 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2024 • NDPR Compliant
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
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-green-500 py-1.5 transition-colors"
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
                    LearnFlex is committed to protecting your privacy. This policy explains how we collect, 
                    use, and safeguard your personal information in compliance with the Nigeria Data Protection Regulation (NDPR).
                  </p>

                  <section id="collection" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
                    <p className="text-muted-foreground">We collect the following types of information:</p>
                    <h4 className="font-semibold text-foreground">Personal Information</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Full name and contact details (email, phone number)</li>
                      <li>Location (city/state)</li>
                      <li>Bank account details for direct debit</li>
                      <li>BVN (for bank verification only)</li>
                    </ul>
                    <h4 className="font-semibold text-foreground">Usage Information</h4>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Course enrollment and progress data</li>
                      <li>Payment history and transaction records</li>
                      <li>Device information and IP address</li>
                      <li>Browser type and settings</li>
                    </ul>
                  </section>

                  <section id="use" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">2. How We Use Your Information</h2>
                    <p className="text-muted-foreground">We use your information to:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>Process course enrollments and payments</li>
                      <li>Provide customer support</li>
                      <li>Send payment reminders and course updates</li>
                      <li>Improve our platform and services</li>
                      <li>Comply with legal obligations</li>
                      <li>Prevent fraud and maintain security</li>
                    </ul>
                  </section>

                  <section id="sharing" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">3. Information Sharing</h2>
                    <p className="text-muted-foreground">We share your information only with:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Training Providers:</strong> Name and contact details for enrolled courses</li>
                      <li><strong>Payment Partners:</strong> Bank details for transaction processing</li>
                      <li><strong>Service Providers:</strong> Email, SMS, and hosting services</li>
                      <li><strong>Legal Authorities:</strong> When required by law</li>
                    </ul>
                    <p className="text-muted-foreground">We never sell your personal data to third parties.</p>
                  </section>

                  <section id="security" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">4. Data Security</h2>
                    <p className="text-muted-foreground">We implement industry-standard security measures:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li>256-bit encryption for data transmission</li>
                      <li>Secure data storage on protected servers</li>
                      <li>Regular security audits and monitoring</li>
                      <li>Access controls and authentication protocols</li>
                    </ul>
                  </section>

                  <section id="cookies" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">5. Cookies & Tracking</h2>
                    <p className="text-muted-foreground">
                      We use cookies and similar technologies to enhance your experience. These include:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Essential cookies:</strong> Required for basic functionality</li>
                      <li><strong>Analytics cookies:</strong> Help us understand usage patterns</li>
                      <li><strong>Preference cookies:</strong> Remember your settings</li>
                    </ul>
                    <p className="text-muted-foreground">You can manage cookies through your browser settings.</p>
                  </section>

                  <section id="rights" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">6. Your Rights (NDPR)</h2>
                    <p className="text-muted-foreground">Under the Nigeria Data Protection Regulation, you have the right to:</p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      <li><strong>Access:</strong> Request a copy of your personal data</li>
                      <li><strong>Rectification:</strong> Correct inaccurate information</li>
                      <li><strong>Erasure:</strong> Request deletion of your data</li>
                      <li><strong>Portability:</strong> Receive your data in a portable format</li>
                      <li><strong>Object:</strong> Opt out of certain data processing</li>
                      <li><strong>Withdraw Consent:</strong> Revoke previously given consent</li>
                    </ul>
                    <p className="text-muted-foreground">
                      To exercise these rights, contact us at privacy@learnflex.ng or through Dashboard {">"} Settings.
                    </p>
                  </section>

                  <section id="retention" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">7. Data Retention</h2>
                    <p className="text-muted-foreground">
                      We retain your data for as long as your account is active or as needed to provide services. 
                      Financial records are kept for 7 years as required by Nigerian tax law. 
                      You can request data deletion at any time, subject to legal requirements.
                    </p>
                  </section>

                  <section id="children" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">8. Children's Privacy</h2>
                    <p className="text-muted-foreground">
                      LearnFlex is not intended for users under 18 years of age. We do not knowingly collect 
                      personal information from children. If we become aware that we have collected data from 
                      a child, we will delete it promptly.
                    </p>
                  </section>

                  <section id="changes" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">9. Policy Changes</h2>
                    <p className="text-muted-foreground">
                      We may update this Privacy Policy periodically. We will notify you of significant changes 
                      via email or platform notification. Continued use after changes constitutes acceptance.
                    </p>
                  </section>

                  <section id="contact" className="scroll-mt-24">
                    <h2 className="text-xl font-bold text-foreground">10. Contact Us</h2>
                    <p className="text-muted-foreground">For privacy-related questions or to exercise your rights:</p>
                    <ul className="list-none text-muted-foreground space-y-1">
                      <li><strong>Data Protection Officer:</strong> dpo@learnflex.ng</li>
                      <li><strong>General Privacy:</strong> privacy@learnflex.ng</li>
                      <li><strong>Address:</strong> Victoria Island, Lagos, Nigeria</li>
                    </ul>
                  </section>
                </CardContent>
              </Card>

              {/* Related Links */}
              <div className="flex flex-wrap gap-4">
                <Link href="/terms" className="text-green-600 hover:underline">Terms of Service →</Link>
                <Link href="/refund-policy" className="text-green-600 hover:underline">Refund Policy →</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
