import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const removeSchema = z.object({
  confessionId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const body = await req.json()
    const { confessionId } = removeSchema.parse(body)

    await prisma.confession.update({
      where: { id: confessionId },
      data: { isRemoved: true },
    })

    return NextResponse.json({
      message: "Confession removed successfully",
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Remove confession error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

