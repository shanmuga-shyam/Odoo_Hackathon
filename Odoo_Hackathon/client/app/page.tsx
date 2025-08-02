"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Clock } from "lucide-react"
import Link from "next/link"

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

export default function HomePage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const categories = ["All", "Potholes", "Streetlights", "Garbage", "Water", "Traffic"]
  const statuses = ["All", "Pending", "In Progress", "Resolved"]

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      const response = await fetch("http://localhost:8000/issues/list")
      const data = await response.json()
      setIssues(data)
    } catch (error) {
      console.error("Error fetching issues:", error)
      // Mock data for demo
      setIssues([
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
        {
          id: 2,
          title: "Broken streetlight",
          description: "Street light not working for 3 days",
          category: "Streetlights",
          status: "In Progress",
          location: "Oak Avenue",
          image_url: "/placeholder.svg?height=200&width=300",
          created_at: "2024-01-14T15:45:00Z",
          reported_by: 2,
        },
        {
          id: 3,
          title: "Garbage not collected",
          description: "Garbage bins overflowing",
          category: "Garbage",
          status: "Resolved",
          location: "Pine Street",
          image_url: "/placeholder.svg?height=200&width=300",
          created_at: "2024-01-13T09:20:00Z",
          reported_by: 3,
        },
      ])
    }
  }

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || issue.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || issue.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

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
              <h1 className="text-2xl font-bold text-gray-900">CivicTrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Issues</h2>
          <p className="text-gray-600">User can also able to see nearby issues without login</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <Link key={issue.id} href={`/issue/${issue.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-video relative">
                    <img
                      src={issue.image_url || "/placeholder.svg"}
                      alt={issue.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(issue.status)}`}>{issue.status}</Badge>
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

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No issues found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  )
}
