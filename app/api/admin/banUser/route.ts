import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const banSchema = z.object({
  userId: z.string(),
  isBanned: z.boolean(),
})

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const body = await req.json()
    const { userId, isBanned } = banSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBanned },
    })

    return NextResponse.json({
      message: isBanned ? "User banned successfully" : "User unbanned successfully",
      user: {
        id: user.id,
        email: user.email,
        isBanned: user.isBanned,
      },
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Ban user error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

