"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
// import type { User } from "@supabase/supabase-js"
import DashboardContent from "./dashbord-content"

interface DashboardUser {
  name?: string | null
  email?: string | null
  image?: string | null
  id?: string
}

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession()

        if (authError || !session) {
          router.push("/login")
          return
        }

        // Fetch Profile (optional - user might not have a profile yet)
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()

        // Profile is optional - no need to log errors

        // Check Subscription ID - Redirect to mandate creation if no subscription
        if (!profile?.subscription_id) {
          router.push("/create-mandate")
          return
        }

        // Construct Dashboard User
        const dashboardUser: DashboardUser = {
          id: session.user.id,
          email: session.user.email,
          name: profile?.full_name || session.user.user_metadata?.full_name || "User",
          image: session.user.user_metadata?.avatar_url,
        }

        setUser(dashboardUser)
      } catch (err) {
        console.error("Dashboard auth check failed", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <DashboardContent user={user} />
}