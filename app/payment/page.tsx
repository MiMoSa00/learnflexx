"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Badge } from "@/app/components/ui/badge"
import { Input } from "@/app/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import {
  CreditCard,
  Download,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { cn } from "@/app/lib/utils"

// Payment data - initialized as empty for new users
// TODO: Fetch actual payment data from Supabase based on logged-in user
interface PaymentHistoryItem {
  id: string;
  date: string;
  courseName: string;
  amount: number;
  paymentMethod: string;
  status: string;
  receiptUrl: string | null;
}

interface UpcomingPaymentItem {
  id: string;
  courseName: string;
  dueDate: string;
  amount: number;
  paymentMethod: string;
  status: string;
  installment: string;
}

// Empty arrays for new users - will be populated from database
const paymentHistory: PaymentHistoryItem[] = []
const upcomingPayments: UpcomingPaymentItem[] = []

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getDaysUntil(dateString: string): number {
  const today = new Date()
  const dueDate = new Date(dateString)
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
  pending: {
    label: "Pending",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: Clock,
  },
  scheduled: {
    label: "Scheduled",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Calendar,
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertCircle,
  },
}

export default function PaymentsPage() {
  const { data: _session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("history")

  const totalSpent = paymentHistory
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalUpcoming = upcomingPayments
    .reduce((sum, p) => sum + p.amount, 0)

  const nextPayment = upcomingPayments.length > 0 ? upcomingPayments[0] : null
  const daysUntilNext = nextPayment ? getDaysUntil(nextPayment.dueDate) : 0

  const filteredHistory = paymentHistory.filter(payment => {
    const matchesSearch = payment.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    
    let matchesDate = true
    if (dateFilter !== "all") {
      const paymentDate = new Date(payment.date)
      const now = new Date()
      if (dateFilter === "30days") {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
        matchesDate = paymentDate >= thirtyDaysAgo
      } else if (dateFilter === "90days") {
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90))
        matchesDate = paymentDate >= ninetyDaysAgo
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleDownloadReceipt = (paymentId: string) => {
    alert(`Downloading receipt for ${paymentId}`)
  }

  const handlePayNow = (paymentId: string) => {
    alert(`Redirecting to payment for ${paymentId}`)
  }

  return (
    <main className="min-h-screen py-6 md:py-8 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <ScrollReveal direction="up">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <CreditCard className="w-10 h-10 text-primary" />
              Payments
            </h1>
            <p className="text-muted-foreground">
              Manage your payment history and upcoming installments
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Cards */}
        <ScrollReveal direction="up" delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-foreground">{formatPrice(totalSpent)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {formatPrice(totalUpcoming)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Next Payment</p>
                    <p className="text-xl font-bold text-foreground">
                      {daysUntilNext > 0 ? `In ${daysUntilNext} days` : "No upcoming"}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal direction="up" delay={150}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="history">Payment History</TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming Payments
                {upcomingPayments.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {upcomingPayments.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Payment History Tab */}
            <TabsContent value="history" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search payments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Payments Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No payment history yet
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Your payment transactions will appear here once you make a purchase.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Receipt</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredHistory.map((payment) => {
                            const StatusIcon = statusConfig[payment.status as keyof typeof statusConfig].icon
                            return (
                              <TableRow key={payment.id}>
                                <TableCell className="font-mono text-sm">
                                  {formatDate(payment.date)}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium text-foreground">{payment.courseName}</p>
                                    <p className="text-xs text-muted-foreground">{payment.id}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="font-semibold">
                                  {formatPrice(payment.amount)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {payment.paymentMethod}
                                </TableCell>
                                <TableCell>
                                  <Badge className={cn("flex items-center gap-1 w-fit", statusConfig[payment.status as keyof typeof statusConfig].color)}>
                                    <StatusIcon className="w-3 h-3" />
                                    {statusConfig[payment.status as keyof typeof statusConfig].label}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  {payment.receiptUrl && (
                                    <BouncyButton
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownloadReceipt(payment.id)}
                                    >
                                      <Download className="w-4 h-4" />
                                    </BouncyButton>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Upcoming Payments Tab */}
            <TabsContent value="upcoming" className="space-y-6">
              {upcomingPayments.length > 0 ? (
                <>
                  {upcomingPayments.map((payment, index) => {
                    const daysUntil = getDaysUntil(payment.dueDate)
                    const isOverdue = daysUntil < 0
                    const StatusIcon = statusConfig[isOverdue ? "overdue" : "scheduled"].icon

                    return (
                      <ScrollReveal key={payment.id} direction="up" delay={index * 50}>
                        <Card className={cn(
                          "border-2",
                          isOverdue ? "border-red-200 dark:border-red-800" : "border-border"
                        )}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg text-foreground">
                                    {payment.courseName}
                                  </h3>
                                  <Badge variant="secondary" className="text-xs">
                                    {payment.installment}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>Due: {formatDate(payment.dueDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <CreditCard className="w-4 h-4" />
                                    <span>{payment.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-foreground">
                                    {formatPrice(payment.amount)}
                                  </p>
                                  <Badge className={cn(
                                    "mt-1",
                                    statusConfig[isOverdue ? "overdue" : "scheduled"].color
                                  )}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {isOverdue ? `${Math.abs(daysUntil)} days overdue` : `Due in ${daysUntil} days`}
                                  </Badge>
                                </div>

                                {isOverdue && (
                                  <BouncyButton
                                    variant="primary"
                                    className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                                    onClick={() => handlePayNow(payment.id)}
                                  >
                                    Pay Now
                                  </BouncyButton>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    )
                  })}

                  {/* Total Summary */}
                  <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Total Upcoming Payments
                          </p>
                          <p className="text-3xl font-bold text-foreground">
                            {formatPrice(totalUpcoming)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">
                            Next Payment
                          </p>
                          <p className="text-lg font-semibold text-primary">
                            {nextPayment && formatDate(nextPayment.dueDate)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      All Caught Up!
                    </h3>
                    <p className="text-muted-foreground">
                      You have no upcoming payments at this time.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </ScrollReveal>
      </div>
    </main>
  )
}