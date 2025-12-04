"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Flame, Clock, ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Sidebar } from "@/components/sidebar"

interface Confession {
  id: string
  text: string
  image?: string
  likesCount: number
  commentsCount: number
  isLiked?: boolean
  createdAt: string
}

export default function FeedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [confessions, setConfessions] = useState<Confession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likedConfessions, setLikedConfessions] = useState<Set<string>>(new Set())
  const [confessionText, setConfessionText] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "trending">("newest")
  const { toast } = useToast()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      const search = searchParams.get("search")
      fetchConfessions(search || undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router, sortBy, searchParams])

  const fetchConfessions = async (search?: string) => {
    try {
      const searchParam = search || searchParams.get("search") || ""
      const url = `/api/confession/list?page=1&limit=20&sort=${sortBy}${searchParam ? `&search=${encodeURIComponent(searchParam)}` : ""}`
      const res = await fetch(url)
      const data = await res.json()

      if (res.ok) {
        setConfessions(data.confessions)
        // Set liked confessions based on API response
        const likedIds = new Set(
          data.confessions
            .filter((conf: Confession & { isLiked?: boolean }) => conf.isLiked)
            .map((conf: Confession) => conf.id)
        )
        setLikedConfessions(likedIds)
      }
    } catch (error) {
      console.error("Error fetching confessions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostConfession = async () => {
    if (!confessionText.trim() || confessionText.trim().length < 10) {
      toast({
        title: "Error",
        description: "Confession must be at least 10 characters long",
        variant: "destructive",
      })
      return
    }

    setIsPosting(true)
    try {
      const res = await fetch("/api/confession/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: confessionText }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Success",
          description: "Confession posted successfully!",
        })
        setConfessionText("")
        fetchConfessions()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create confession",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPosting(false)
    }
  }

  const handleLike = async (confessionId: string) => {
    try {
      const res = await fetch("/api/confession/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confessionId }),
      })

      const data = await res.json()

      if (res.ok) {
        setConfessions((prev) =>
          prev.map((conf) =>
            conf.id === confessionId
              ? {
                  ...conf,
                  likesCount: data.liked
                    ? conf.likesCount + 1
                    : conf.likesCount - 1,
                }
              : conf
          )
        )

        if (data.liked) {
          setLikedConfessions((prev) => new Set(prev).add(confessionId))
        } else {
          setLikedConfessions((prev) => {
            const newSet = new Set(prev)
            newSet.delete(confessionId)
            return newSet
          })
        }
      }
    } catch (error) {
      console.error("Error liking confession:", error)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Post Input */}
            <div className="mb-6">
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 flex items-center gap-3">
                <Input
                  type="text"
                  placeholder="Post a Confession"
                  value={confessionText}
                  onChange={(e) => setConfessionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handlePostConfession()
                    }
                  }}
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600"
                />
                <Button
                  onClick={handlePostConfession}
                  disabled={isPosting || !confessionText.trim()}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  {isPosting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Sort Buttons */}
            <div className="mb-6 flex gap-3">
              <Button
                variant={sortBy === "newest" ? "default" : "outline"}
                onClick={() => setSortBy("newest")}
                className={sortBy === "newest" 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white"
                }
              >
                <Clock className="h-4 w-4 mr-2" />
                Newest
              </Button>
              <Button
                variant={sortBy === "trending" ? "default" : "outline"}
                onClick={() => setSortBy("trending")}
                className={sortBy === "trending" 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white"
                }
              >
                <Flame className="h-4 w-4 mr-2" />
                Trending
              </Button>
            </div>

            {/* Confessions Feed */}
            <div className="space-y-4">
              {confessions.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-400">No confessions yet. Be the first to confess!</p>
                  </CardContent>
                </Card>
              ) : (
                confessions.map((confession) => (
                  <Card key={confession.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <p className="text-white whitespace-pre-wrap mb-4 leading-relaxed">
                        {confession.text}
                      </p>
                      {confession.image && (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={confession.image}
                            alt="Confession image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(confession.id)}
                          className={`text-gray-400 hover:text-white hover:bg-gray-800 ${
                            likedConfessions.has(confession.id) ? "text-red-500" : ""
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 mr-2 ${
                              likedConfessions.has(confession.id)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                          Like
                        </Button>
                        <Link href={`/confession/${confession.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Comment
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

