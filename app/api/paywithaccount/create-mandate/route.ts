import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { PayWithAccountClient } from "@/app/lib/paywithaccount"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      courseId,
      courseName,
      amount,
      type, // "single" or "installment"
      installmentCount,
      installmentFrequency,
    } = body

    // Generate unique reference
    const reference = `LF-${Date.now()}-${courseId}`

    const client = new PayWithAccountClient()
    const result = await client.createMandate({
      amount,
      currency: "NGN",
      customer_email: session.user?.email || "",
      customer_name: session.user?.name || "",
      customer_phone: "+2348012345678", // TODO: Get from user profile
      type,
      installment_count: installmentCount,
      installment_frequency: installmentFrequency,
      description: `Payment for ${courseName}`,
      reference,
    })

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 400 })
    }

    // TODO: Save mandate details to your database
    // await prisma.mandate.create({
    //   data: {
    //     userId: session.user.id,
    //     courseId,
    //     mandateId: result.data.mandate_id,
    //     reference,
    //     amount,
    //     type,
    //     status: "pending",
    //   }
    // })

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("Create mandate error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}