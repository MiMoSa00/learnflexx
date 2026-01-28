# Complete PostgreSQL + Prisma Installation Guide

Follow these steps to set up PostgreSQL and Prisma for your LearnFlex authentication system.

## 📋 Checklist

- [ ] PostgreSQL installed and running
- [ ] Database created (`learnflex`)
- [ ] Dependencies installed
- [ ] .env.local configured with DATABASE_URL
- [ ] Prisma migrations run
- [ ] Dev server restarted
- [ ] Authentication tested

## 🔧 Installation Steps

### Step 1: Install PostgreSQL (Windows)

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Set password for `postgres` user (remember this!)
   - Keep port as 5432
   - Select "Stack Builder" at the end (optional)
4. Verify installation by opening Command Prompt:
   ```cmd
   psql --version
   ```

### Step 2: Create Database

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name: `learnflex`
4. Owner: `postgres`
5. Click Save

**Option B: Using Command Line**
```cmd
psql -U postgres
```
Then in the psql prompt:
```sql
CREATE DATABASE learnflex;
\q
```

### Step 3: Get Your Connection String

Your DATABASE_URL should be:
```
postgresql://postgres:YOUR_PASSWORD@localhost:5432/learnflex
```

Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

### Step 4: Update .env.local

Edit `c:\Users\DELL\Desktop\LearnFlex\.env.local` and add:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/learnflex"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

**Generate NEXTAUTH_SECRET:**
```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste into NEXTAUTH_SECRET.

### Step 5: Install Dependencies

Open Command Prompt in your project directory and run:

```cmd
npm install @prisma/client prisma @next-auth/prisma-adapter
npm install -D prisma
```

This installs:
- `@prisma/client` - Prisma database client
- `prisma` - Prisma CLI
- `@next-auth/prisma-adapter` - NextAuth adapter for Prisma

### Step 6: Run Database Migrations

```cmd
npx prisma migrate dev --name init
```

This will:
1. Connect to your PostgreSQL database
2. Create all required tables
3. Generate Prisma Client
4. Create a migration file

You should see:
```
✔ Your database has been successfully initialized!
```

### Step 7: Verify Database Setup

Open Prisma Studio to view your database:

```cmd
npx prisma studio
```

This opens http://localhost:5555 where you can see:
- `users` table (empty)
- `accounts` table (for OAuth)
- `sessions` table (for active sessions)
- `verification_tokens` table (for email verification)

### Step 8: Restart Dev Server

Stop your current dev server (Ctrl+C) and restart:

```cmd
npm run dev
```

## ✅ Testing

1. **Test Email Signup:**
   - Go to http://localhost:3000/signup
   - Fill in the form with:
     - Full Name: Test User
     - Email: test@example.com
     - Phone: +234 123 456 7890
     - Location: Lagos
     - Password: TestPassword123
     - Confirm Password: TestPassword123
     - Check "I agree to terms"
   - Click "Create Account"
   - You should be redirected to /dashboard

2. **Verify User in Database:**
   - Run: `npx prisma studio`
   - Go to `users` table
   - You should see your test user

3. **Test Email Login:**
   - Go to http://localhost:3000/login
   - Enter: test@example.com / TestPassword123
   - Click "Sign In"
   - You should be redirected to /dashboard

4. **Test Google OAuth:**
   - Go to http://localhost:3000/signup or /login
   - Click "Continue with Google"
   - Sign in with your Google account
   - You should be redirected to /dashboard
   - Check Prisma Studio - you should see a new user and account

## 🐛 Troubleshooting

### Error: "Can't reach database server"
**Solution:**
1. Ensure PostgreSQL is running:
   ```cmd
   psql -U postgres
   ```
2. Check DATABASE_URL in .env.local
3. Verify password is correct

### Error: "relation 'users' does not exist"
**Solution:**
```cmd
npx prisma migrate dev --name init
```

### Error: "NEXTAUTH_SECRET is not set"
**Solution:**
1. Generate a secret:
   ```cmd
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Add to .env.local:
   ```env
   NEXTAUTH_SECRET=your-generated-secret
   ```
3. Restart dev server

### Error: "password authentication failed"
**Solution:**
1. Check your PostgreSQL password
2. Update DATABASE_URL with correct password
3. Restart dev server

### Google OAuth not working
**Solution:**
1. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
2. Check Google Cloud Console:
   - Authorized JavaScript origins: http://localhost:3000
   - Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
3. Restart dev server

## 📚 Useful Commands

```cmd
# View database in GUI
npx prisma studio

# View database schema
npx prisma db push

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name <name>

# Deploy migrations to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## 🚀 Production Deployment

When deploying to production:

1. **Use a cloud PostgreSQL service:**
   - Vercel Postgres
   - Supabase
   - Railway
   - Render

2. **Set environment variables** in your hosting platform

3. **Run migrations:**
   ```cmd
   npx prisma migrate deploy
   ```

4. **Update Google OAuth** in Google Cloud Console with production domain

## 📖 Next Steps

1. ✅ Database setup complete
2. ⏭️ Add email verification
3. ⏭️ Add password reset
4. ⏭️ Add user profile management
5. ⏭️ Add role-based access control

## 🔗 Resources

- PostgreSQL: https://www.postgresql.org/
- Prisma: https://www.prisma.io/
- NextAuth: https://next-auth.js.org/
- pgAdmin: https://www.pgadmin.org/

## ❓ Need Help?

If you encounter issues:
1. Check the error message carefully
2. Review the troubleshooting section above
3. Check Prisma logs: `npx prisma db execute --stdin`
4. Review .env.local for typos
5. Ensure PostgreSQL is running
