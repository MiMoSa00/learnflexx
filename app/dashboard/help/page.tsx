"use client"

import { useState } from "react"
import { ScrollReveal, StaggerReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { 
  HelpCircle,
  Search,
  BookOpen,
  CreditCard,
  Settings,
  Laptop,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Send,
  Mail,
  Phone,
  Check,
  Loader2
} from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    faqs: [
      {
        question: "How do I enroll in a course?",
        answer: "Browse our course catalog, select a course you're interested in, and click 'Enroll Now'. You can choose to pay in full or select an installment plan that works for you."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept bank transfers via direct debit authorization. Once you set up your mandate, payments are automatically processed according to your chosen plan."
      },
      {
        question: "How do I access my enrolled courses?",
        answer: "After successful enrollment, go to 'My Courses' in your dashboard. For online courses, you'll find access links there. For offline courses, you'll receive venue details and an access code."
      }
    ]
  },
  {
    id: "payments",
    title: "Payments & Billing",
    icon: CreditCard,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    faqs: [
      {
        question: "How do installment payments work?",
        answer: "When you choose an installment plan, you authorize a direct debit mandate. Payments are automatically deducted on your scheduled dates. You can view all upcoming payments in your dashboard."
      },
      {
        question: "Can I cancel my installment plan?",
        answer: "Yes, you can cancel your installment plan at any time. Go to 'My Courses', select the course, and choose 'Cancel Installment'. Note that canceling may affect your course access."
      },
      {
        question: "What happens if a payment fails?",
        answer: "If a payment fails, we'll notify you via email and SMS. You'll have a grace period to resolve the issue. If not resolved, your course access may be temporarily suspended."
      }
    ]
  },
  {
    id: "technical",
    title: "Technical Support",
    icon: Laptop,
    color: "text-cyan-500",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    faqs: [
      {
        question: "I can't access my online course",
        answer: "First, ensure your payment is up to date. Try logging out and back in. Clear your browser cache. If issues persist, contact our support team with your enrollment details."
      },
      {
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the login page. Enter your email address, and we'll send you a password reset link. The link expires in 24 hours."
      }
    ]
  },
  {
    id: "account",
    title: "Account Management",
    icon: Settings,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    faqs: [
      {
        question: "How do I update my profile information?",
        answer: "Go to Dashboard > Profile. Click 'Edit' to update your personal information. Remember to save your changes."
      },
      {
        question: "How do I delete my account?",
        answer: "Go to Dashboard > Settings > Privacy & Security. Click 'Delete Account'. Note that this action is irreversible and you'll lose access to all enrolled courses."
      }
    ]
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>("getting-started")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: ""
  })

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.subject || !contactForm.message) return

    setSending(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSending(false)
    setMessageSent(true)
    setContactForm({ subject: "", message: "" })
    setTimeout(() => setMessageSent(false), 5000)
  }

  // Filter FAQs based on search
  const filteredCategories = searchQuery
    ? faqCategories.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(
          faq => 
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.faqs.length > 0)
    : faqCategories

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="down" delay={0}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Help & Support
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Find answers to common questions or get in touch with our support team
            </p>
          </div>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal direction="up" delay={100}>
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-white dark:bg-gray-800 text-foreground shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>
        </ScrollReveal>

        {/* FAQ Categories */}
        <div className="space-y-4 mb-8">
          {filteredCategories.map((category, catIndex) => (
            <ScrollReveal key={category.id} direction="up" delay={150 + catIndex * 50}>
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
                <button
                  className="w-full"
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                >
                  <CardHeader className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${category.bgColor} flex items-center justify-center`}>
                          <category.icon className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <div className="text-left">
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription>{category.faqs.length} articles</CardDescription>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          expandedCategory === category.id ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </CardHeader>
                </button>

                {expandedCategory === category.id && (
                  <CardContent className="pt-0 border-t dark:border-gray-700">
                    <div className="space-y-2 py-4">
                      {category.faqs.map((faq, faqIndex) => (
                        <div key={faqIndex} className="rounded-lg overflow-hidden">
                          <button
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                            onClick={() => setExpandedFAQ(
                              expandedFAQ === `${category.id}-${faqIndex}` 
                                ? null 
                                : `${category.id}-${faqIndex}`
                            )}
                          >
                            <span className="font-medium text-foreground pr-4">{faq.question}</span>
                            <ChevronRight 
                              className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                                expandedFAQ === `${category.id}-${faqIndex}` ? 'rotate-90' : ''
                              }`} 
                            />
                          </button>
                          {expandedFAQ === `${category.id}-${faqIndex}` && (
                            <div className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed animate-in slide-in-from-top-2">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Contact Support */}
        <ScrollReveal direction="up" delay={400}>
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Still need help?</CardTitle>
                  <CardDescription>Send us a message and we'll get back to you</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {messageSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">Message Sent!</h3>
                  <p className="text-muted-foreground mt-1">We'll get back to you within 24 hours</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="What do you need help with?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe your issue in detail..."
                      rows={4}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                    />
                  </div>
                  <BouncyButton
                    type="submit"
                    variant="primary"
                    disabled={sending}
                    className="w-full sm:w-auto"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </BouncyButton>
                </form>
              )}

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t dark:border-gray-700 grid gap-4 sm:grid-cols-2">
                <a 
                  href="mailto:support@learnflex.ng" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email us</p>
                    <p className="font-medium text-foreground group-hover:text-indigo-500 transition-colors">
                      support@learnflex.ng
                    </p>
                  </div>
                </a>
                <a 
                  href="tel:+2348000000000" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <Phone className="w-5 h-5 text-cyan-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Call us</p>
                    <p className="font-medium text-foreground group-hover:text-cyan-500 transition-colors">
                      +234 800 000 0000
                    </p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  )
}
