import { prisma } from "./app/lib/prisma"

async function main() {
  console.log("🔍 Testing database connection...")
  
  try {
    // Test connection
    await prisma.$connect()
    console.log("✅ Database connected successfully!")

    // Count records in each table
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    const sessionCount = await prisma.session.count()

    console.log(`📊 Users: ${userCount}`)
    console.log(`📊 Accounts: ${accountCount}`)
    console.log(`📊 Sessions: ${sessionCount}`)

    console.log("✅ All tests passed!")
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()