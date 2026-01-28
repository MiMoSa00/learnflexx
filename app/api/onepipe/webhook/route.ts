import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import crypto from "crypto"

// OnePipe webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log incoming webhook
    console.log("📥 OnePipe Webhook Received:", {
      timestamp: new Date().toISOString(),
      event: body.event || body.type,
      reference: body.reference,
    })

    // Optional: Verify webhook signature
    const signature = request.headers.get("x-onepipe-signature")
    if (signature && process.env.ONEPIPE_WEBHOOK_SECRET) {
      const isValid = verifySignature(
        JSON.stringify(body),
        signature,
        process.env.ONEPIPE_WEBHOOK_SECRET
      )
      
      if (!isValid) {
        console.error("❌ Invalid webhook signature")
        return NextResponse.json(
          { 
            status: "error",
            message: "Invalid signature" 
          },
          { status: 401 }
        )
      }
    }

    // Store webhook in database
    const webhookEvent = await prisma.webhookEvent.create({
      data: {
        event: body.event || body.type || "onepipe.webhook",
        payload: body,
        source: "onepipe",
        processed: false,
      },
    })

    console.log("💾 Webhook stored with ID:", webhookEvent.id)

    // Process the webhook
    await processOnePipeWebhook(body)

    // Mark as processed
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { processed: true },
    })

    // Return success response
    return NextResponse.json(
      {
        status: "success",
        message: "Webhook received and processed",
        reference: body.reference || webhookEvent.id,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Webhook processing error:", error)
    
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Processing failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Health check endpoint (GET request)
export async function GET() {
  return NextResponse.json({
    status: "active",
    service: "OnePipe Webhook Handler",
    endpoint: "/api/onepipe/webhook",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
}

// Verify webhook signature
function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex")
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

// Process OnePipe webhook events
async function processOnePipeWebhook(payload: any) {
  const eventType = payload.event || payload.type
  
  console.log(`🔄 Processing OnePipe event: ${eventType}`)
  
  switch (eventType) {
    case "transaction.successful":
    case "payment.success":
      console.log("✅ Payment successful:", {
        reference: payload.reference,
        amount: payload.amount,
        currency: payload.currency,
      })
      // TODO: Update your database, send confirmation email, etc.
      break
      
    case "transaction.failed":
    case "payment.failed":
      console.log("❌ Payment failed:", {
        reference: payload.reference,
        reason: payload.reason || payload.message,
      })
      // TODO: Handle failed payment, notify user, etc.
      break
      
    case "transfer.successful":
      console.log("💸 Transfer successful:", {
        reference: payload.reference,
        amount: payload.amount,
      })
      // TODO: Update transfer status
      break
      
    default:
      console.log("ℹ️ Unhandled OnePipe event:", eventType)
      // Log for monitoring
  }
}