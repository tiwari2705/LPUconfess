"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [idCardImage, setIdCardImage] = useState<string | null>(null)
  const [idCardFile, setIdCardFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIdCardFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setIdCardImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!idCardFile) {
      toast({
        title: "Error",
        description: "Please upload your LPU ID card",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Upload ID card image
      const formData = new FormData()
      formData.append("file", idCardFile)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        // For now, use a placeholder URL if upload service is not configured
        // In production, you must set up UploadThing or Cloudinary
        const uploadData = await uploadRes.json()
        if (uploadRes.status === 501) {
          toast({
            title: "Upload Service Not Configured",
            description: "Please set up UploadThing or Cloudinary. Using placeholder for now.",
            variant: "destructive",
          })
          // Use data URL as fallback (not recommended for production)
          const imageUrl = idCardImage || ""
          
          const registerRes = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              idCardImage: imageUrl,
            }),
          })

          const registerData = await registerRes.json()

          if (!registerRes.ok) {
            toast({
              title: "Error",
              description: registerData.error || "Registration failed",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Success",
              description: "Registration successful! Please wait for admin approval.",
            })
            router.push("/pending")
          }
        } else {
          throw new Error(uploadData.error || "Upload failed")
        }
      } else {
        const uploadData = await uploadRes.json()
        const imageUrl = uploadData.url

        // Register user
        const registerRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            idCardImage: imageUrl,
          }),
        })

        const registerData = await registerRes.json()

        if (!registerRes.ok) {
          toast({
            title: "Error",
            description: registerData.error || "Registration failed",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Registration successful! Please wait for admin approval.",
          })
          router.push("/pending")
        }
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
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">LPUconfess</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idCard" className="text-white">ID Card</Label>
              <Input
                id="idCard"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
              />
              {idCardImage && (
                <div className="mt-2">
                  <Image
                    src={idCardImage}
                    alt="ID Card Preview"
                    width={200}
                    height={120}
                    className="rounded border border-gray-700"
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
            <p className="text-sm text-center text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

