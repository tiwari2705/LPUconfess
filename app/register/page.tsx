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
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [idCardFileKey, setidCardFileKey] = useState<string | null>(null)
  const [idCardFileKey, setIdCardFileKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!idCardFileKey || !idCardFileKey) {
      toast({
        title: "Error",
        description: "Please upload your LPU ID card",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Register user with UploadThing file info
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          idCardFileKey,
          idCardFileKey,
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
          <CardTitle className="text-2xl font-bold text-center text-white">sayitlpu</CardTitle>
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
              <UploadButton<OurFileRouter>
                endpoint="idCardUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setidCardFileKey(res[0].url)
                    setIdCardFileKey(res[0].key)
                    toast({
                      title: "Success",
                      description: "ID card uploaded successfully",
                    })
                  }
                }}
                onUploadError={(error: Error) => {
                  toast({
                    title: "Upload Error",
                    description: error.message || "Failed to upload ID card",
                    variant: "destructive",
                  })
                }}
                className="ut-button:bg-gray-800 ut-button:text-white ut-button:hover:bg-gray-700 ut-allowed-content:text-gray-400"
              />
              {idCardFileKey && (
                <div className="mt-2">
                  <Image
                    src={idCardFileKey}
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

