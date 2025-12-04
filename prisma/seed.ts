import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const adminEmail = "admin@lpuconfess.com"
  const adminPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      hashedPassword: adminPassword,
      idCardImage: "https://via.placeholder.com/300x200?text=Admin+ID",
      status: "APPROVED",
      role: "ADMIN",
    },
  })

  console.log("Admin user created:", admin.email)
  console.log("Admin password: admin123")
  console.log("\n⚠️  IMPORTANT: Change the admin password after first login!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

