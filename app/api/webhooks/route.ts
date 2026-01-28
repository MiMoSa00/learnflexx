import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

// Disable body parser for raw body access (if needed for signature verification)
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.json()
    
    // Optional: Get headers for signature verification
    const signature = request.headers.get("x-webhook-signature")
    const eventType = request.headers.get("x-event-type") || "unknown"
    
    // Log the incoming webhook
    console.log("📥 Webhook received:", {
      eventType,
      signature: signature ? "present" : "none",
      timestamp: new Date().toISOString(),
    })

    // Store webhook in database
    const webhookEvent = await prisma.webhookEvent.create({
      data: {
        event: eventType,
        payload: body,
        source: request.headers.get("origin") || "unknown",
        processed: false,
      },
    })

    // Process the webhook based on event type
    await processWebhook(webhookEvent.event, body)

    // Mark as processed
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { processed: true },
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Webhook received and processed",
        id: webhookEvent.id,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Webhook processing error:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// Optional: Handle GET requests (for webhook verification)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get("challenge")
  
  // Some webhook providers send a challenge for verification
  if (challenge) {
    return NextResponse.json({ challenge }, { status: 200 })
  }

  return NextResponse.json(
    {
      status: "active",
      message: "Webhook endpoint is active",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}

// Process different webhook events
async function processWebhook(eventType: string, payload: any) {
  console.log(`🔄 Processing webhook: ${eventType}`)
  
  switch (eventType) {
    case "payment.success":
      // Handle successful payment
      console.log("💰 Payment successful:", payload)
      break
      
    case "user.created":
      // Handle new user creation
      console.log("👤 New user created:", payload)
      break
      
    case "order.completed":
      // Handle order completion
      console.log("📦 Order completed:", payload)
      break
      
    default:
      console.log("ℹ️ Unhandled event type:", eventType)
  }
}