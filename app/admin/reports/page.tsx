"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface Report {
  id: string
  reason: string
  createdAt: string
  confession: {
    id: string
    text: string
    image?: string
    createdAt: string
    isRemoved: boolean
  }
}

export default function AdminReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/feed")
      } else {
        fetchReports()
      }
    }
  }, [status, session, router])

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/admin/reports")
      const data = await res.json()

      if (res.ok) {
        setReports(data.reports)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveConfession = async (confessionId: string) => {
    if (!confirm("Are you sure you want to remove this confession?")) {
      return
    }

    try {
      const res = await fetch("/api/admin/removeConfession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confessionId }),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Confession removed successfully",
        })
        fetchReports()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to remove confession",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
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
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-white">Reported Content</h1>

        <div className="space-y-4">
          {reports.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400">No reports found</p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <p className="text-sm text-gray-400 mb-1">
                        Reported {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                      </p>
                      <p className="font-semibold text-white">Reason:</p>
                      <p className="text-sm text-white">{report.reason}</p>
                    </div>

                    <div className="border-t border-gray-800 pt-4">
                      <p className="text-sm text-gray-400 mb-2">
                        Confession posted {formatDistanceToNow(new Date(report.confession.createdAt), { addSuffix: true })}
                      </p>
                      <p className="mb-2 whitespace-pre-wrap text-white">{report.confession.text}</p>
                      {report.confession.image && (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={report.confession.image}
                            alt="Reported confession"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {report.confession.isRemoved && (
                        <p className="text-sm text-red-400 font-semibold">[REMOVED]</p>
                      )}
                    </div>

                    {!report.confession.isRemoved && (
                      <div className="flex justify-end">
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveConfession(report.confession.id)}
                        >
                          Remove Confession
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

