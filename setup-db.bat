@echo off
REM LearnFlex PostgreSQL + Prisma Setup Script (Windows)

echo.
echo 🚀 LearnFlex PostgreSQL + Prisma Setup
echo ========================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ .env.local not found!
    echo Please create .env.local with your database URL and secrets.
    echo See .env.example for reference.
    pause
    exit /b 1
)

echo ✅ .env.local found
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install @prisma/client prisma @next-auth/prisma-adapter
    call npm install -D prisma
)

echo ✅ Dependencies installed
echo.

REM Run Prisma migrations
echo 🗄️  Setting up database...
call npx prisma migrate dev --name init

echo.
echo ✅ Database setup complete!
echo.
echo Next steps:
echo 1. Verify your database: npx prisma studio
echo 2. Start dev server: npm run dev
echo 3. Test signup: http://localhost:3000/signup
echo 4. Test login: http://localhost:3000/login
echo.
pause
