import crypto from "crypto"

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
  redirect_url?: string
  metadata?: Record<string, any>
}

interface SendInvoiceParams {
  customer_email: string
  customer_name: string
  amount: number
  currency: string
  description: string
  reference: string
  due_date?: string
  items?: Array<{
    name: string
    quantity: number
    unit_price: number
  }>
}

interface OneTimePaymentParams {
  amount: number
  currency: string
  customer_email: string
  customer_name: string
  customer_phone: string
  account_number: string
  bank_code: string
  description: string
  reference: string
  metadata?: Record<string, any>
}

interface AccountLookupParams {
  account_number: string
  bank_code: string
}

interface ChargeDirectDebitParams {
  mandate_id: string
  amount: number
  reference: string
  description?: string
}

export class PayWithAccountClient {
  private apiKey: string
  private secretKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.PAYWITHACCOUNT_API_KEY || ""
    this.secretKey = process.env.PAYWITHACCOUNT_SECRET_KEY || ""
    this.baseUrl = process.env.PAYWITHACCOUNT_BASE_URL || "https://api.paywithaccount.com"

    if (!this.apiKey || !this.secretKey) {
      throw new Error("PayWithAccount API keys not configured")
    }
  }

  /**
   * Generate signature for request authentication
   */
  private generateSignature(payload: string): string {
    return crypto
      .createHmac("sha256", this.secretKey)
      .update(payload)
      .digest("hex")
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    body?: any
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const timestamp = Date.now().toString()
      
      // Create payload string for signature
      const payloadString = body ? JSON.stringify(body) : ""
      const signaturePayload = `${method}${endpoint}${timestamp}${payloadString}`
      const signature = this.generateSignature(signaturePayload)

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
        "X-Signature": signature,
        "X-Timestamp": timestamp,
      }

      const options: RequestInit = {
        method,
        headers,
      }

      if (body && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(url, options)
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || "Request failed",
        }
      }

      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      console.error("PayWithAccount API Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Create a payment mandate (for direct debit)
   */
  async createMandate(params: CreateMandateParams) {
    return this.makeRequest("/v1/mandates/create", "POST", params)
  }

  /**
   * Get mandate details
   */
  async getMandate(mandateId: string) {
    return this.makeRequest(`/v1/mandates/${mandateId}`, "GET")
  }

  /**
   * Cancel a mandate
   */
  async cancelMandate(mandateId: string, reason?: string) {
    return this.makeRequest(`/v1/mandates/${mandateId}/cancel`, "POST", {
      reason,
    })
  }

  /**
   * Send invoice to customer
   */
  async sendInvoice(params: SendInvoiceParams) {
    return this.makeRequest("/v1/invoices/send", "POST", params)
  }

  /**
   * Get invoice details
   */
  async getInvoice(invoiceId: string) {
    return this.makeRequest(`/v1/invoices/${invoiceId}`, "GET")
  }

  /**
   * Lookup bank account details
   */
  async lookupAccount(params: AccountLookupParams) {
    return this.makeRequest("/v1/accounts/lookup", "POST", params)
  }

  /**
   * Get list of supported banks
   */
  async getBanks() {
    return this.makeRequest("/v1/banks", "GET")
  }

  /**
   * One-time payment collection
   */
  async collectPayment(params: OneTimePaymentParams) {
    return this.makeRequest("/v1/payments/collect", "POST", params)
  }

  /**
   * Charge direct debit (installment payment)
   */
  async chargeDirectDebit(params: ChargeDirectDebitParams) {
    return this.makeRequest("/v1/mandates/charge", "POST", params)
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(reference: string) {
    return this.makeRequest(`/v1/payments/status/${reference}`, "GET")
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string) {
    return this.makeRequest(`/v1/transactions/${transactionId}`, "GET")
  }

  /**
   * List all mandates for a customer
   */
  async listMandates(customerEmail?: string) {
    const endpoint = customerEmail
      ? `/v1/mandates?customer_email=${customerEmail}`
      : "/v1/mandates"
    return this.makeRequest(endpoint, "GET")
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = this.generateSignature(payload)
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }
}