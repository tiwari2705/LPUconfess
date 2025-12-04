"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Stats {
  totalUsers: number
  pendingUsers: number
  approvedUsers: number
  totalConfessions: number
  totalReports: number
  totalLikes: number
  totalComments: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/feed")
      } else {
        fetchStats()
      }
    }
  }, [status, session, router])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      const data = await res.json()

      if (res.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{stats.pendingUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Total Confessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalConfessions}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.totalReports}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">Manage the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/users">
              <Card className="p-4 hover:bg-gray-800 cursor-pointer bg-gray-800 border-gray-700">
                <CardTitle className="text-base text-white">User Verifications</CardTitle>
                <CardDescription className="text-gray-400">
                  Review and approve pending user registrations
                </CardDescription>
              </Card>
            </Link>
            <Link href="/admin/reports">
              <Card className="p-4 hover:bg-gray-800 cursor-pointer bg-gray-800 border-gray-700">
                <CardTitle className="text-base text-white">Reported Content</CardTitle>
                <CardDescription className="text-gray-400">
                  Review and moderate reported confessions
                </CardDescription>
              </Card>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Platform Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-white">
              <span>Approved Users:</span>
              <span className="font-bold">{stats.approvedUsers}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Likes:</span>
              <span className="font-bold">{stats.totalLikes}</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Total Comments:</span>
              <span className="font-bold">{stats.totalComments}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}

