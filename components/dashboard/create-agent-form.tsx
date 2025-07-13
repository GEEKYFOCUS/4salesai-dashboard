"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { File, FileText, Image, Link, Plus, Upload, X } from "lucide-react"
import { useRef, useState } from "react"

// Supported file types for training resources
const SUPPORTED_FILE_TYPES = {
  'application/pdf': { icon: FileText, label: 'PDF' },
  'text/plain': { icon: FileText, label: 'Text' },
  'text/markdown': { icon: FileText, label: 'Markdown' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, label: 'Word' },
  'application/msword': { icon: FileText, label: 'Word' },
  'image/jpeg': { icon: Image, label: 'JPEG' },
  'image/png': { icon: Image, label: 'PNG' },
  'image/gif': { icon: Image, label: 'GIF' },
  'image/webp': { icon: Image, label: 'WebP' },
  'text/csv': { icon: FileText, label: 'CSV' },
  'application/json': { icon: FileText, label: 'JSON' },
  'text/html': { icon: FileText, label: 'HTML' }
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface TrainingFile {
  id: string
  file: File
  preview?: string
  type: string
  name: string
  size: number
}

interface TrainingUrl {
  id: string
  url: string
  title?: string
}

export function CreateAgentForm() {
  const [agentName, setAgentName] = useState("")
  const [description, setDescription] = useState("")
  const [trainingFiles, setTrainingFiles] = useState<TrainingFile[]>([])
  const [trainingUrls, setTrainingUrls] = useState<TrainingUrl[]>([])
  const [urlInput, setUrlInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB` }
    }

    // Check file type
    if (!SUPPORTED_FILE_TYPES[file.type as keyof typeof SUPPORTED_FILE_TYPES]) {
      return { valid: false, error: "File type not supported" }
    }

    return { valid: true }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const validation = validateFile(file)
      
      if (!validation.valid) {
        toast({
          title: "File Upload Error",
          description: validation.error,
          variant: "destructive"
        })
        return
      }

      const fileInfo: TrainingFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: file.type,
        name: file.name,
        size: file.size
      }

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setTrainingFiles(prev => 
            prev.map(f => 
              f.id === fileInfo.id 
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          )
        }
        reader.readAsDataURL(file)
      }

      setTrainingFiles(prev => [...prev, fileInfo])
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (fileId: string) => {
    setTrainingFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const addUrl = () => {
    if (!urlInput.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL",
        variant: "destructive"
      })
      return
    }

    // Basic URL validation
    try {
      new URL(urlInput)
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      })
      return
    }

    const newUrl: TrainingUrl = {
      id: Math.random().toString(36).substr(2, 9),
      url: urlInput.trim()
    }

    setTrainingUrls(prev => [...prev, newUrl])
    setUrlInput("")
  }

  const removeUrl = (urlId: string) => {
    setTrainingUrls(prev => prev.filter(u => u.id !== urlId))
  }

  const uploadTrainingResources = async () => {
    if (trainingFiles.length === 0 && trainingUrls.length === 0) {
      toast({
        title: "No Resources",
        description: "Please add at least one training file or URL",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)

    try {
      // Create FormData for files
      const formData = new FormData()
      
      trainingFiles.forEach((fileInfo, index) => {
        formData.append(`files[${index}]`, fileInfo.file)
      })

      trainingUrls.forEach((urlInfo, index) => {
        formData.append(`urls[${index}]`, urlInfo.url)
      })

      // Add agent details
      formData.append('name', agentName)
      formData.append('description', description)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Success",
        description: "Agent created successfully with training resources",
      })

      // Reset form
      setAgentName("")
      setDescription("")
      setTrainingFiles([])
      setTrainingUrls([])
      setUrlInput("")

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload training resources. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    const fileInfo = SUPPORTED_FILE_TYPES[fileType as keyof typeof SUPPORTED_FILE_TYPES]
    return fileInfo ? fileInfo.icon : File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create New Agent</h1>
        <p className="text-muted-foreground">
          Set up your AI agent with training resources and configuration
        </p>
      </div>

      <div className="grid gap-6">
        {/* Agent Details */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Details</CardTitle>
            <CardDescription>
              Basic information about your AI agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Agent Name</Label>
              <Input
                id="agent-name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Enter agent name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your agent's purpose and capabilities"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Training Files */}
        <Card>
          <CardHeader>
            <CardTitle>Training Files</CardTitle>
            <CardDescription>
              Upload files to train your agent. Supported formats: PDF, Text, Markdown, Word, Images, CSV, JSON, HTML
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  Choose Files
                </Button>
                <p className="text-sm text-gray-500">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum file size: 10MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.txt,.md,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.csv,.json,.html"
                aria-label="Upload training files"
                title="Upload training files"
              />
            </div>

            {/* File Previews */}
            {trainingFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Uploaded Files ({trainingFiles.length})</h4>
                <div className="grid gap-3">
                  {trainingFiles.map((fileInfo) => {
                    const FileIcon = getFileIcon(fileInfo.type)
                    return (
                      <div
                        key={fileInfo.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          {fileInfo.preview ? (
                            <img
                              src={fileInfo.preview}
                              alt={fileInfo.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <FileIcon className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm">{fileInfo.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(fileInfo.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileInfo.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Training URLs</CardTitle>
            <CardDescription>
              Add web pages or documents URLs for training
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter URL (e.g., https://example.com/document)"
                onKeyPress={(e) => e.key === 'Enter' && addUrl()}
              />
              <Button onClick={addUrl} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {/* URL List */}
            {trainingUrls.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Added URLs ({trainingUrls.length})</h4>
                <div className="space-y-2">
                  {trainingUrls.map((urlInfo) => (
                    <div
                      key={urlInfo.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <Link className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-mono">{urlInfo.url}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUrl(urlInfo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={uploadTrainingResources}
              disabled={isUploading || (trainingFiles.length === 0 && trainingUrls.length === 0)}
              className="w-full"
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Uploading Training Resources...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Create Agent with Training Resources
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {trainingFiles.length + trainingUrls.length} resource(s) ready to upload
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
