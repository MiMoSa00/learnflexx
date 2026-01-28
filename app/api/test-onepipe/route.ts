import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.ONEPIPE_API_KEY
    const secretKey = process.env.ONEPIPE_SECRET_KEY
    const baseUrl = process.env.PAYWITHACCOUNT_BASE_URL

    if (!apiKey || !secretKey) {
      return NextResponse.json({
        success: false,
        error: "Missing API credentials",
        config: {
          hasApiKey: !!apiKey,
          hasSecretKey: !!secretKey,
          apiKeyLength: apiKey?.length,
          secretKeyLength: secretKey?.length
        }
      })
    }

    // Simple test request
    const testRequest = {
      request_ref: `test-${Date.now()}`,
      request_type: "lookup_bvn_details",
      auth: {
        type: null,
        secure: secretKey,
        auth_provider: "Sandbox"
      },
      transaction: {
        mock_mode: "inspect",
        transaction_ref: `test-${Date.now()}`,
        transaction_desc: "Test connection",
        transaction_ref_parent: null,
        amount: 100,
        customer: {
          customer_ref: "test@test.com",
          firstname: "Test",
          surname: "User",
          email: "test@test.com",
          mobile_no: "08012345678"
        },
        meta: null,
        details: {
          bvn: "22222222222"
        }
      }
    }

    // Create Authorization header (Basic Auth)
    const authorization = Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
    
    // Create simple signature
    const signatureString = `${apiKey}${secretKey}${testRequest.request_ref}`
    const signature = Buffer.from(signatureString).toString('base64')

    console.log("Testing OnePipe connection...")
    console.log("API Key:", apiKey.substring(0, 20) + "...")
    console.log("Secret Key:", secretKey.substring(0, 5) + "...")
    console.log("Authorization:", `Basic ${authorization.substring(0, 20)}...`)
    console.log("URL:", `${baseUrl}/v2/transact`)

    const response = await fetch(`${baseUrl}/v2/transact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authorization}`,
        "Signature": signature,
      },
      body: JSON.stringify(testRequest),
    })

    const responseText = await response.text()
    console.log("Response Status:", response.status)
    console.log("Response:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      data = { raw: responseText }
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: data,
      config: {
        baseUrl,
        apiKeyStart: apiKey.substring(0, 20),
        secretKeyStart: secretKey.substring(0, 5),
        hasSecretKey: !!secretKey,
        authHeaderSample: `Basic ${authorization.substring(0, 20)}...`
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}