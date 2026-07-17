import { createClient } from "@/app/lib/supabase/client"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Email verification callback handler for Supabase auth
 * This endpoint is called when users click the email verification link
 * Handles the OAuth callback and redirects to appropriate page
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    // Exchange the code for a session
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect to the specified page (default: /dashboard)
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL("/verify-email?error=access_denied", request.url))
}
