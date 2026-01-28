#!/bin/bash

# LearnFlex PostgreSQL + Prisma Setup Script
# This script helps set up your database and authentication

echo "🚀 LearnFlex PostgreSQL + Prisma Setup"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "Please create .env.local with your database URL and secrets."
    echo "See .env.example for reference."
    exit 1
fi

echo "✅ .env.local found"
echo ""

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install @prisma/client prisma @next-auth/prisma-adapter
    npm install -D prisma
fi

echo "✅ Dependencies installed"
echo ""

# Run Prisma migrations
echo "🗄️  Setting up database..."
npx prisma migrate dev --name init

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify your database: npx prisma studio"
echo "2. Start dev server: npm run dev"
echo "3. Test signup: http://localhost:3000/signup"
echo "4. Test login: http://localhost:3000/login"
echo ""
