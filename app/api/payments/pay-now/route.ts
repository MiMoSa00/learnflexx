import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { paymentId, amount } = body

    // TODO: Integrate with PayWithAccount API
    const response = await fetch(`${process.env.PAYWITHACCOUNT_BASE_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAYWITHACCOUNT_API_KEY}`,
        "X-Secret-Key": process.env.PAYWITHACCOUNT_SECRET_KEY || "",
      },
      body: JSON.stringify({
        amount,
        currency: "NGN",
        customer_email: session.user?.email,
        reference: paymentId,
      }),
    })

    const data = await response.json()

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json(
      { error: "Payment failed" },
      { status: 500 }
    )
  }
}