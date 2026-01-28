// app/lib/payment-status.ts

export type CourseStatus = "not-purchased" | "pending-payment" | "paid" | "installment"

export interface CoursePurchase {
  courseId: string
  status: CourseStatus
  amountPaid?: number
  amountDue?: number
  dueDate?: string
  installmentsPaid?: number
  totalInstallments?: number
  accessLink?: string
  enrollmentDate?: string
  lastPaymentDate?: string
}

/**
 * Fetch user's course purchase status
 * In a real app, this would call your API
 */
export async function getUserCoursePurchases(userId?: string): Promise<Record<string, CoursePurchase>> {
  if (!userId) {
    return {}
  }

  // TODO: Replace with actual API call
  // const response = await fetch(`/api/user/${userId}/purchases`)
  // return response.json()

  // Mock data for demonstration
  return {
    "1": {
      courseId: "1",
      status: "paid",
      amountPaid: 150000,
      accessLink: "https://techhub.academy/course/fullstack",
      enrollmentDate: "2026-01-15",
    },
    "2": {
      courseId: "2",
      status: "installment",
      amountPaid: 42500,
      amountDue: 42500,
      installmentsPaid: 1,
      totalInstallments: 2,
      enrollmentDate: "2026-01-10",
    },
    "4": {
      courseId: "4",
      status: "pending-payment",
      amountDue: 95000,
      enrollmentDate: "2026-01-20",
    },
  }
}

/**
 * Check if user has purchased a specific course
 */
export function hasUserPurchasedCourse(
  purchases: Record<string, CoursePurchase>,
  courseId: string
): boolean {
  return courseId in purchases
}

/**
 * Get purchase status for a specific course
 */
export function getCoursePurchaseStatus(
  purchases: Record<string, CoursePurchase>,
  courseId: string
): CourseStatus {
  return purchases[courseId]?.status || "not-purchased"
}

/**
 * Check if user has pending payments for any course
 */
export function hasPendingPayments(purchases: Record<string, CoursePurchase>): boolean {
  return Object.values(purchases).some(
    (purchase) => purchase.status === "pending-payment" || purchase.status === "installment"
  )
}

/**
 * Check if specific course has pending payment
 */
export function hasPendingPaymentForCourse(
  purchases: Record<string, CoursePurchase>,
  courseId: string
): boolean {
  const purchase = purchases[courseId]
  if (!purchase) return false
  
  return purchase.status === "pending-payment" || purchase.status === "installment"
}

/**
 * Get all courses with pending payments
 */
export function getPendingPaymentCourses(
  purchases: Record<string, CoursePurchase>
): CoursePurchase[] {
  return Object.values(purchases).filter(
    (purchase) => purchase.status === "pending-payment" || purchase.status === "installment"
  )
}

/**
 * Get total amount due across all courses
 */
export function getTotalAmountDue(purchases: Record<string, CoursePurchase>): number {
  return Object.values(purchases).reduce((total, purchase) => {
    return total + (purchase.amountDue || 0)
  }, 0)
}

/**
 * Get count of courses by status
 */
export function getCourseCountByStatus(purchases: Record<string, CoursePurchase>): {
  total: number
  paid: number
  pendingPayment: number
  installment: number
} {
  const counts = {
    total: 0,
    paid: 0,
    pendingPayment: 0,
    installment: 0,
  }

  Object.values(purchases).forEach((purchase) => {
    counts.total++
    switch (purchase.status) {
      case "paid":
        counts.paid++
        break
      case "pending-payment":
        counts.pendingPayment++
        break
      case "installment":
        counts.installment++
        break
    }
  })

  return counts
}

/**
 * Check if course can be accessed (fully paid)
 */
export function canAccessCourse(
  purchases: Record<string, CoursePurchase>,
  courseId: string
): boolean {
  const purchase = purchases[courseId]
  return purchase?.status === "paid"
}

/**
 * Get access link for a course
 */
export function getCourseAccessLink(
  purchases: Record<string, CoursePurchase>,
  courseId: string
): string | null {
  const purchase = purchases[courseId]
  if (purchase?.status === "paid" && purchase.accessLink) {
    return purchase.accessLink
  }
  return null
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Get button configuration based on purchase status for logged-in users
 */
export function getCourseButtonConfig(
  purchases: Record<string, CoursePurchase>,
  courseId: string,
  isLoggedIn: boolean
) {
  // If not logged in, show default view details button
  if (!isLoggedIn) {
    return {
      text: "View Course Details",
      variant: "outline" as const,
      href: `/courses/${courseId}`,
      action: "view",
    }
  }

  const status = getCoursePurchaseStatus(purchases, courseId)
  const purchase = purchases[courseId]

  switch (status) {
    case "paid":
      // Fully paid - show access course with external link
      return {
        text: "Access Course",
        variant: "primary" as const,
        href: purchase.accessLink || `/courses/${courseId}`,
        action: "access",
        external: !!purchase.accessLink,
      }
    case "pending-payment":
    case "installment":
      // Has pending payment - show pay now
      return {
        text: "Pay Now",
        variant: "primary" as const,
        href: `/dashboard/payments?course=${courseId}`,
        action: "pay",
      }
    default:
      // Not purchased - show view details
      return {
        text: "View Course Details",
        variant: "outline" as const,
        href: `/courses/${courseId}`,
        action: "view",
      }
  }
}

/**
 * Get status badge configuration
 */
export function getStatusBadgeConfig(
  purchases: Record<string, CoursePurchase>,
  courseId: string,
  isLoggedIn: boolean
) {
  if (!isLoggedIn) {
    return null
  }

  const status = getCoursePurchaseStatus(purchases, courseId)

  switch (status) {
    case "paid":
      return {
        label: "Enrolled",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      }
    case "pending-payment":
      return {
        label: "Payment Pending",
        className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      }
    case "installment":
      return {
        label: "In Progress",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      }
    default:
      return null
  }
}

/**
 * Get price display text based on purchase status
 */
export function getPriceDisplayText(
  purchases: Record<string, CoursePurchase>,
  courseId: string,
  coursePrice: number,
  isLoggedIn: boolean
): {
  text: string
  subtext?: string
} {
  if (!isLoggedIn) {
    return {
      text: formatCurrency(coursePrice),
      subtext: "Installments available"
    }
  }

  const status = getCoursePurchaseStatus(purchases, courseId)
  const purchase = purchases[courseId]

  switch (status) {
    case "paid":
      return {
        text: "Fully Paid",
      }
    case "pending-payment":
      return {
        text: `Due: ${formatCurrency(purchase?.amountDue || 0)}`,
      }
    case "installment":
      return {
        text: "Payment Plan Active",
        subtext: `Paid: ${formatCurrency(purchase?.amountPaid || 0)}`
      }
    default:
      return {
        text: formatCurrency(coursePrice),
        subtext: "Installments available"
      }
  }
}