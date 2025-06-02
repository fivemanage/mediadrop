import { type NextRequest, NextResponse } from "next/server"
import { getStorageProvider } from "@/lib/storage"
import {envSchema, validateEnv, getMaxFileSizeBytes} from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    // Get the form data
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate environment variables
   validateEnv()

    // Get the storage provider
    const storage = getStorageProvider()

    // Generate a unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(2, 10)}.${extension}`

    // Get the file buffer
    const buffer = await file.arrayBuffer()

    // Enforce file size limit
    const maxFileSize = getMaxFileSizeBytes();
    if (maxFileSize && buffer.byteLength > maxFileSize) {
      return NextResponse.json({ error: `File exceeds the maximum allowed size of ${maxFileSize} bytes.` }, { status: 400 })
    }

    // Upload to storage provider - no progress tracking
    const result = await storage.upload({
      filename,
      buffer,
      contentType: file.type,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload error:", error)

    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

