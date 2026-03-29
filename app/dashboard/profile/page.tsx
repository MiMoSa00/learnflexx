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
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera,
  Check,
  X,
  Loader2,
  Shield,
  Edit3
} from "lucide-react"

interface ProfileData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  bio: string
  avatar_url: string | null
  created_at: string
  is_member: boolean
}

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
    bio: ""
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession()

        if (authError || !session) {
          router.push("/login")
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
        }

        const userProfile: ProfileData = {
          id: session.user.id,
          first_name: profileData?.first_name || session.user.user_metadata?.first_name || "",
          last_name: profileData?.last_name || session.user.user_metadata?.last_name || "",
          email: session.user.email || "",
          phone: profileData?.phone || session.user.user_metadata?.phone || "",
          location: profileData?.location || "",
          bio: profileData?.bio || "",
          avatar_url: profileData?.avatar_url || session.user.user_metadata?.avatar_url || null,
          created_at: profileData?.created_at || session.user.created_at || new Date().toISOString(),
          is_member: profileData?.is_member || false
        }

        setProfile(userProfile)
        setFormData({
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          phone: userProfile.phone,
          location: userProfile.location,
          bio: userProfile.bio
        })
      } catch (err) {
        console.error("Profile fetch failed", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router, supabase])

  const handleSave = async () => {
    if (!profile) return
    
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          full_name: `${formData.first_name} ${formData.last_name}`,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setProfile({
        ...profile,
        ...formData
      })
      setEditing(false)
      setMessage({ type: "success", text: "Profile updated successfully!" })
      
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error saving profile:", err)
      setMessage({ type: "error", text: "Failed to save profile. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio
      })
    }
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <ScrollReveal direction="down" delay={0}>
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal information and preferences
            </p>
          </div>
        </ScrollReveal>

        {/* Success/Error Message */}
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

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <ScrollReveal direction="left" delay={100} className="w-full">
            <Card className="lg:col-span-1 overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="h-20 sm:h-24 bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
              <CardContent className="pt-0 -mt-10 sm:-mt-12 text-center p-4 sm:p-6">
                {/* Avatar */}
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center shadow-lg">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Name & Email */}
                <h2 className="mt-4 text-xl font-bold text-foreground break-words">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-muted-foreground text-sm break-all">{profile.email}</p>

                {/* Member Badge */}
                {profile.is_member && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    Premium Member
                  </div>
                )}

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Member since {memberSince}
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Details Card */}
          <ScrollReveal direction="right" delay={200} className="w-full">
            <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6">
                <div>
                  <CardTitle className="text-xl sm:text-2xl">Personal Information</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Update your personal details</CardDescription>
                </div>
                {!editing && (
                  <BouncyButton
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                    className="gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </BouncyButton>
                )}
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-500" />
                      First Name
                    </Label>
                    {editing ? (
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="transition-all focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-foreground font-medium py-2">{profile.first_name || "Not set"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-500" />
                      Last Name
                    </Label>
                    {editing ? (
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="transition-all focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-foreground font-medium py-2 break-words">{profile.last_name || "Not set"}</p>
                    )}
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    Email Address
                    <span className="text-[10px] sm:text-xs text-muted-foreground">(cannot be changed)</span>
                  </Label>
                  <p className="text-foreground font-medium py-2 flex items-center gap-2 break-all">
                    {profile.email}
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-500" />
                    Phone Number
                  </Label>
                  {editing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                      className="transition-all focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-foreground font-medium py-2">{profile.phone || "Not set"}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    Location
                  </Label>
                  {editing ? (
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Lagos, Nigeria"
                      className="transition-all focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-foreground font-medium py-2 break-words">{profile.location || "Not set"}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-indigo-500" />
                    Bio
                  </Label>
                  {editing ? (
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                    />
                  ) : (
                    <p className="text-foreground font-medium py-2 break-words">{profile.bio || "No bio yet"}</p>
                  )}
                </div>

                {/* Action Buttons */}
                {editing && (
                  <div className="flex gap-3 pt-4">
                    <BouncyButton
                      variant="primary"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </BouncyButton>
                    <BouncyButton
                      variant="outline"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </BouncyButton>
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Account Info */}
        <ScrollReveal direction="up" delay={300} className="w-full">
          <Card className="mt-6 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="w-5 h-5 text-indigo-500" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <p className="text-sm text-muted-foreground">Account ID</p>
                  <p className="font-mono text-sm text-foreground mt-1 truncate">{profile.id}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <p className="text-sm text-foreground mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  )
}
