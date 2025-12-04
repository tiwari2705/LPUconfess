import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import readline from "readline"

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function main() {
  console.log("=== Create Admin User ===\n")

  const email = await question("Enter admin email: ")
  const password = await question("Enter admin password: ")

  if (!email || !password) {
    console.error("Email and password are required!")
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        hashedPassword,
        role: "ADMIN",
        status: "APPROVED",
      },
      create: {
        email,
        hashedPassword,
        idCardImage: "https://via.placeholder.com/300x200?text=Admin+ID",
        status: "APPROVED",
        role: "ADMIN",
      },
    })

    console.log("\n✅ Admin user created successfully!")
    console.log(`Email: ${admin.email}`)
    console.log(`Role: ${admin.role}`)
  } catch (error) {
    console.error("Error creating admin:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

main()

