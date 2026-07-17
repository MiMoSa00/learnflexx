# LearnFlex — My Contributions

I built the full authentication and course management system, including:

## Authentication & User Management
- **Signup form** (`app/signup/page.tsx`): Real-time password strength validation, form state management, error handling
- **Login flow** (`app/login/page.tsx`): Email/password and Google OAuth integration
- **Email verification** (`app/auth/callback/route.ts`): Handles Supabase callback and session exchange
- **Supabase client wrapper** (`app/lib/supabase/client.ts`): Secure initialization with error handling and fetch interception

## Course & Profile Features
- **Course catalog** (`app/courses/page.tsx`, `app/courses/browse-courses.tsx`): Lists and filters courses with responsive design
- **Course details** (`app/courses/[id]/`): Dynamic routing and course information pages
- **User profile** (`app/dashboard/profile/page.tsx`): Edit user info, view history, profile management

## Database & Backend
- **Schema design** (`prisma/schema.prisma`): Models for User, Profile, Courses with proper relationships
- **Auto profile creation** (`SUPABASE_TRIGGER.sql`): PostgreSQL trigger that automatically creates user profile on signup

## Why This Matters
This sample demonstrates full-stack skills: frontend validation and state management, backend auth integration, database design with triggers, and deployment-ready environment configuration. No external payment dependencies — pure core functionality.

## How to Evaluate
1. Clone the repo and follow README quickstart
2. Test signup → course browse → profile edit flow
3. Review the listed files to see validation, error handling, and database interactions
4. Check `.env.example` to understand production config
LearnFlex — Highlight of my contributions

This doc describes the focused sample I am presenting for the MLH Fellowship application.

Selected sample: Auth + Payments full‑stack flow

What I built (my contributions):

- Authentication: Implemented email/password signup, Google OAuth, session handling, and an email verification callback handler. Key files: `app/signup/page.tsx`, `app/login/page.tsx`, `app/auth/callback/route.ts`, `app/lib/supabase/client.ts`.

- Payments & Mandates: Implemented UI flows to create payment mandates and integrate with PayWithAccount / OnePipe APIs, plus dashboard payment checks. Key files: `app/create-mandate/page.tsx`, `app/create_mandate/page.tsx`, `app/dashboard/payments/page.tsx`.

- Database automation: Added a Supabase trigger to create user profiles automatically on signup (`SUPABASE_TRIGGER.sql`) and used `prisma/schema.prisma` for schema reference in the backend where applicable.

- Deployment & environment: Configured environment-driven redirects and production URLs. Documented required env variables and provided a `.env.example` for safe sharing.

Why this is a strong sample:
- Full-stack TypeScript app demonstrating auth, third-party integration, DB automation, and deployable frontend.
- Small, focused scope (auth + payments) that’s easy to review and discuss in an interview.

How to review:
- Start with `app/lib/supabase/client.ts` to see how the client is initialized, then read the signup flow in `app/signup/page.tsx`, follow the callback in `app/auth/callback/route.ts`, and finally inspect the payments flow in `app/create-mandate/page.tsx` and `app/dashboard/payments/page.tsx`.
