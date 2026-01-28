import { NextResponse } from "next/server"
// import { PayWithAccountClient } from "@/app/lib/paywithaccount"

export async function GET() {
  try {
// const _client = new PayWithAccountClient()
    
    // Test if API key is configured
    if (!process.env.PAYWITHACCOUNT_API_KEY || !process.env.PAYWITHACCOUNT_SECRET_KEY) {
      return NextResponse.json({
        success: false,
        error: "API keys not configured in .env",
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "API keys configured successfully",
      baseUrl: process.env.PAYWITHACCOUNT_BASE_URL,
      hasApiKey: !!process.env.PAYWITHACCOUNT_API_KEY,
      hasSecretKey: !!process.env.PAYWITHACCOUNT_SECRET_KEY,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}