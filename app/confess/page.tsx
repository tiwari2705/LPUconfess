"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Loader2 } from "lucide-react"

export default function ConfessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [text, setText] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl: string | undefined = undefined

      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imageUrl = uploadData.url
        } else if (uploadRes.status === 501) {
          // Use data URL as fallback if upload service not configured
          imageUrl = image || undefined
        } else {
          throw new Error("Failed to upload image")
        }
      }

      const res = await fetch("/api/confession/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          image: imageUrl,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Success",
          description: "Confession posted successfully!",
        })
        router.push("/feed")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create confession",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8 max-w-2xl px-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Share Your Confession</CardTitle>
            <CardDescription className="text-gray-400">
              Your identity will remain completely anonymous
            </CardDescription>
          </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text" className="text-white">Confession</Label>
              <Textarea
                id="text"
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                minLength={10}
                maxLength={5000}
                rows={8}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-400">
                {text.length}/5000 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-white">Image (Optional)</Label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
              />
              {image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden mt-2">
                  <Image
                    src={image}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-6 pt-0 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-800 text-white hover:bg-gray-900"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-white text-black hover:bg-gray-200">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Confession"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

