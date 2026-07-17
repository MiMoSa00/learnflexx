# 🎓 LearnFlex

> **Nigeria's flexible online course marketplace** — discover, enroll, and pay for quality education in installments.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 📌 What is LearnFlex?

**LearnFlex** is a modern, full-stack educational e-commerce platform built specifically to address the skill-acquisition and upskilling needs of Nigerians. It is a marketplace where learners can browse thousands of courses from verified training providers across Nigeria — and most importantly, **pay for those courses in affordable installments** rather than in one lump sum.

Think of it as a bridge between people who *want* to learn and the schools, academies, and instructors who *teach* — with a flexible payment model that removes the #1 barrier to education in Nigeria: **cost**.

---

## 🇳🇬 Why LearnFlex Matters for Nigerians

### The Problem
Nigeria faces a significant skills gap. Millions of young Nigerians are eager to acquire digital skills, vocational trades, creative arts, or business knowledge — but they are locked out by:

- **Upfront course fees** that are unaffordable for the average Nigerian
- **Fragmented training landscape** with no central place to discover and compare providers
- **No payment flexibility** — courses that could change a life cost ₦50,000–₦200,000 upfront with no alternatives
- **Lack of trust** in online providers, making learners unsure of course quality
- **Poor digital infrastructure** — platforms built for Western markets do not cater to local payment methods (bank accounts, direct debits via OnePipe)

### The Solution: LearnFlex

| Problem | LearnFlex Solution |
|--------|-------------------|
| Unaffordable lump-sum fees | **Installment payments** spread over 2, 3, 4, or 6 months |
| No central course marketplace | **1,200+ courses** from 50+ verified providers in one place |
| Untrusted providers | **Verified provider badges** with quality assurance |
| Western payment systems | **OnePipe integration** — Nigeria's local banking infrastructure |
| Hard to find relevant skills | **8 Nigerian-relevant course categories** from Digital Skills to Vocational |
| Foreign-currency pricing | All prices in **₦ (Naira)** |

---

## ✨ Core Features

### 🛍️ Course Discovery & Marketplace
- **Search & Filter** — find courses by keyword, category, price range, learning mode (online/offline/hybrid), and location
- **8 Course Categories**:
  - 💻 Digital Skills (Web Dev, Programming, IT)
  - 🎨 Creative Arts (Design, Photography, Video Production)
  - 📈 Business (Entrepreneurship, Finance, Management)
  - 💼 Professional Development (Leadership, Communication, Productivity)
  - 📷 Photography (Portrait, Landscape, Editing)
  - 🔧 Vocational (Trades, Crafts, Technical Skills)
  - 🎵 Music (Instruments, Production, Theory)
  - 🗣️ Languages (English, French, Spanish, and more)
- **Detailed Course Pages** — curriculum, reviews, provider info, pricing, and learning mode

### 💳 Flexible Payment System (The Star Feature)
- **Full Payment** — one-time payment at checkout
- **Installment Plans** — 2, 3, 4, or 6-month payment plans
- **OnePipe Integration** — powered by Nigeria's OnePipe API for local bank transfers and direct debits
- **Bank Account Payments** — pay directly from any Nigerian bank account (no card required)
- **Payment Mandate Creation** — automated recurring payment mandates for installment subscribers
- **Webhook Processing** — real-time payment status updates via secure webhooks
- **Transaction History** — full payment dashboard showing what's paid, what's pending, and upcoming due dates

### 🔐 Authentication & User Management
- **Email/Password Signup** with email verification
- **Google OAuth** — one-click login with a Google account
- **Password Reset** — secure forgot-password and reset flows
- **Secure Sessions** — powered by Supabase Auth + NextAuth.js with Prisma adapter
- **Profile Management** — update name, phone number, location, and profile photo

### 📊 Learner Dashboard
- **Overview** — stats for enrolled courses, completed courses, upcoming payments, and total spent (in ₦)
- **My Courses** — progress tracking with installment payment status per course
- **Upcoming Payments** — calendar view of next payment due dates
- **Recent Activity** — timeline of all platform actions
- **Settings & Profile** — account preferences and personal information

### 🎨 World-Class UI/UX
- **Dark / Light Mode** — system-preference aware with manual toggle
- **Framer Motion Animations** — staggered reveal, hover effects, and floating cards
- **Typewriter Effects** — engaging animated headlines on the hero section
- **Animated Counters** — statistics that count up when scrolled into view
- **Smooth Scroll Reveals** — each section fades in from multiple directions
- **Fully Responsive** — optimized for mobile, tablet, and desktop
- **Glassmorphism** — premium frosted-glass UI cards
- **Radix UI** — accessible, composable headless component library

---

## 🏗️ Architecture & Project Structure

```
learnflex/
├── app/                          # Next.js 16 App Router
│   ├── page.tsx                  # Home page (landing)
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles + Tailwind theme
│   ├── providers.tsx             # React Query + Session providers
│   │
│   ├── about/                    # About page
│   ├── categories/               # Category listing
│   ├── contact/                  # Contact page
│   ├── courses/                  # All courses + search
│   ├── course-details/           # Individual course page
│   ├── course-access/            # Post-enrollment access
│   ├── faq/                      # FAQs
│   ├── how-it-works/             # Platform walkthrough page
│   ├── search/                   # Search results
│   ├── my-courses/               # Learner enrolled courses
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── refund-policy/            # Refund policy
│   │
│   ├── login/                    # Login page
│   ├── signup/                   # Registration page
│   ├── forgot-password/          # Password recovery
│   ├── reset-password/           # Password reset
│   ├── verify-email/             # Email verification
│   │
│   ├── checkout/                 # Multi-step checkout
│   │   ├── login/                # Step 1: Auth at checkout
│   │   ├── review/               # Step 2: Order review
│   │   └── payment/              # Step 3: Payment processing
│   │
│   ├── payment/                  # Payment page
│   ├── create-mandate/           # OnePipe mandate creation
│   │
│   ├── dashboard/                # Protected learner dashboard
│   │   ├── page.tsx              # Dashboard home
│   │   ├── dashbord-content.tsx  # Main dashboard UI
│   │   ├── courses/              # Enrolled courses management
│   │   ├── payments/             # Payment history
│   │   ├── profile/              # Profile settings
│   │   ├── settings/             # Account settings
│   │   └── help/                 # Help & Support
│   │
│   ├── api/                      # Next.js API Routes
│   │   ├── auth/                 # NextAuth.js handlers
│   │   ├── onepipe/              # OnePipe payment API integration
│   │   │   ├── collect/          # Collect payment
│   │   │   ├── create-mandate/   # Bank mandate creation
│   │   │   ├── get-banks/        # List Nigerian banks
│   │   │   ├── transaction-status/ # Check transaction status
│   │   │   └── webhook/          # Payment webhook receiver
│   │   ├── payments/             # Payment management
│   │   ├── paywithaccount/       # Direct bank account payment
│   │   └── webhooks/             # General webhook processor
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx        # Responsive navigation header
│   │   │   ├── footer.tsx        # Site-wide footer
│   │   │   ├── main-layout.tsx   # Page layout wrapper
│   │   │   ├── sidebar.tsx       # Dashboard sidebar
│   │   │   ├── home/             # Landing page sections
│   │   │   │   ├── hero-section.tsx
│   │   │   │   ├── categories-section.tsx
│   │   │   │   ├── featured-courses.tsx
│   │   │   │   ├── how-it-works.tsx
│   │   │   │   ├── benefits-section.tsx
│   │   │   │   ├── stats-section.tsx
│   │   │   │   ├── testimonials-section.tsx
│   │   │   │   └── cta-section.tsx
│   │   │   └── animations/       # Reusable animation components
│   │   │       ├── typewriter.tsx
│   │   │       ├── scroll-reveal.tsx
│   │   │       ├── bouncy-button.tsx
│   │   │       └── animated-counter.tsx
│   │   └── ui/                   # Radix UI + shadcn components
│   │
│   └── lib/
│       ├── supabase/             # Supabase client (server + browser)
│       └── utils.ts              # Tailwind merge utilities
│
├── prisma/
│   └── schema.prisma             # Database schema (PostgreSQL)
│
├── backend/
│   └── server.ts                 # Express.js backend server
│
├── hooks/                        # Global React hooks
├── types/                        # TypeScript type definitions
├── public/
│   └── images/
│       └── flexlogo.jpeg         # LearnFlex logo
│
├── .env.local                    # Environment variables (git-ignored)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

---

## 🔌 Integrations & Services

| Service | Purpose |
|---------|---------|
| **Supabase** | Authentication (email/password + Google OAuth), user sessions |
| **OnePipe** | Nigeria's payment API — bank account payments, mandate creation, webhooks |
| **PostgreSQL** | Primary relational database |
| **Prisma ORM** | Type-safe database access, schema management, migrations |
| **NextAuth.js** | Authentication session management with Prisma adapter |
| **Vercel** | Production deployment and hosting |
| **Vercel Analytics** | Usage analytics |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16 | Full-stack React framework with App Router |
| React | 19 | UI component library |
| TypeScript | 5.9 | Type-safe JavaScript |
| Tailwind CSS | 4 | Utility-first CSS framework |
| Framer Motion | 12 | Animations and transitions |
| Radix UI | Latest | Accessible headless UI primitives |
| Recharts | 2 | Charts and data visualization |
| React Hook Form | 7 | Form state management |
| Zod | 3 | Schema validation |
| Lucide React | 0.454 | Icon set |
| TanStack Query | 5 | Server state management and caching |
| next-themes | 0.4 | Dark/light mode |
| Sonner | 1 | Toast notifications |
| Embla Carousel | 8 | Touch-friendly carousels |
| date-fns | 4 | Date formatting and utilities |

### Backend & Database

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js API Routes | 16 | Serverless API endpoints |
| Express.js | 5 | Supplementary backend server |
| Prisma | 5.22 | ORM and schema management |
| PostgreSQL | — | Relational database |
| Supabase | 2.93 | BaaS — Auth and DB access |
| NextAuth.js | 4 | Session management |
| bcryptjs | 3 | Password hashing |
| OnePipe API | — | Nigerian payment infrastructure |

---

## 📦 Database Schema

LearnFlex uses **PostgreSQL** managed through **Prisma ORM**. Core models:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?   // bcrypt-hashed
  phone         String?   // Nigerian phone e.g. +234 xxx xxx xxxx
  location      String?   // City/state in Nigeria
  image         String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
}

model WebhookEvent {
  id        String   @id @default(cuid())
  event     String   // e.g. "payment.success"
  payload   Json     // Full OnePipe webhook payload
  source    String?  // Originating payment provider
  processed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

> Courses, enrollments, and payment tables are managed via Supabase SQL — see `SUPABASE_FULL_SETUP.sql` and `SUPABASE_TRIGGER.sql`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **PostgreSQL** 14+ (local or cloud — e.g., Supabase, Railway, Render)
- A **Supabase** project (for Auth)
- A **OnePipe** account (for payments — optional for local development)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/learnflex.git
cd learnflex
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file at the project root:

```env
# ─── Database ────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/learnflex"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/learnflex"

# ─── Supabase ────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─── NextAuth ────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret

# ─── Google OAuth ────────────────────────────────────────
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# ─── OnePipe (Payment) ───────────────────────────────────
ONEPIPE_API_KEY=your-onepipe-api-key
ONEPIPE_API_SECRET=your-onepipe-secret
```

Generate `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Set up the database

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# (Optional) Browse data in the GUI
npx prisma studio
```

### 5. Set up Supabase tables

Run the following SQL scripts against your Supabase project in order:

```
SUPABASE_FULL_SETUP.sql      → Core tables (profiles, courses, enrollments)
SUPABASE_TRIGGER.sql         → Auto-create profile on user signup
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Generate Prisma client and build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint across the codebase |
| `npx prisma studio` | Open the Prisma database GUI |
| `npx prisma migrate dev` | Run database migrations in development |
| `npx prisma migrate deploy` | Deploy migrations in production |

---

## 🔄 User Journey

```
1. DISCOVER  →  Browse 1,200+ courses or search by skill/category
2. CHOOSE    →  View course details, curriculum, and pricing (in ₦)
3. ENROLL    →  Sign up or log in, then pick full pay or installment plan
4. PAY       →  Complete via Nigerian bank account (OnePipe) or card
5. LEARN     →  Get instant access online or an access code for in-person sessions
6. TRACK     →  Monitor progress, payment schedule, and certificates on the dashboard
```

---

## 🌟 Success Stories

The platform is built with real Nigerian learners in mind:

- **Adaobi Nwosu (Lagos)** — Could not afford her ₦120,000 web dev course upfront. Paid in 3 installments and is now working as a junior developer.
- **Emeka Okonkwo (Abuja)** — Used the installment plan for a Digital Marketing Masterclass and landed a new job within 3 months.
- **Fatima Ibrahim (Kano)** — Enrolled in Professional Photography at her own pace while managing her household budget.
- **Chukwuma Eze (Enugu)** — Got his Electrical Installation certification with hands-on offline training funded through monthly installments.

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (salted, industry-standard)
- Sessions managed via **NextAuth.js** + **Supabase Auth** (JWT-based)
- Webhook payloads validated, stored, and audited (`WebhookEvent` model)
- Sensitive keys never exposed to the client (strict `NEXT_PUBLIC_` prefix policy)
- Google OAuth through secure OAuth 2.0 flows

---

## 📁 Additional Documentation

| File | Purpose |
|------|---------|
| `INSTALLATION_GUIDE.md` | Full PostgreSQL + Prisma setup on Windows |
| `NEXTAUTH_SETUP.md` | NextAuth.js configuration guide |
| `POSTGRES_SETUP.md` | PostgreSQL installation guide |
| `POSTGRES_PRISMA_COMPLETE.md` | Full Prisma + PostgreSQL walkthrough |
| `QUICK_SETUP_CHECKLIST.md` | Fast setup checklist |
| `QUICK_REFERENCE.md` | Common commands and references |
| `SETUP_GUIDE.md` | General project setup guide |

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure code passes `npm run lint` and follows existing TypeScript patterns.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🙏 Acknowledgements

- [OnePipe](https://onepipe.io/) — Nigeria-native payment infrastructure
- [Supabase](https://supabase.com/) — open-source Firebase alternative
- [Vercel](https://vercel.com/) — seamless Next.js deployments
- [Radix UI](https://www.radix-ui.com/) — accessible UI primitives
- The Nigerian tech community 🇳🇬 — for inspiring this platform

---

<p align="center">
  Built with ❤️ for Nigeria's next generation of skilled professionals.
</p>
