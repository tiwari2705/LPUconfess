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

interface User {
  id: string
  email: string
  idCardImage: string
  status: string
  isBanned: boolean
  createdAt: string
  _count: {
    confessions: number
  }
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      if (session?.user?.role !== "ADMIN") {
        router.push("/feed")
      } else {
        fetchUsers()
      }
    }
  }, [status, session, router, filter])

  const fetchUsers = async () => {
    try {
      const url = filter
        ? `/api/admin/users?status=${filter}`
        : "/api/admin/users"
      const res = await fetch(url)
      const data = await res.json()

      if (res.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "User approved successfully",
        })
        fetchUsers()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to approve user",
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

  const handleReject = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "User rejected successfully",
        })
        fetchUsers()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to reject user",
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

  const handleBan = async (userId: string, isBanned: boolean) => {
    try {
      const res = await fetch("/api/admin/banUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isBanned }),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: isBanned ? "User banned successfully" : "User unbanned successfully",
        })
        fetchUsers()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to update user",
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
        <div className="flex space-x-2">
          <Button
            variant={filter === null ? "default" : "outline"}
            onClick={() => setFilter(null)}
            className={filter === null ? "bg-white text-black hover:bg-gray-200" : "border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white"}
          >
            All
          </Button>
          <Button
            variant={filter === "PENDING" ? "default" : "outline"}
            onClick={() => setFilter("PENDING")}
            className={filter === "PENDING" ? "bg-white text-black hover:bg-gray-200" : "border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white"}
          >
            Pending
          </Button>
          <Button
            variant={filter === "APPROVED" ? "default" : "outline"}
            onClick={() => setFilter("APPROVED")}
            className={filter === "APPROVED" ? "bg-white text-black hover:bg-gray-200" : "border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white"}
          >
            Approved
          </Button>
          <Button
            variant={filter === "REJECTED" ? "default" : "outline"}
            onClick={() => setFilter("REJECTED")}
            className={filter === "REJECTED" ? "bg-white text-black hover:bg-gray-200" : "border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-white"}
          >
            Rejected
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {users.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400">No users found</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative w-32 h-20 rounded border border-gray-700 overflow-hidden">
                    <Image
                      src={user.idCardImage}
                      alt="ID Card"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{user.email}</p>
                        <p className="text-sm text-gray-400">
                          Status: <span className="capitalize">{user.status.toLowerCase()}</span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Confessions: {user._count.confessions}
                        </p>
                        <p className="text-sm text-gray-400">
                          Joined: {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {user.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(user.id)}
                              className="bg-white text-black hover:bg-gray-200"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(user.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {user.status === "APPROVED" && (
                          <Button
                            size="sm"
                            variant={user.isBanned ? "outline" : "destructive"}
                            onClick={() => handleBan(user.id, !user.isBanned)}
                            className={user.isBanned ? "border-gray-800 text-white hover:bg-gray-900" : ""}
                          >
                            {user.isBanned ? "Unban" : "Ban"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
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

