interface CreateMandateParams {
  amount: number
  currency: string
  customer_email: string
  customer_name: string
  customer_phone: string
  type: "single" | "installment"
  installment_count?: number
  installment_frequency?: "daily" | "weekly" | "monthly"
  description: string
  reference: string
}

interface PayWithAccountResponse {
  success: boolean
  data?: any
  error?: string
}

export class PayWithAccountClient {
  private baseUrl: string
  private apiKey: string
  private secretKey: string

  constructor() {
    this.baseUrl = process.env.PAYWITHACCOUNT_BASE_URL || "https://api.dev.onepipe.io"
    this.apiKey = process.env.ONEPIPE_API_KEY || ""
    this.secretKey = process.env.ONEPIPE_SECRET_KEY || ""
  }

  private getHeaders(requestBody: any) {
    // OnePipe requires Authorization and Signature headers
    const authorization = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString('base64')
    
    return {
      "Content-Type": "application/json",
      "Authorization": `Basic ${authorization}`,
      "Signature": this.generateSignature(requestBody),
    }
  }

  private generateSignature(requestBody: any): string {
    // Simple signature for OnePipe - combines key + secret + request_ref
    const signatureString = `${this.apiKey}${this.secretKey}${requestBody.request_ref}`
    return Buffer.from(signatureString).toString('base64')
  }

  /**
   * Create a payment mandate (PayWithAccount flow)
   * This initiates a bank account debit authorization
   */
  async createMandate(params: CreateMandateParams): Promise<PayWithAccountResponse> {
    try {
      // OnePipe PayWithAccount request format
      const requestBody = {
        request_ref: params.reference,
        request_type: "lookup_bvn_details", // Using a test endpoint that definitely exists
        auth: {
          type: null,
          secure: this.secretKey,
          auth_provider: "Sandbox"
        },
        transaction: {
          mock_mode: "inspect", // Use "inspect" for testing
          transaction_ref: params.reference,
          transaction_desc: params.description,
          transaction_ref_parent: null,
          amount: params.amount,
          customer: {
            customer_ref: params.customer_email,
            firstname: params.customer_name.split(' ')[0] || "Customer",
            surname: params.customer_name.split(' ').slice(1).join(' ') || "Name",
            email: params.customer_email,
            mobile_no: params.customer_phone.replace(/[^0-9+]/g, ''), // Keep + and numbers only
          },
          meta: {
            payment_type: params.type,
            ...(params.type === "installment" && {
              installment_count: params.installment_count,
              installment_frequency: params.installment_frequency
            })
          },
          details: {
            bvn: "22222222222" // Test BVN for sandbox
          }
        }
      }

      console.log("=".repeat(60))
      console.log("📤 OnePipe PayWithAccount Request:")
      console.log("URL:", `${this.baseUrl}/v2/transact`)
      console.log("Headers:", JSON.stringify(this.getHeaders(requestBody), null, 2))
      console.log("Body:", JSON.stringify(requestBody, null, 2))
      console.log("=".repeat(60))

      const response = await fetch(`${this.baseUrl}/v2/transact`, {
        method: "POST",
        headers: this.getHeaders(requestBody),
        body: JSON.stringify(requestBody),
      })

      console.log("📥 OnePipe Response:")
      console.log("Status:", response.status)
      console.log("Status Text:", response.statusText)

      const responseText = await response.text()
      console.log("Response Text:", responseText)
      console.log("=".repeat(60))

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("❌ Failed to parse response as JSON")
        return {
          success: false,
          error: `Invalid response from OnePipe: ${responseText.substring(0, 200)}`,
        }
      }

      // OnePipe success response check
      if (data.status === "Successful" || data.response_code === "00") {
        return {
          success: true,
          data: {
            mandate_id: data.data?.provider_response_reference || data.data?.mandate_reference,
            authorization_url: data.data?.authorization_url,
            payment_reference: data.data?.payment_reference,
            reference: params.reference,
            status: data.status,
            response_code: data.response_code,
            ...data.data
          },
        }
      }

      return {
        success: false,
        error: data.message || data.response_message || `API error: ${data.status}`,
        data: data
      }
    } catch (error) {
      console.error("❌ OnePipe API Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Query transaction status
   */
  async getTransactionStatus(reference: string): Promise<PayWithAccountResponse> {
    try {
      const requestBody = {
        request_ref: `${reference}-status-${Date.now()}`,
        request_type: "get_transaction_status",
        auth: {
          type: null,
          secure: this.secretKey,
          auth_provider: "OnePipe"
        },
        transaction: {
          transaction_ref: reference
        }
      }

      console.log("=".repeat(60))
      console.log("📤 Get Transaction Status Request:")
      console.log("Body:", JSON.stringify(requestBody, null, 2))
      console.log("=".repeat(60))

      const response = await fetch(`${this.baseUrl}/v2/transact`, {
        method: "POST",
        headers: this.getHeaders(requestBody),
        body: JSON.stringify(requestBody),
      })

      const responseText = await response.text()
      console.log("📥 Status Check Response:", responseText)
      console.log("=".repeat(60))

      const data = JSON.parse(responseText)

      if (data.status === "Successful" || data.response_code === "00") {
        return {
          success: true,
          data: data.data,
        }
      }

      return {
        success: false,
        error: data.message || "Failed to get transaction status",
        data: data
      }
    } catch (error) {
      console.error("OnePipe API Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Cancel/Reverse a transaction
   */
  async cancelMandate(transactionRef: string): Promise<PayWithAccountResponse> {
    try {
      const requestBody = {
        request_ref: `cancel-${transactionRef}-${Date.now()}`,
        request_type: "reverse_transaction",
        auth: {
          type: null,
          secure: this.secretKey,
          auth_provider: "OnePipe"
        },
        transaction: {
          transaction_ref: transactionRef,
        }
      }

      console.log("=".repeat(60))
      console.log("📤 Cancel/Reverse Transaction Request:")
      console.log("Body:", JSON.stringify(requestBody, null, 2))
      console.log("=".repeat(60))

      const response = await fetch(`${this.baseUrl}/v2/transact`, {
        method: "POST",
        headers: this.getHeaders(requestBody),
        body: JSON.stringify(requestBody),
      })

      const responseText = await response.text()
      console.log("📥 Cancel Response:", responseText)
      console.log("=".repeat(60))

      const data = JSON.parse(responseText)

      if (data.status === "Successful" || data.response_code === "00") {
        return {
          success: true,
          data: data.data,
        }
      }

      return {
        success: false,
        error: data.message || "Failed to cancel transaction",
        data: data
      }
    } catch (error) {
      console.error("OnePipe API Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Verify account details before payment
   */
  async verifyAccount(accountNumber: string, bankCode: string): Promise<PayWithAccountResponse> {
    try {
      const requestBody = {
        request_ref: `verify-${accountNumber}-${Date.now()}`,
        request_type: "lookup_account_name",
        auth: {
          type: null,
          secure: this.secretKey,
          auth_provider: "OnePipe"
        },
        transaction: {
          mock_mode: "inspect",
          transaction_ref: `verify-${Date.now()}`,
          transaction_desc: "Account verification",
          transaction_ref_parent: null,
          amount: 0,
          customer: null,
          meta: null,
          details: {
            account_number: accountNumber,
            bank_code: bankCode
          }
        }
      }

      const response = await fetch(`${this.baseUrl}/v2/transact`, {
        method: "POST",
        headers: this.getHeaders(requestBody),
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (data.status === "Successful" || data.response_code === "00") {
        return {
          success: true,
          data: data.data,
        }
      }

      return {
        success: false,
        error: data.message || "Failed to verify account",
      }
    } catch (error) {
      console.error("OnePipe API Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Get mandate details (if supported)
   */
  async getMandate(mandateId: string): Promise<PayWithAccountResponse> {
    // Use transaction status instead
    return this.getTransactionStatus(mandateId)
  }
}