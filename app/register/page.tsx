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
  const [idCardPreviewUrl, setIdCardPreviewUrl] = useState<string | null>(null)
  const [idCardFileKey, setIdCardFileKey] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!consent) {
      toast({
        title: "Consent Required",
        description: "You must agree to one-time ID verification before registering.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!idCardFileKey || !idCardPreviewUrl) {
      toast({
        title: "Error",
        description: "Please upload your LPU ID card",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          idCardImage: idCardPreviewUrl,
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
          description: "Registration successful! Please wait for admin approval till EOD.",
        })
        router.push("/pending")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black p-4 flex justify-center md:justify-start items-center">

      {/* LEFT INFO PANEL */}
      <div className="hidden md:block w-1/2 pr-10 text-gray-300">
        <h2 className="text-3xl font-bold text-white mb-4">Why do we ask for your ID?</h2>

        <div className="space-y-3 text-gray-400 text-lg leading-relaxed">
          <p>• We only ask for your student ID to verify you are a real student.</p>
          <p>• Your ID is used <strong>ONLY once</strong> for manual verification.</p>
          <p>• After approval, your ID image is <strong>automatically deleted</strong> from our database.</p>
          <p>• You may create a username ending with @sayitlpu.com</p>
        </div>

        <div className="mt-5 text-green-400 space-y-1">
          <p>✔ ID used once then deleted</p>
          <p>✔ Admin cannot see passwords</p>
          <p>✔ Username keeps you anonymous</p>
        </div>
      </div>

      {/* REGISTER CARD */}
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">sayitLPU</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Create your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">

            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="username@sayitlpu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            {/* PASSWORD */}
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

            {/* ID UPLOAD */}
            <div className="space-y-2">
              <Label htmlFor="idCard" className="text-white">ID Card</Label>

              <UploadButton<OurFileRouter, "idCardUploader">
                endpoint="idCardUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setIdCardPreviewUrl(res[0].url)
                    setIdCardFileKey(res[0].key)
                  }
                }}
                onUploadError={(error: Error) => {
                  toast({
                    title: "Upload Error",
                    description: error.message,
                    variant: "destructive",
                  })
                }}
                className="ut-button:bg-gray-800 ut-button:text-white ut-button:hover:bg-gray-700 ut-allowed-content:text-gray-400"
              />

              {idCardPreviewUrl && (
                <div className="mt-2">
                  <Image
                    src={idCardPreviewUrl}
                    alt="ID Card Preview"
                    width={200}
                    height={120}
                    className="rounded border border-gray-700"
                  />
                </div>
              )}
            </div>

            {/* CONSENT CHECKBOX */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                checked={consent}
                onChange={() => setConsent(!consent)}
                className="h-4 w-4 mt-1"
              />
              <p className="text-gray-400 text-sm leading-tight">
                I consent to one-time ID verification. My ID will be deleted after approval.
              </p>
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
