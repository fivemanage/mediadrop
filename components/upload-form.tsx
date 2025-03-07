"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

type FileWithPreview = {
  file: File
  id: string
  preview?: string
  progress: number
  status: "idle" | "uploading" | "success" | "error"
  error?: string
  url?: string // URL for completed uploads
}

export function UploadForm() {
  const [files, setFiles] = useState<FileWithPreview[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: crypto.randomUUID(),
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: "idle" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      "audio/*": [],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  // Upload files one by one with progress tracking
  const handleUploadOneByOne = async () => {
    const filesToUpload = files.filter((f) => f.status === "idle")

    if (filesToUpload.length === 0) return

    // Process each file
    for (const fileItem of filesToUpload) {
      try {
        // Update status to uploading
        setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, status: "uploading", progress: 10 } : f)))

        // Create FormData
        const formData = new FormData()
        formData.append("file", fileItem.file)

        // Use XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest()

        // Set up progress tracking
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100)
            setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, progress: percentComplete } : f)))
          }
        })

        // Create a promise to handle the XHR request
        const uploadPromise = new Promise<{ url: string; key: string; size: number }>((resolve, reject) => {
          xhr.open("POST", "/api/upload")

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText)
              resolve(response)
            } else {
              try {
                const errorData = JSON.parse(xhr.responseText)
                reject(new Error(errorData.error || "Upload failed"))
              } catch (e) {
                reject(new Error(`Upload failed with status ${xhr.status}`))
              }
            }
          }

          xhr.onerror = () => {
            reject(new Error("Network error occurred"))
          }

          xhr.send(formData)
        })

        // Wait for upload to complete
        const result = await uploadPromise

        // Mark as success
        setFiles((prev) =>
            prev.map((f) =>
                f.id === fileItem.id
                    ? {
                      ...f,
                      status: "success",
                      progress: 100,
                      url: result.url,
                    }
                    : f,
            ),
        )
      } catch (error) {
        // Mark as error
        setFiles((prev) =>
            prev.map((f) => (f.id === fileItem.id ? { ...f, status: "error", error: (error as Error).message } : f)),
        )
      }
    }
  }

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== "success"))
  }

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== id)
      // Clean up any object URLs to prevent memory leaks
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return filtered
    })
  }

  return (
      <div className="space-y-6">
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{isDragActive ? "Drop files here" : "Drag & drop files here"}</h3>
            <p className="text-sm text-muted-foreground">or click to browse files</p>
            <p className="text-xs text-muted-foreground mt-2">Supports images, videos, and audio files up to 100MB</p>
          </div>
        </div>

        {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Files ({files.length})</h3>
                <div className="flex gap-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCompleted}
                      disabled={!files.some((f) => f.status === "success")}
                  >
                    Clear completed
                  </Button>
                  <Button
                      size="sm"
                      onClick={handleUploadOneByOne} // Use the one-by-one approach with real progress tracking
                      disabled={!files.some((f) => f.status === "idle")}
                  >
                    Upload all
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {files.map((fileItem) => (
                    <div
                        key={fileItem.id}
                        className={`border rounded-md p-3 transition-colors ${
                            fileItem.status === "success" ? "bg-green-50 border-green-200" : ""
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {fileItem.preview ? (
                              <img
                                  src={fileItem.preview || "/placeholder.svg"}
                                  alt={fileItem.file.name}
                                  className="h-12 w-12 rounded object-cover"
                              />
                          ) : (
                              <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                                <File className="h-6 w-6 text-muted-foreground" />
                              </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{fileItem.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB • {fileItem.file.type}
                          </p>
                          <div className="mt-2">
                            <Progress
                                value={fileItem.progress}
                                className={`h-1 ${fileItem.status === "success" ? "bg-green-100" : ""}`}
                            />
                          </div>
                          {fileItem.error && <p className="text-xs text-destructive mt-1">{fileItem.error}</p>}
                          {fileItem.status === "success" && fileItem.url && (
                              <div className="mt-2">
                                <a
                                    href={fileItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  <span>View uploaded file</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          {fileItem.status === "success" ? (
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </div>
                          ) : fileItem.status === "error" ? (
                              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                              </div>
                          ) : (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => removeFile(fileItem.id)}>
                                &times;
                              </Button>
                          )}
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  )
}

