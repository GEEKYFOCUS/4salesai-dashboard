"use client"

import type React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Bot, CheckCircle, Clock, FileText, Link, Music, Plus, Trash2, Upload, Video, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface TrainingFile {
  id: string
  name: string
  type: "video" | "audio" | "document" | "url" | "text"
  size: string
  status: "processed" | "processing" | "failed"
  uploadDate: string
  agentId: string
  agentName: string
  url?: string
  originalName?: string
}

interface UploadingFile {
  id: string
  name: string
  size: number
  progress: number
  status: "uploading" | "processing" | "completed" | "failed"
  error?: string
}

interface PendingFile {
  id: string
  file: File
  name: string
  size: number
  type: "video" | "audio" | "document"
  preview?: string
  isValid: boolean
  errorMessage?: string
}

interface PendingUrl {
  id: string
  url: string
  isValid: boolean
  errorMessage?: string
}

interface PendingText {
  id: string
  content: string
  tokens: number
  isValid: boolean
  errorMessage?: string
}

const validateUrl = (url: string): { isValid: boolean; errorMessage?: string } => {
  try {
    new URL(url)
    return { isValid: true }
  } catch (_) {
    return { 
      isValid: false, 
      errorMessage: `Invalid URL: ${url}` 
    }
  }
}

// Simple token estimation function (rough approximation)
const estimateTokens = (text: string): number => {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4)
}

const MAX_TOKENS = 1000000 // 1 million tokens

export function TrainingContent() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [urlInput, setUrlInput] = useState("")
  const [textInput, setTextInput] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("1")
  const [agents, setAgents] = useState<any[]>([])
  const [trainingFiles, setTrainingFiles] = useState<TrainingFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // New state for pending items
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [pendingUrls, setPendingUrls] = useState<PendingUrl[]>([])
  const [pendingTexts, setPendingTexts] = useState<PendingText[]>([])
  const [isUploadingAll, setIsUploadingAll] = useState(false)

  // Calculate tokens used and remaining
  const currentTokens = estimateTokens(textInput)
  const tokensRemaining = MAX_TOKENS - currentTokens
  const tokenUsagePercentage = (currentTokens / MAX_TOKENS) * 100

  // Load agents and training files on component mount
  useEffect(() => {
    const loadData = () => {
      // Load agents
      const userAgents = JSON.parse(localStorage.getItem("userAgents") || "[]")
      const defaultAgents = [
        { id: 1, name: "Sales Agent Pro" },
        { id: 2, name: "Support Assistant" },
      ]
      const allAgents = [...defaultAgents, ...userAgents]
      setAgents(allAgents)

      // Set default agent if available and none selected
      if (allAgents.length > 0 && !selectedAgent) {
        setSelectedAgent(allAgents[0].id.toString())
      }

      // Load training files
      reloadTrainingFiles()
    }

    loadData()

    // Listen for agent updates
    const handleAgentUpdate = () => {
      loadData()
    }

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "trainingFiles" || e.key === "userAgents") {
        loadData()
      }
    }

    window.addEventListener("agentCreated", handleAgentUpdate)
    window.addEventListener("agentUpdated", handleAgentUpdate)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("agentCreated", handleAgentUpdate)
      window.removeEventListener("agentUpdated", handleAgentUpdate)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const getFileType = (file: File): "video" | "audio" | "document" => {
    const extension = file.name.split(".").pop()?.toLowerCase()

    if (["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv"].includes(extension || "")) return "video"
    if (["mp3", "wav", "aac", "m4a", "ogg", "flac", "wma"].includes(extension || "")) return "audio"
    return "document"
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File): { isValid: boolean; errorMessage?: string } => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    const allowedTypes = [
      // Video
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/webm",
      // Audio
      "audio/mpeg",
      "audio/wav",
      "audio/aac",
      "audio/mp4",
      "audio/ogg",
      "audio/flac",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (file.size > maxSize) {
      return { 
        isValid: false, 
        errorMessage: `File "${file.name}" is too large. Maximum size is 100MB.` 
      }
    }

    if (!allowedTypes.includes(file.type)) {
      const extension = file.name.split(".").pop()?.toLowerCase()
      const allowedExtensions = [
        "mp4",
        "mov",
        "avi",
        "mkv",
        "webm",
        "mp3",
        "wav",
        "aac",
        "m4a",
        "ogg",
        "pdf",
        "doc",
        "docx",
        "txt",
        "csv",
        "xls",
        "xlsx",
      ]

      if (!allowedExtensions.includes(extension || "")) {
        return { 
          isValid: false, 
          errorMessage: `File type "${extension}" is not supported.` 
        }
      }
    }

    return { isValid: true }
  }

  const processFile = async (file: File, agentData: any): Promise<TrainingFile> => {
    return new Promise((resolve) => {
      const fileType = getFileType(file)
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9)

      const newFile: TrainingFile = {
        id: fileId,
        name: file.name,
        type: fileType,
        size: formatFileSize(file.size),
        status: "processing",
        uploadDate: new Date().toISOString().split("T")[0],
        agentId: agentData.id.toString(),
        agentName: agentData.name,
        originalName: file.name,
      }

      // Simulate file processing with realistic timing
      const processingTime = Math.min((file.size / (1024 * 1024)) * 1000, 5000) // 1 second per MB, max 5 seconds

      setTimeout(() => {
        // 95% success rate simulation
        const success = Math.random() > 0.05
        resolve({
          ...newFile,
          status: success ? "processed" : "failed",
        })
      }, processingTime)
    })
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedAgent) return

    // Add files to pending list instead of uploading immediately
    for (const file of Array.from(files)) {
      await addPendingFile(file)
    }
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim() || !selectedAgent) return

    addPendingUrl(urlInput)
  }

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!textInput.trim() || !selectedAgent) return

    addPendingText(textInput)
  }

  const reloadTrainingFiles = () => {
    const stored = localStorage.getItem("trainingFiles")
    if (stored) {
      setTrainingFiles(JSON.parse(stored))
    }
  }

  const handleDeleteFile = (fileId: string) => {
    const updatedFiles = trainingFiles.filter((f) => f.id !== fileId)
    setTrainingFiles(updatedFiles)
    localStorage.setItem("trainingFiles", JSON.stringify(updatedFiles))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleFileInputClick = () => {
    if (selectedAgent && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-blue-600" />
      case "audio":
        return <Music className="h-5 w-5 text-purple-600" />
      case "document":
        return <FileText className="h-5 w-5 text-green-600" />
      case "url":
        return <Link className="h-5 w-5 text-orange-600" />
      case "text":
        return <FileText className="h-5 w-5 text-gray-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  // Helper function to create file preview
  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        resolve('')
      }
    })
  }

  // Add file to pending list
  const addPendingFile = async (file: File) => {
    const validation = validateFile(file)
    const fileType = getFileType(file)
    const preview = await createFilePreview(file)
    
    const pendingFile: PendingFile = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: fileType,
      preview,
      isValid: validation.isValid,
      errorMessage: validation.errorMessage
    }
    
    setPendingFiles(prev => [...prev, pendingFile])
  }

  // Add URL to pending list
  const addPendingUrl = (url: string) => {
    const validation = validateUrl(url)
    
    const pendingUrl: PendingUrl = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url,
      isValid: validation.isValid,
      errorMessage: validation.errorMessage
    }
    
    setPendingUrls(prev => [...prev, pendingUrl])
    setUrlInput("")
  }

  // Add text to pending list
  const addPendingText = (content: string) => {
    const tokens = estimateTokens(content)
    const isValid = tokens <= MAX_TOKENS
    
    const pendingText: PendingText = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      tokens,
      isValid,
      errorMessage: isValid ? undefined : "Text exceeds the 1 million token limit"
    }
    
    setPendingTexts(prev => [...prev, pendingText])
    setTextInput("")
  }

  // Remove pending items
  const removePendingFile = (id: string) => {
    setPendingFiles(prev => prev.filter(f => f.id !== id))
  }

  const removePendingUrl = (id: string) => {
    setPendingUrls(prev => prev.filter(u => u.id !== id))
  }

  const removePendingText = (id: string) => {
    setPendingTexts(prev => prev.filter(t => t.id !== id))
  }

  // Upload all pending items
  const uploadAllPendingItems = async () => {
    if (!selectedAgent || (pendingFiles.length === 0 && pendingUrls.length === 0 && pendingTexts.length === 0)) {
      return
    }

    setIsUploadingAll(true)
    const agentData = agents.find((a) => a.id.toString() === selectedAgent)
    if (!agentData) return

    try {
      // Process files
      for (const pendingFile of pendingFiles) {
        if (pendingFile.isValid) {
          await processFile(pendingFile.file, agentData)
        }
      }

      // Process URLs
      for (const pendingUrl of pendingUrls) {
        if (pendingUrl.isValid) {
          const urlId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
          const newUrlFile: TrainingFile = {
            id: urlId,
            name: `URL: ${pendingUrl.url}`,
            type: "url",
            size: "0 KB",
            status: "processing",
            uploadDate: new Date().toISOString().split("T")[0],
            agentId: agentData.id.toString(),
            agentName: agentData.name,
            url: pendingUrl.url,
          }
          setTrainingFiles((prev) => [...prev, newUrlFile])
        }
      }

      // Process texts
      for (const pendingText of pendingTexts) {
        if (pendingText.isValid) {
          const textId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
          const newTextFile: TrainingFile = {
            id: textId,
            name: `Text: ${pendingText.content.substring(0, 50)}${pendingText.content.length > 50 ? "..." : ""}`,
            type: "text",
            size: `${pendingText.content.length} characters`,
            status: "processing",
            uploadDate: new Date().toISOString().split("T")[0],
            agentId: agentData.id.toString(),
            agentName: agentData.name,
          }
          setTrainingFiles((prev) => [...prev, newTextFile])
        }
      }

      // Clear all pending items
      setPendingFiles([])
      setPendingUrls([])
      setPendingTexts([])

      // Update localStorage
      localStorage.setItem("trainingFiles", JSON.stringify(trainingFiles))

    } catch (error) {
      console.error("Error uploading items:", error)
    } finally {
      setIsUploadingAll(false)
    }
  }

  const agentFiles = selectedAgent ? trainingFiles.filter((f) => f.agentId === selectedAgent) : trainingFiles

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Content</h1>
          <p className="text-gray-600">Upload and manage content to train your AI agents</p>
        </div>
      </div>

      {/* Agent Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <Label className="text-sm font-medium">Select Agent:</Label>
            </div>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select an agent to train" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <span>{agent.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedAgent && (
              <Alert className="ml-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please select an agent before uploading training content.</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Content</TabsTrigger>
          <TabsTrigger value="manage">Manage Content ({trainingFiles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* File Type Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Supported File Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <Video className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-xs font-medium">Video</div>
                    <div className="text-xs text-gray-500">MP4, MOV, AVI</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                  <Music className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-xs font-medium">Audio</div>
                    <div className="text-xs text-gray-500">MP3, WAV, AAC</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-xs font-medium">Documents</div>
                    <div className="text-xs text-gray-500">PDF, DOC, TXT</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                  <Link className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="text-xs font-medium">URLs</div>
                    <div className="text-xs text-gray-500">Websites, Videos</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <div>
                    <div className="text-xs font-medium">Text</div>
                    <div className="text-xs text-gray-500">Direct input</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Options Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span>Upload Files</span>
                </CardTitle>
                <CardDescription>Drag and drop or click to browse files</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : selectedAgent
                        ? "border-gray-300 hover:border-gray-400"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleFileInputClick}
                >
                  <Upload className={`h-8 w-8 mx-auto mb-3 ${selectedAgent ? "text-gray-400" : "text-gray-300"}`} />
                  <h3 className={`text-sm font-semibold mb-2 ${selectedAgent ? "text-gray-900" : "text-gray-500"}`}>
                    Drop files here or click to upload
                  </h3>
                  <p className={`text-xs mb-3 ${selectedAgent ? "text-gray-600" : "text-gray-400"}`}>
                    Up to 100MB per file
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".mp3,.wav,.aac,.m4a,.ogg,.flac,.mp4,.mov,.avi,.mkv,.webm,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    disabled={!selectedAgent}
                    aria-label="Choose files to upload"
                  />
                  <Button variant="outline" size="sm" className="bg-transparent" disabled={!selectedAgent}>
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* URL & Text Input */}
            <div className="space-y-6">
              {/* URL Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Link className="h-5 w-5 text-orange-600" />
                    <span>Add URLs</span>
                  </CardTitle>
                  <CardDescription>Add websites or online content</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUrlSubmit} className="space-y-3">
                    <div>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        disabled={!selectedAgent}
                      />
                      {urlInput && (
                        <div className="mt-2">
                          {validateUrl(urlInput).isValid ? (
                            <div className="flex items-center text-xs text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Valid URL
                            </div>
                          ) : (
                            <div className="flex items-center text-xs text-red-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Invalid URL
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      size="sm"
                      className="w-full" 
                      disabled={!selectedAgent || !urlInput.trim() || !validateUrl(urlInput).isValid}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add URL
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Text Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span>Add Text</span>
                  </CardTitle>
                  <CardDescription>Direct text input (1M token limit)</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTextSubmit} className="space-y-3">
                    <div>
                      <Textarea
                        placeholder="Enter your training content here..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={4}
                        disabled={!selectedAgent}
                        className="resize-none"
                      />
                      
                      {/* Token Counter */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Tokens</span>
                          <span className={`font-medium ${currentTokens > MAX_TOKENS * 0.9 ? 'text-red-600' : currentTokens > MAX_TOKENS * 0.7 ? 'text-yellow-600' : 'text-gray-600'}`}>
                            {currentTokens.toLocaleString()} / {MAX_TOKENS.toLocaleString()}
                          </span>
                        </div>
                        <Progress 
                          value={tokenUsagePercentage} 
                          className="h-1"
                          style={{
                            '--progress-background': currentTokens > MAX_TOKENS * 0.9 ? '#dc2626' : currentTokens > MAX_TOKENS * 0.7 ? '#d97706' : '#3b82f6'
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      size="sm"
                      className="w-full" 
                      disabled={!selectedAgent || !textInput.trim() || currentTokens > MAX_TOKENS}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Text
                    </Button>
                    {currentTokens > MAX_TOKENS && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          Text exceeds the 1 million token limit.
                        </AlertDescription>
                      </Alert>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Pending Items Section - Always Visible */}
          {(pendingFiles.length > 0 || pendingUrls.length > 0 || pendingTexts.length > 0) && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                  <Clock className="h-5 w-5" />
                  <span>Ready to Upload ({pendingFiles.length + pendingUrls.length + pendingTexts.length} items)</span>
                </CardTitle>
                <CardDescription>Review your training content before uploading</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pending Files */}
                {pendingFiles.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-blue-900">Files ({pendingFiles.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {pendingFiles.map((file) => (
                        <div
                          key={file.id}
                          className={`border rounded-lg p-2 ${
                            file.isValid ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {file.preview ? (
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                {getFileIcon(file.type)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              {!file.isValid && (
                                <p className="text-xs text-red-600">{file.errorMessage}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePendingFile(file.id)}
                              className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending URLs */}
                {pendingUrls.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-blue-900">URLs ({pendingUrls.length})</h4>
                    <div className="space-y-1">
                      {pendingUrls.map((url) => (
                        <div
                          key={url.id}
                          className={`flex items-center justify-between p-2 border rounded-lg ${
                            url.isValid ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <Link className="h-3 w-3 text-orange-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-900 truncate">{url.url}</p>
                              {!url.isValid && (
                                <p className="text-xs text-red-600">{url.errorMessage}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePendingUrl(url.id)}
                            className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Texts */}
                {pendingTexts.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-blue-900">Text Content ({pendingTexts.length})</h4>
                    <div className="space-y-1">
                      {pendingTexts.map((text) => (
                        <div
                          key={text.id}
                          className={`p-2 border rounded-lg ${
                            text.isValid ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-900 mb-1">
                                {text.content.substring(0, 60)}{text.content.length > 60 ? "..." : ""}
                              </p>
                              <p className="text-xs text-gray-500">
                                {text.tokens.toLocaleString()} tokens
                              </p>
                              {!text.isValid && (
                                <p className="text-xs text-red-600">{text.errorMessage}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePendingText(text.id)}
                              className="text-red-600 hover:text-red-700 h-6 w-6 p-0 ml-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button - Prominent */}
                <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                  <div className="text-sm text-blue-700">
                    {pendingFiles.filter(f => f.isValid).length + pendingUrls.filter(u => u.isValid).length + pendingTexts.filter(t => t.isValid)} valid items ready to upload
                  </div>
                  <Button
                    onClick={uploadAllPendingItems}
                    disabled={isUploadingAll || (pendingFiles.filter(f => f.isValid).length + pendingUrls.filter(u => u.isValid).length + pendingTexts.filter(t => t.isValid)) === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    size="lg"
                  >
                    {isUploadingAll ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Uploading Training Content...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload All Training Content
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* Filter by Agent */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Label>Filter by Agent:</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline">{agentFiles.length} files</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Content Library */}
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>Manage your uploaded training content</CardDescription>
            </CardHeader>
            <CardContent>
              {agentFiles.length > 0 ? (
                <div className="space-y-3">
                  {agentFiles.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        {getFileIcon(content.type)}
                        <div>
                          <h3 className="font-medium text-gray-900">{content.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Size: {content.size}</span>
                            <span>•</span>
                            <span>Uploaded: {content.uploadDate}</span>
                            <span>•</span>
                            <span>Agent: {content.agentName}</span>
                          </div>
                          {content.url && (
                            <div className="text-xs text-blue-600 mt-1 truncate max-w-md">{content.url}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(content.status)}
                          <Badge
                            variant={
                              content.status === "processed"
                                ? "default"
                                : content.status === "processing"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {content.status}
                          </Badge>
                        </div>
                        {content.type === "url" && content.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(content.url, "_blank")}
                            title="Open URL"
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteFile(content.id)}
                          title="Delete file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No training content yet</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedAgent
                      ? `No training content uploaded for ${agents.find((a) => a.id.toString() === selectedAgent)?.name || "this agent"} yet.`
                      : "Upload some training content to get started."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Training Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{trainingFiles.length}</div>
                <p className="text-xs text-gray-600">Files uploaded</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {trainingFiles.filter((f) => f.status === "processing").length}
                </div>
                <p className="text-xs text-gray-600">Files in queue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {trainingFiles.filter((f) => f.status === "processed").length}
                </div>
                <p className="text-xs text-gray-600">Ready for training</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {trainingFiles.filter((f) => f.status === "failed").length}
                </div>
                <p className="text-xs text-gray-600">Need attention</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
