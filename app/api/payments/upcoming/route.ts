import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Query your database for real upcoming payments
    // For now, return empty arrays (will show empty state)
    const upcomingPayments: any[] = []
    const totalDue = 0
    const nextPayment = null

    return NextResponse.json({ 
      upcomingPayments,
      totalDue,
      nextPayment
    })
  } catch (error) {
    console.error("Error fetching upcoming payments:", error)
    return NextResponse.json(
      { error: "Failed to fetch upcoming payments" },
      { status: 500 }
    )
  }
}