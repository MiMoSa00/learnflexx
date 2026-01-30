"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, X } from "lucide-react"

import { Header } from "@/app/components/layout/header"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { createClient } from "@/app/lib/supabase/client"
import { useCreateMandate, type MandatePayload } from "@/app/hooks/useCreateMandate"

// Validation Schema
const mandateSchema = z.object({
  accountNumber: z.string().length(10, "Account number must be 10 digits").regex(/^\d+$/, "Must be numbers only"),
  bankCode: z.string().min(1, "Bank code is required"),
  bvn: z.string().length(11, "BVN must be 11 digits").regex(/^\d+$/, "Must be numbers only"),
  // Hidden fields for profile data
  firstName: z.string().optional(),
  lastName: z.string().optional(), 
  email: z.string().optional(),
  phone: z.string().optional(),
})

type MandateFormValues = z.infer<typeof mandateSchema>

export default function CreateMandatePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true) // Start loading to fetch profile
  const [error, setError] = useState<string | null>(null)
  
  const { mutate: createMandate, isPending: isCreating } = useCreateMandate()

  const form = useForm<MandateFormValues>({
    resolver: zodResolver(mandateSchema),
    defaultValues: {
      accountNumber: "",
      bankCode: "",
      bvn: "",
    },
  })

  // Fetch Profile Data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push("/login")
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()

        if (profile) {
           const fullName = profile.full_name || session.user.user_metadata.full_name || ""
           const [first, ...last] = fullName.split(" ")
           
           form.setValue("firstName", first || "")
           form.setValue("lastName", last.join(" ") || "")
           form.setValue("email", session.user.email || "")
           form.setValue("phone", profile.phone || "")
        }
      } catch (err) {
        console.error("Profile fetch error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [router, form])

  const onSubmit = async (data: MandateFormValues) => {
    setError(null)
    console.log("Form Data:", data)

    // Generate unique reference
    const generateRef = () => `ref_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    // Construct Payload - send PLAIN TEXT data, let backend handle encryption
    const ref = generateRef()
    const payload: MandatePayload = {
      request_ref: ref,
      request_type: "create mandate",
      auth: {
        type: "bank.account",
        auth_provider: "PaywithAccount",
        // ❌ DON'T send secure from frontend - backend will add it
      },
      transaction: {
        mock_mode: "Inspect",
        transaction_ref: ref,
        transaction_desc: "Creating a mandate",
        transaction_ref_parent: null,
        amount: 0,
        customer: {
          customer_ref: ref,
          firstname: data.firstName || "User",
          surname: data.lastName || "User", 
          email: data.email || "user@example.com",
          mobile_no: data.phone || "08000000000",
        },
        meta: {
          amount: "1000",
          skip_consent: "true",
          bvn: data.bvn, // ✅ Send PLAIN TEXT BVN - backend will encrypt it
          biller_code: process.env.NEXT_PUBLIC_ONEPIPE_BILLER_CODE || "000752",
          customer_consent: "https://paywithaccount.com/consent_template.pdf",
          repeat_end_date: "2030-04-10-08-00-00",
          repeat_frequency: "once",
        },
        details: {},
      },
    }
    console.log("Submitting Payload:", payload)

    createMandate(payload, {
      onSuccess: async (response) => {
        console.log("Mandate Success:", response)
        
        // Update profile
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
             await supabase
            .from('profiles')
            .update({ subscription_id: 'active_mandate_' + payload.request_ref })
            .eq('id', session.user.id)
        }

        router.push("/dashboard")
        router.refresh()
      },
      onError: (err: Error) => {
        console.error("Mandate Failed:", err)
        setError(err.message || "Failed to create mandate")
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showMenuButton={true} />
      
      <main className="flex-1 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 flex items-center justify-center">
        <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-lg">
          <CardHeader className="text-center space-y-2 relative px-4 sm:px-6 pt-6 sm:pt-8">
            {/* Close Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 sm:right-4 sm:top-4 h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => router.push('/dashboard')}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold pr-8">
              Setup Payments
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base px-2 sm:px-0">
              Enter your account details to authorize a direct debit mandate.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
              {error && (
                <div className="bg-destructive/15 text-destructive px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm">
                  {error}
                </div>
              )}

              {/* Account Number */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="accountNumber" className="text-xs sm:text-sm font-medium">
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  placeholder="0000000000"
                  className="text-sm sm:text-base h-9 sm:h-10"
                  {...form.register("accountNumber")}
                />
                {form.formState.errors.accountNumber && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {form.formState.errors.accountNumber.message}
                  </p>
                )}
              </div>

              {/* Bank Code */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="bankCode" className="text-xs sm:text-sm font-medium">
                  Bank Code
                </Label>
                <Input
                  id="bankCode"
                  placeholder="Enter bank code (e.g. 214 for FCMB)"
                  className="text-sm sm:text-base h-9 sm:h-10"
                  {...form.register("bankCode")}
                />
                {form.formState.errors.bankCode && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {form.formState.errors.bankCode.message}
                  </p>
                )}
              </div>

              {/* BVN */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="bvn" className="text-xs sm:text-sm font-medium">
                  BVN
                </Label>
                <Input
                  id="bvn"
                  placeholder="00000000000"
                  className="text-sm sm:text-base h-9 sm:h-10"
                  {...form.register("bvn")}
                />
                {form.formState.errors.bvn && (
                  <p className="text-destructive text-xs sm:text-sm">
                    {form.formState.errors.bvn.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6">
              <Button 
                type="submit" 
                className="w-full text-sm sm:text-base h-9 sm:h-10 md:h-11" 
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="text-xs sm:text-sm md:text-base">Creating Mandate...</span>
                  </>
                ) : (
                  <span className="text-xs sm:text-sm md:text-base">Authorize Payment Mandate</span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
