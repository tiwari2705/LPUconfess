import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { UTApi } from "uploadthing/server"

const rejectSchema = z.object({
  userId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const body = await req.json()
    const { userId } = rejectSchema.parse(body)

    // Get user with file key before updating
    const userBeforeUpdate = await prisma.user.findUnique({
      where: { id: userId },
      select: { idCardFileKey: true },
    })

    // Update user status to REJECTED
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: "REJECTED" },
    })

    // Delete the ID card image from UploadThing after rejection
    if (userBeforeUpdate?.idCardFileKey) {
      try {
        const utapi = new UTApi({
          token: process.env.UPLOADTHING_TOKEN,
        })
        await utapi.deleteFiles(userBeforeUpdate.idCardFileKey)
        
        // Clear the file key from database after successful deletion
        await prisma.user.update({
          where: { id: userId },
          data: { idCardFileKey: null },
        })
      } catch (deleteError) {
        // Log error but don't fail the rejection process
        console.error("Error deleting ID card image:", deleteError)
      }
    }

    return NextResponse.json({
      message: "User rejected successfully",
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

    console.error("Reject user error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

