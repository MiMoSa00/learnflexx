"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"
import { ScrollReveal } from "@/app/components/layout/animations/scroll-reveal"
import { BouncyButton } from "@/app/components/layout/animations/bouncy-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { 
  Settings,
  Bell,
  Lock,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Mail,
  MessageSquare,
  Smartphone,
  Trash2,
  Download,
  ChevronRight
} from "lucide-react"

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Password change
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailPaymentReminders: true,
    emailCourseUpdates: true,
    emailPromotions: false,
    smsPaymentReminders: true,
    smsCourseUpdates: false
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          router.push("/login")
          return
        }
        setUserId(session.user.id)
      } catch (err) {
        console.error("Auth check failed", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router, supabase])

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match" })
      return
    }
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })
      if (error) throw error

      setMessage({ type: "success", text: "Password updated successfully!" })
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordSection(false)
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update password" })
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationSave = async () => {
    setSaving(true)
    try {
      // In a real app, save to database
      await new Promise(resolve => setTimeout(resolve, 500))
      setMessage({ type: "success", text: "Notification preferences saved!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save preferences" })
    } finally {
      setSaving(false)
    }
  }

  const getPasswordStrength = (password: string): { level: number; text: string; color: string } => {
    if (!password) return { level: 0, text: "", color: "" }
    if (password.length < 6) return { level: 1, text: "Weak", color: "bg-red-500" }
    if (password.length < 8) return { level: 2, text: "Fair", color: "bg-yellow-500" }
    if (password.length < 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { level: 3, text: "Good", color: "bg-blue-500" }
    }
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { level: 4, text: "Strong", color: "bg-green-500" }
    }
    return { level: 2, text: "Fair", color: "bg-yellow-500" }
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="down" delay={0}>
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-3">
              <Settings className="w-8 h-8 text-indigo-600" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>
        </ScrollReveal>

        {/* Message */}
        {message && (
          <ScrollReveal direction="down" delay={0}>
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success" 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {message.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              {message.text}
            </div>
          </ScrollReveal>
        )}

        <div className="space-y-6">
          {/* Password Section */}
          <ScrollReveal direction="up" delay={100}>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your account password</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${showPasswordSection ? 'rotate-90' : ''}`} />
                </div>
              </CardHeader>
              {showPasswordSection && (
                <CardContent className="space-y-4 border-t dark:border-gray-700 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength indicator */}
                    {passwordData.newPassword && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                level <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs ${passwordStrength.color.replace('bg-', 'text-')}`}>
                          {passwordStrength.text}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <BouncyButton
                    variant="primary"
                    onClick={handlePasswordChange}
                    disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="w-full sm:w-auto"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                    Update Password
                  </BouncyButton>
                </CardContent>
              )}
            </Card>
          </ScrollReveal>

          {/* Notification Preferences */}
          <ScrollReveal direction="up" delay={200}>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2 text-foreground">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    Email Notifications
                  </h4>
                  <div className="space-y-3 pl-6">
                    {[
                      { key: 'emailPaymentReminders', label: 'Payment reminders' },
                      { key: 'emailCourseUpdates', label: 'Course updates' },
                      { key: 'emailPromotions', label: 'Promotions and offers' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {item.label}
                        </span>
                        <div 
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            notifications[item.key as keyof typeof notifications] 
                              ? 'bg-indigo-600' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          onClick={() => setNotifications({ 
                            ...notifications, 
                            [item.key]: !notifications[item.key as keyof typeof notifications] 
                          })}
                        >
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 shadow"
                            style={{ left: notifications[item.key as keyof typeof notifications] ? '20px' : '2px' }} />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2 text-foreground">
                    <Smartphone className="w-4 h-4 text-indigo-500" />
                    SMS Notifications
                  </h4>
                  <div className="space-y-3 pl-6">
                    {[
                      { key: 'smsPaymentReminders', label: 'Payment reminders' },
                      { key: 'smsCourseUpdates', label: 'Course updates' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {item.label}
                        </span>
                        <div 
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            notifications[item.key as keyof typeof notifications] 
                              ? 'bg-indigo-600' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          onClick={() => setNotifications({ 
                            ...notifications, 
                            [item.key]: !notifications[item.key as keyof typeof notifications] 
                          })}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow`} 
                            style={{ left: notifications[item.key as keyof typeof notifications] ? '20px' : '2px' }} />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <BouncyButton
                  variant="primary"
                  onClick={handleNotificationSave}
                  disabled={saving}
                  className="mt-4"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                  Save Preferences
                </BouncyButton>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Privacy & Security */}
          <ScrollReveal direction="up" delay={300}>
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>Manage your data and security settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-indigo-500" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">Download My Data</p>
                      <p className="text-sm text-muted-foreground">Get a copy of your account data (NDPR compliance)</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <div className="text-left">
                      <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                      <p className="text-sm text-red-500/80">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
