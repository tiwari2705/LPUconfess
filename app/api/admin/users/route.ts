import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") as "PENDING" | "APPROVED" | "REJECTED" | null

    const where = status ? { status } : {}

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        idCardImage: true,
        status: true,
        isBanned: true,
        createdAt: true,
        _count: {
          select: {
            confessions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

