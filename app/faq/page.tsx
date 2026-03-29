"use client"

import { useState } from "react"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card, CardContent } from "@/app/components/ui/card"
import Link from "next/link"
import { 
  HelpCircle,
  Search,
  ChevronDown,
  BookOpen,
  CreditCard,
  Laptop,
  Users,
  Settings,
  Shield,
  ArrowRight,
  MessageCircle
} from "lucide-react"

const faqCategories = [
  { id: "learners", icon: BookOpen, label: "For Learners", color: "text-indigo-500", bgColor: "bg-indigo-100 dark:bg-indigo-900/30" },
  { id: "providers", icon: Users, label: "For Providers", color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900/30" },
  { id: "payments", icon: CreditCard, label: "Payments", color: "text-cyan-500", bgColor: "bg-cyan-100 dark:bg-cyan-900/30" },
  { id: "technical", icon: Laptop, label: "Technical", color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  { id: "account", icon: Settings, label: "Account", color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  { id: "security", icon: Shield, label: "Security", color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-900/30" },
]

const faqs = {
  learners: [
    { q: "How do I enroll in a course?", a: "Browse our course catalog, select a course, and click 'Enroll Now'. Choose between full payment or installment plans to complete your enrollment." },
    { q: "Can I access courses offline?", a: "For online courses, you'll receive access links. For offline courses, you'll get venue details and a unique access code to present at the venue." },
    { q: "What if I'm not satisfied with a course?", a: "We offer refunds as per our refund policy. If the course hasn't started and you request within 48 hours, you're eligible for a full refund." },
    { q: "How do I get my certificate?", a: "Certificates are issued by the training provider upon successful completion. Check with your provider for specific certificate requirements." },
  ],
  providers: [
    { q: "How do I become a training provider?", a: "Apply through our provider portal. We'll review your credentials, verify your business, and onboard you to the platform within 7-14 business days." },
    { q: "What commission does LearnFlex charge?", a: "We charge a 15% platform fee on successful enrollments. This covers payment processing, marketing, and platform maintenance." },
    { q: "How often do I receive settlements?", a: "Settlements are processed monthly, typically by the 15th of the following month. You can track all settlements in your provider dashboard." },
    { q: "Can I offer my own payment plans?", a: "Currently, payment plans are standardized across the platform. We offer 2, 3, 4, and 6-month installment options for qualifying courses." },
  ],
  payments: [
    { q: "How do installment payments work?", a: "When you select an installment plan, you authorize a direct debit mandate. Payments are automatically deducted from your bank account on scheduled dates." },
    { q: "What happens if I miss a payment?", a: "You'll receive reminders before due dates. If a payment fails, you have a 7-day grace period. After that, course access may be temporarily suspended." },
    { q: "Can I pay off my installments early?", a: "Yes! You can make early payments at any time through your dashboard. There are no penalties for early payment." },
    { q: "What payment methods do you accept?", a: "We currently accept bank transfers via direct debit. Card payments and mobile money are coming soon." },
    { q: "Are there any hidden fees?", a: "No hidden fees! The price you see is what you pay. For installments, a small processing fee (typically 1-2%) may apply per payment." },
  ],
  technical: [
    { q: "I can't log in to my account", a: "Try resetting your password. If that doesn't work, ensure you're using the correct email. Contact support if issues persist." },
    { q: "My course access isn't working", a: "First, verify your payment is up to date. Then, try logging out and back in. Clear your browser cache or try a different browser." },
    { q: "How do I update my email address?", a: "Go to Dashboard > Profile. You can update your email after verifying your current one." },
    { q: "The website is loading slowly", a: "Try clearing your browser cache, disabling extensions, or using a different browser. Also ensure you have a stable internet connection." },
  ],
  account: [
    { q: "How do I change my password?", a: "Go to Dashboard > Settings > Change Password. Enter your current password and your new password to update." },
    { q: "Can I have multiple accounts?", a: "Each user should have only one account. If you need to merge accounts, contact our support team." },
    { q: "How do I delete my account?", a: "Go to Dashboard > Settings > Privacy & Security > Delete Account. Note: This is irreversible and you'll lose access to enrolled courses." },
    { q: "How do I update my phone number?", a: "Go to Dashboard > Profile and update your phone number. You may need to verify the new number via OTP." },
  ],
  security: [
    { q: "Is my payment information secure?", a: "Yes! We use bank-grade encryption and never store your full account details. All transactions are processed through secure banking channels." },
    { q: "How do you protect my data?", a: "We comply with NDPR (Nigerian Data Protection Regulation). Your data is encrypted and stored securely. Review our Privacy Policy for details." },
    { q: "What should I do if I suspect fraud?", a: "Immediately change your password and contact our support team. We take fraud seriously and will investigate promptly." },
    { q: "Can I download my data?", a: "Yes, go to Dashboard > Settings > Privacy & Security > Download My Data to get a copy of all your account data." },
  ],
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("learners")
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const currentFaqs = faqs[activeCategory as keyof typeof faqs] || []
  
  const filteredFaqs = searchQuery
    ? Object.entries(faqs).flatMap(([cat, items]) => 
        items.filter(faq => 
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(faq => ({ ...faq, category: cat }))
      )
    : currentFaqs

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="down" delay={0}>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Find answers to common questions about LearnFlex
            </p>
          </div>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal direction="up" delay={100}>
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-white dark:bg-gray-800 text-foreground shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </ScrollReveal>

        {/* Categories */}
        {!searchQuery && (
          <ScrollReveal direction="up" delay={150}>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setExpandedFAQ(null) }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* FAQs */}
        <ScrollReveal direction="up" delay={200}>
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No questions found for "{searchQuery}"</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <Card 
                  key={index} 
                  className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden"
                >
                  <button
                    className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-foreground">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${expandedFAQ === index ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {expandedFAQ === index && (
                    <CardContent className="pt-0 pb-5 px-5 border-t dark:border-gray-700">
                      <p className="text-muted-foreground pt-4 leading-relaxed">{faq.a}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal direction="up" delay={300}>
          <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500">
            <MessageCircle className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
            <p className="text-white/80 mb-6">Can't find what you're looking for? Our support team is here to help.</p>
            <Link href="/contact">
              <BouncyButton variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
                Contact Support
                <ArrowRight className="w-4 h-4" />
              </BouncyButton>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
