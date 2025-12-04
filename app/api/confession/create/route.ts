import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware"
import { confessionSchema } from "@/lib/validations"
import { prisma } from "@/lib/prisma"
import { sanitizeText } from "@/lib/sanitize"

export async function POST(req: NextRequest) {
  try {
    const { error, user } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const { text, image } = confessionSchema.parse(body)

    const confession = await prisma.confession.create({
      data: {
        text: sanitizeText(text),
        image: image || null,
        authorId: user!.id,
      },
    })

    return NextResponse.json(
      {
        id: confession.id,
        text: confession.text,
        image: confession.image,
        createdAt: confession.createdAt,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Create confession error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

