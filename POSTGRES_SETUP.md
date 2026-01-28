# PostgreSQL + Prisma Setup Guide

This guide walks you through setting up PostgreSQL with Prisma ORM for your LearnFlex authentication system.

## Prerequisites

- PostgreSQL installed locally or access to a PostgreSQL server
- Node.js and npm installed
- Your Google OAuth credentials (Client ID and Secret)

## Step 1: Install Dependencies

Run the following command to install Prisma and PostgreSQL driver:

```bash
npm install @prisma/client prisma @next-auth/prisma-adapter bcryptjs
npm install -D prisma
```

## Step 2: Set Up PostgreSQL Database

### Option A: Local PostgreSQL (Windows)

1. **Install PostgreSQL** from https://www.postgresql.org/download/windows/
2. **Create a new database**:
   - Open pgAdmin (comes with PostgreSQL)
   - Right-click "Databases" → Create → Database
   - Name it: `learnflex`
   - Owner: `postgres` (or your user)

3. **Get your connection string**:
   ```
   postgresql://postgres:your_password@localhost:5432/learnflex
   ```

### Option B: Cloud PostgreSQL (Recommended for Production)

Use one of these services:
- **Vercel Postgres**: https://vercel.com/storage/postgres
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app
- **Render**: https://render.com

They provide a connection string like:
```
postgresql://user:password@host:5432/database
```

## Step 3: Update Environment Variables

Edit your `.env.local` file and add:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/learnflex"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

Replace:
- `your_password` with your PostgreSQL password
- `your-generated-secret` with output from: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Google credentials with your actual values

## Step 4: Initialize Prisma

Run the following command to create the database schema:

```bash
npx prisma migrate dev --name init
```

This will:
1. Create all tables in your PostgreSQL database
2. Generate Prisma Client
3. Create a migration file

You should see output like:
```
✔ Your database has been successfully initialized!
```

## Step 5: Verify Database Setup

Check that tables were created:

```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can view your database tables.

## Step 6: Restart Your Dev Server

Stop and restart your Next.js dev server:

```bash
npm run dev
```

## Step 7: Test Authentication

1. Go to http://localhost:3000/signup
2. Create an account with email and password
3. Check the database in Prisma Studio to see the user was created
4. Go to http://localhost:3000/login and sign in
5. Test Google OAuth sign-in

## Database Schema

Your database now has these tables:

- **users**: Stores user accounts (email, name, password hash, phone, location)
- **accounts**: Stores OAuth provider connections (Google, etc.)
- **sessions**: Stores active user sessions
- **verification_tokens**: For email verification (future feature)

## Common Commands

```bash
# View database in GUI
npx prisma studio

# Create a new migration after schema changes
npx prisma migrate dev --name <migration_name>

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client after manual schema edits
npx prisma generate

# Check database connection
npx prisma db execute --stdin < query.sql
```

## Troubleshooting

### "Can't reach database server"
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Verify firewall allows connections

### "relation 'users' does not exist"
- Run: `npx prisma migrate dev --name init`

### "password authentication failed"
- Check your PostgreSQL password in DATABASE_URL
- Verify user has database creation permissions

### "NEXTAUTH_SECRET is not set"
- Generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Add to .env.local

## Production Deployment

When deploying to production (Vercel, Railway, etc.):

1. **Set environment variables** in your hosting platform's dashboard:
   - DATABASE_URL (use production database)
   - NEXTAUTH_URL (your production domain)
   - NEXTAUTH_SECRET
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - NEXT_PUBLIC_GOOGLE_CLIENT_ID

2. **Run migrations** on production database:
   ```bash
   npx prisma migrate deploy
   ```

3. **Update Google OAuth** in Google Cloud Console:
   - Add production domain to "Authorized JavaScript origins"
   - Add `https://yourdomain.com/api/auth/callback/google` to "Authorized redirect URIs"

## Next Steps

1. Add email verification flow
2. Add password reset functionality
3. Add user profile management
4. Add role-based access control (RBAC)
5. Add audit logging

## Resources

- Prisma Docs: https://www.prisma.io/docs/
- NextAuth Docs: https://next-auth.js.org/
- PostgreSQL Docs: https://www.postgresql.org/docs/
