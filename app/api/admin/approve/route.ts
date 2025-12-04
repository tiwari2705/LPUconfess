import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const approveSchema = z.object({
  userId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const body = await req.json()
    const { userId } = approveSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: "APPROVED" },
    })

    return NextResponse.json({
      message: "User approved successfully",
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
      },
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Approve user error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

