"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
import { ScrollReveal, StaggerReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { 
  CreditCard,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  Wallet,
  TrendingUp,
  Receipt
} from "lucide-react"

interface Transaction {
  id: string
  date: string
  courseName: string
  amount: number
  status: "completed" | "pending" | "failed"
  paymentMethod: string
  type: "full" | "installment"
  reference: string
}

interface UpcomingPayment {
  id: string
  courseName: string
  dueDate: string
  amount: number
  installmentNumber: number
  totalInstallments: number
}

// Mock data - In production, fetch from Supabase
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    courseName: "UI/UX Design Fundamentals",
    amount: 45000,
    status: "completed",
    paymentMethod: "Bank Transfer",
    type: "installment",
    reference: "TXN-001-2024"
  },
  {
    id: "2",
    date: "2024-01-10",
    courseName: "Digital Marketing Mastery",
    amount: 75000,
    status: "completed",
    paymentMethod: "Bank Transfer",
    type: "full",
    reference: "TXN-002-2024"
  },
  {
    id: "3",
    date: "2024-01-05",
    courseName: "Web Development Bootcamp",
    amount: 25000,
    status: "pending",
    paymentMethod: "Bank Transfer",
    type: "installment",
    reference: "TXN-003-2024"
  },
]

const mockUpcoming: UpcomingPayment[] = [
  {
    id: "1",
    courseName: "UI/UX Design Fundamentals",
    dueDate: "2024-02-15",
    amount: 45000,
    installmentNumber: 2,
    totalInstallments: 4
  },
  {
    id: "2",
    courseName: "Web Development Bootcamp",
    dueDate: "2024-02-05",
    amount: 25000,
    installmentNumber: 2,
    totalInstallments: 6
  },
]

export default function PaymentsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [upcoming, setUpcoming] = useState<UpcomingPayment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "failed">("all")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          router.push("/login")
          return
        }
        // In production, fetch real data
        setTransactions(mockTransactions)
        setUpcoming(mockUpcoming)
      } catch (err) {
        console.error("Auth check failed", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router, supabase])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntil = (dateStr: string) => {
    const today = new Date()
    const dueDate = new Date(dateStr)
    const diff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.reference.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || t.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalSpent = transactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalUpcoming = upcoming.reduce((sum, u) => sum + u.amount, 0)

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="down" delay={0}>
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-indigo-600" />
              Payments
            </h1>
            <p className="text-muted-foreground mt-2">
              View your payment history and upcoming installments
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Cards */}
        <ScrollReveal direction="up" delay={100}>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Total Spent</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Upcoming Due</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalUpcoming)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Transactions</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Main Content */}
        <ScrollReveal direction="up" delay={200}>
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <Tabs defaultValue="history" className="w-full">
              <CardHeader className="pb-0">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="history" className="gap-2">
                    <Receipt className="w-4 h-4" />
                    Payment History
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Upcoming ({upcoming.length})
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <TabsContent value="history" className="p-6 pt-4">
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by course or reference..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Transactions List */}
                <div className="space-y-3">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-12">
                      <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No transactions found</p>
                    </div>
                  ) : (
                    filteredTransactions.map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <StatusIcon status={transaction.status} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{transaction.courseName}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{formatDate(transaction.date)}</span>
                              <span>•</span>
                              <span>{transaction.reference}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-foreground">{formatCurrency(transaction.amount)}</p>
                            <Badge variant={transaction.type === "full" ? "default" : "secondary"} className="text-xs">
                              {transaction.type === "full" ? "Full Payment" : "Installment"}
                            </Badge>
                          </div>
                          <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Download className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="p-6 pt-4">
                {upcoming.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No upcoming payments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcoming.map((payment) => {
                      const daysUntil = getDaysUntil(payment.dueDate)
                      const isOverdue = daysUntil < 0
                      const isUrgent = daysUntil <= 3 && daysUntil >= 0

                      return (
                        <div
                          key={payment.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isOverdue 
                              ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' 
                              : isUrgent 
                                ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
                                : 'border-gray-200 bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">{payment.courseName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  Installment {payment.installmentNumber} of {payment.totalInstallments}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  Due: {formatDate(payment.dueDate)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-foreground">{formatCurrency(payment.amount)}</p>
                              {isOverdue ? (
                                <span className="text-xs text-red-600 font-medium">Overdue</span>
                              ) : isUrgent ? (
                                <span className="text-xs text-yellow-600 font-medium">Due in {daysUntil} days</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">{daysUntil} days remaining</span>
                              )}
                            </div>
                          </div>
                          {(isOverdue || isUrgent) && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <BouncyButton
                                variant={isOverdue ? "primary" : "outline"}
                                size="sm"
                                className="w-full"
                              >
                                Pay Now
                              </BouncyButton>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  )
}
