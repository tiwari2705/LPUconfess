import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, user } = await requireAuth()
    if (error) return error

    const confession = await prisma.confession.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: {
            userId: user!.id,
          },
        },
        comments: {
          orderBy: {
            createdAt: "asc",
          },
          take: 50,
        },
      },
    })

    if (!confession || confession.isRemoved) {
      return NextResponse.json(
        { error: "Confession not found" },
        { status: 404 }
      )
    }

    // Return anonymous data
    return NextResponse.json({
      id: confession.id,
      text: confession.text,
      image: confession.image,
      likesCount: confession._count.likes,
      commentsCount: confession._count.comments,
      isLiked: confession.likes.length > 0,
      comments: confession.comments.map((comment) => ({
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
      })),
      createdAt: confession.createdAt,
    })
  } catch (error) {
    console.error("Get confession error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

