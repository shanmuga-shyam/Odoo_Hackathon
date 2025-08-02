"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, User, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

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

interface Activity {
  id: number
  date: string
  action: string
  description: string
}

export default function IssueDetailPage() {
  const params = useParams()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIssueDetails()
  }, [params.id])

  const fetchIssueDetails = async () => {
    try {
      // Mock data for demo
      const mockIssue: Issue = {
        id: 1,
        title: "Pothole on main road",
        description:
          "There is a large pothole on the main road that is causing traffic issues and could be dangerous for vehicles. The pothole has been there for several days and seems to be getting worse with each passing day.",
        category: "Potholes",
        status: "In Progress",
        location: "Main Street, Downtown",
        image_url: "/placeholder.svg?height=400&width=600",
        created_at: "2024-01-15T10:30:00Z",
        reported_by: 1,
      }

      const mockActivities: Activity[] = [
        {
          id: 1,
          date: "2024-01-15T10:30:00Z",
          action: "Reported by user",
          description: "Issue reported and submitted to the system",
        },
        {
          id: 2,
          date: "2024-01-16T14:15:00Z",
          action: "Assigned to municipal worker",
          description: "Issue has been assigned to the road maintenance team",
        },
        {
          id: 3,
          date: "2024-01-17T09:45:00Z",
          action: "Started In Progress",
          description: "Work has begun on fixing the pothole",
        },
      ]

      setIssue(mockIssue)
      setActivities(mockActivities)
    } catch (error) {
      console.error("Error fetching issue details:", error)
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading issue details...</p>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Issue not found</p>
      </div>
    )
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
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Issues
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issue Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{issue.title}</CardTitle>
                    <CardDescription className="mt-2">
                      Reported on {new Date(issue.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {issue.image_url && (
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <img
                      src={issue.image_url || "/placeholder.svg"}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{issue.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{issue.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>Reported by User #{issue.reported_by}</span>
                  </div>
                </div>

                <Badge variant="secondary">{issue.category}</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Track the progress of this issue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="relative">
                      {index !== activities.length - 1 && (
                        <div className="absolute left-2 top-8 w-0.5 h-full bg-gray-200" />
                      )}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-4 h-4 bg-blue-600 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                          <div className="text-sm text-gray-500 mt-1">{activity.description}</div>
                          <div className="flex items-center text-xs text-gray-400 mt-2">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(activity.date).toLocaleDateString()} at{" "}
                            {new Date(activity.date).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Map view</p>
                    <p className="text-xs text-gray-400">{issue.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
