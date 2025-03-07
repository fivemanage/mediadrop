import { UploadForm } from "@/components/upload-form"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">MediaDrop</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Upload Your Media</h2>
            <p className="text-muted-foreground">Drag and drop images, videos, or audio files to upload</p>
          </div>
          <UploadForm />
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>MediaDrop - Secure media uploads</p>
        </div>
      </footer>
    </div>
  )
}

