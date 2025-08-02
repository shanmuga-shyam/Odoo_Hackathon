"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin, Clock, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Issue {
  id: number
  title: string
  description: string
  category: string
  status: string
  location: string
  image_url?: string
  created_at: string
  reported_by: number
}

export default function DashboardPage() {
  const [userIssues, setUserIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetchUserIssues()
  }, [])

  const fetchUserIssues = async () => {
    try {
      // Mock data for demo - in real app, filter by user ID
      const mockIssues = [
        {
          id: 1,
          title: "Pothole on main road",
          description: "Large pothole causing traffic issues",
          category: "Potholes",
          status: "Pending",
          location: "Main Street, Downtown",
          image_url: "/placeholder.svg?height=200&width=300",
          created_at: "2024-01-15T10:30:00Z",
          reported_by: 1,
        },
      ]
      setUserIssues(mockIssues)
    } catch (error) {
      console.error("Error fetching user issues:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                CivicTrack
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Home</h1>
          <p className="text-gray-600">Manage your reported issues and report new ones</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                My Issues
              </CardTitle>
              <CardDescription>View and track your reported issues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{userIssues.length}</p>
              <p className="text-sm text-gray-500">Total issues reported</p>
            </CardContent>
          </Card>

          <Link href="/report">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Report New Issue
                </CardTitle>
                <CardDescription>Report a new civic issue in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Issues */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Issues</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading your issues...</p>
            </div>
          ) : userIssues.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't reported any issues yet.</p>
              <Link href="/report">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Report Your First Issue
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userIssues.map((issue) => (
                <Link key={issue.id} href={`/issue/${issue.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-video relative">
                        <img
                          src={issue.image_url || "/placeholder.svg"}
                          alt={issue.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                        <Badge className={`absolute top-2 right-2 ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{issue.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            {issue.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(issue.created_at).toLocaleDateString()}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {issue.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
