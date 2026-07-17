LearnFlex — Highlight of my contributions

I built the core authentication and payments flows in this sample, including:

- Signup and login UI with client-side validation: `app/signup/page.tsx`, `app/login/page.tsx`
- Supabase integration (client wrapper, auth flows): `app/lib/supabase/client.ts`, `app/auth/callback/route.ts`
- Payment/mandate UI and flow: `app/create-mandate`, `app/dashboard/payments`
- Database automation: `SUPABASE_TRIGGER.sql` creates user profiles on signup
- Deployment-ready configuration and environment variable management (see `.env.example`)

Why this is interesting
- Integrates frontend, backend, and third-party services (Supabase, OnePipe/PayWithAccount)
- Demonstrates real-world concerns: secure secrets, redirect flows, and production deployment settings

How to evaluate
1. Clone the repo and follow the README quickstart.
2. Inspect the listed files to see validation, API use, and database interactions.
3. Run the signup → dashboard and payment mandate flows locally or on the provided demo.

If you'd like, I can add unit tests and a short demo video to strengthen the submission.
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
