// lib/course-checker.ts

export type CourseMode = "online" | "offline" | "hybrid"

export interface OnlineCourseAccess {
  type: "online"
  accessLink: string
  loginCredentials?: {
    username?: string
    password?: string
    instructions: string
  }
  gettingStartedGuide: string
}

export interface OfflineCourseAccess {
  type: "offline"
  venue: {
    name: string
    address: string
    mapLink: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  schedule: {
    startDate: string
    endDate?: string
    sessions: Array<{
      date: string
      startTime: string
      endTime: string
      topic?: string
    }>
  }
  accessCode: string
  accessInstructions: string
  providerContact: {
    name: string
    phone: string
    email: string
  }
}

export interface HybridCourseAccess {
  type: "hybrid"
  online: OnlineCourseAccess
  offline: OfflineCourseAccess
}

export type CourseAccessDetails = OnlineCourseAccess | OfflineCourseAccess | HybridCourseAccess

/**
 * Determines the course mode (online, offline, or hybrid)
 */
export function getCourseMode(course: any): CourseMode {
  if (course.courseType) {
    return course.courseType
  }
  
  // Fallback logic
  if (course.venue && course.accessLink) {
    return "hybrid"
  } else if (course.venue) {
    return "offline"
  } else {
    return "online"
  }
}

/**
 * Checks if a course is available online
 */
export function isOnlineCourse(course: any): boolean {
  const mode = getCourseMode(course)
  return mode === "online" || mode === "hybrid"
}

/**
 * Checks if a course is available offline (in-person)
 */
export function isOfflineCourse(course: any): boolean {
  const mode = getCourseMode(course)
  return mode === "offline" || mode === "hybrid"
}

/**
 * Gets the appropriate access details based on course type
 */
export function getCourseAccessDetails(courseId: string): CourseAccessDetails | null {
  // In a real app, this would fetch from database
  // For now, returning mock data based on courseId
  
  const accessData: Record<string, CourseAccessDetails> = {
    "1": {
      type: "online",
      accessLink: "https://platform.techhubacademy.com/courses/fullstack-bootcamp",
      loginCredentials: {
        instructions: "Use your registered email and the password sent to your inbox"
      },
      gettingStartedGuide: "Welcome to the Full Stack Bootcamp! Start with Module 1: HTML & CSS Fundamentals. All course materials are available in the 'Resources' tab."
    },
    "2": {
      type: "offline",
      venue: {
        name: "Creative Vision Studios - Main Campus",
        address: "24 Admiralty Way, Lekki Phase 1, Lagos",
        mapLink: "https://maps.google.com/?q=24+Admiralty+Way+Lekki+Phase+1+Lagos",
        coordinates: {
          lat: 6.4474,
          lng: 3.4700
        }
      },
      schedule: {
        startDate: "2026-02-01",
        endDate: "2026-03-26",
        sessions: [
          {
            date: "2026-02-01",
            startTime: "10:00",
            endTime: "14:00",
            topic: "Camera Basics & Settings"
          },
          {
            date: "2026-02-08",
            startTime: "10:00",
            endTime: "14:00",
            topic: "Composition & Framing"
          },
          {
            date: "2026-02-15",
            startTime: "10:00",
            endTime: "14:00",
            topic: "Lighting Techniques"
          }
        ]
      },
      accessCode: "PH2026-4782",
      accessInstructions: "Present this access code at the reception desk. Arrive 15 minutes early for your first session.",
      providerContact: {
        name: "Creative Vision Studios",
        phone: "+234 803 123 4567",
        email: "info@creativevisionstudios.com"
      }
    },
    "3": {
      type: "online",
      accessLink: "https://learn.growthacademy.com/digital-marketing",
      loginCredentials: {
        instructions: "Login with your registered email. Password reset link was sent to your email."
      },
      gettingStartedGuide: "Begin with the Digital Marketing Fundamentals module. Complete the orientation quiz to unlock all course materials."
    },
    "4": {
      type: "online",
      accessLink: "https://platform.designmasters.com/uiux-fundamentals",
      loginCredentials: {
        instructions: "Access credentials have been sent to your registered email address"
      },
      gettingStartedGuide: "Download Figma and Adobe XD before starting. Installation guides are available in the 'Setup' section."
    },
    "5": {
      type: "offline",
      venue: {
        name: "Executive Learning Center",
        address: "5 Abuja Business District, Central Area, Abuja",
        mapLink: "https://maps.google.com/?q=5+Abuja+Business+District+Central+Area+Abuja",
        coordinates: {
          lat: 9.0765,
          lng: 7.3986
        }
      },
      schedule: {
        startDate: "2026-02-05",
        endDate: "2026-05-28",
        sessions: [
          {
            date: "2026-02-05",
            startTime: "09:00",
            endTime: "17:00",
            topic: "Business Strategy"
          },
          {
            date: "2026-02-12",
            startTime: "09:00",
            endTime: "17:00",
            topic: "Financial Management"
          }
        ]
      },
      accessCode: "BM2026-9134",
      accessInstructions: "Show this code at the main entrance security. Business attire required.",
      providerContact: {
        name: "Executive Learning",
        phone: "+234 809 876 5432",
        email: "admissions@executivelearning.com"
      }
    }
  }
  
  return accessData[courseId] || null
}

/**
 * Formats a date for display
 */
export function formatSessionDate(date: string, time: string): string {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  const formattedDate = d.toLocaleDateString('en-US', options)
  return `${formattedDate} at ${time}`
}

/**
 * Calculates days until next session
 */
export function getDaysUntilNextSession(nextSessionDate: string): number {
  const today = new Date()
  const sessionDate = new Date(nextSessionDate)
  const diffTime = sessionDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}