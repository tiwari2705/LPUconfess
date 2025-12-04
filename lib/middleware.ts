import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user || user.isBanned || user.status !== "APPROVED") {
    return { error: NextResponse.json({ error: "Access denied" }, { status: 403 }), user: null }
  }

  return { error: null, user }
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user || user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Admin access required" }, { status: 403 }), user: null }
  }

  return { error: null, user }
}

