"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ReportPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    image_url: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const categories = ["Potholes", "Streetlights", "Garbage", "Water", "Traffic", "Other"]

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const uploadImage = async () => {
    if (!selectedFile) return ""

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", selectedFile)

      const response = await fetch("http://localhost:8000/issues/upload-image", {
        method: "POST",
        body: formDataUpload,
      })

      const data = await response.json()
      if (response.ok) {
        return data.image_url
      } else {
        throw new Error("Image upload failed")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      return ""
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      let imageUrl = ""
      if (selectedFile) {
        imageUrl = await uploadImage()
      }

      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/issues/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Issue reported successfully!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(data.detail || "Failed to report issue")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
                CivicTrack
              </Link>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report New Issue</h1>
          <p className="text-gray-600">Help improve your community by reporting civic issues</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
            <CardDescription>Provide detailed information about the issue you want to report</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide detailed description of the issue..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Street address or landmark"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Upload Image (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="image" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {selectedFile ? selectedFile.name : "Click to upload an image"}
                      </span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting || uploading}>
                {submitting ? "Reporting Issue..." : uploading ? "Uploading Image..." : "Report Issue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
