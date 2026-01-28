# Quick Reference: PostgreSQL + Prisma Setup

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install @prisma/client prisma @next-auth/prisma-adapter

# 2. Update .env.local with DATABASE_URL
# DATABASE_URL="postgresql://postgres:password@localhost:5432/learnflex"

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Restart dev server
npm run dev

# 5. Test at http://localhost:3000/signup
```

## 📋 Prerequisites

- PostgreSQL installed and running
- Database created: `learnflex`
- .env.local with DATABASE_URL

## 🔑 Environment Variables

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/learnflex"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generated-secret>
GOOGLE_CLIENT_ID=<your-id>
GOOGLE_CLIENT_SECRET=<your-secret>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-id>
```

## 📁 New Files Created

```
prisma/
  └── schema.prisma          # Database schema
app/lib/
  ├── auth.ts               # Updated with Prisma
  ├── prisma.ts             # Prisma client
  └── password.ts           # Password hashing
.env.example                # Environment template
POSTGRES_SETUP.md           # Detailed setup guide
INSTALLATION_GUIDE.md       # Step-by-step guide
setup-db.bat               # Windows setup script
setup-db.sh                # Linux/Mac setup script
```

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| users | User accounts (email, password, profile) |
| accounts | OAuth provider connections |
| sessions | Active user sessions |
| verification_tokens | Email verification tokens |

## 🔐 Password Security

- Passwords hashed with PBKDF2 (100,000 iterations)
- Never stored in plain text
- Verified on login

## 🧪 Testing Checklist

- [ ] Signup with email/password
- [ ] Login with email/password
- [ ] Signup with Google
- [ ] Login with Google
- [ ] Check users in Prisma Studio
- [ ] Verify password is hashed

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Can't connect to database | Check DATABASE_URL, ensure PostgreSQL running |
| Tables don't exist | Run `npx prisma migrate dev --name init` |
| NEXTAUTH_SECRET not set | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| Google OAuth fails | Check credentials, verify redirect URI |

## 📚 Useful Commands

```bash
# View database GUI
npx prisma studio

# Reset database (deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name <name>

# Deploy to production
npx prisma migrate deploy
```

## 🚀 Production Checklist

- [ ] Use cloud PostgreSQL (Vercel, Supabase, Railway)
- [ ] Set all env vars in hosting platform
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Update Google OAuth credentials
- [ ] Set NEXTAUTH_URL to production domain
- [ ] Enable HTTPS
- [ ] Test signup/login on production

## 📖 Documentation

- Full setup: `INSTALLATION_GUIDE.md`
- PostgreSQL details: `POSTGRES_SETUP.md`
- NextAuth: https://next-auth.js.org/
- Prisma: https://www.prisma.io/docs/
