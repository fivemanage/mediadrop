import { S3Provider } from "./s3-provider"
import { R2Provider } from "./r2-provider"
import { validateEnv } from "../config"

export interface StorageProvider {
  upload: (params: {
    filename: string
    buffer: ArrayBuffer
    contentType: string
  }) => Promise<{
    url: string
    key: string
    size: number
  }>
}

export function getStorageProvider(): StorageProvider {
  const env = validateEnv()

  switch (env.STORAGE_PROVIDER) {
    case "s3":
      return new S3Provider(env)
    case "r2":
      return new R2Provider(env)
    default:
      throw new Error(`Unsupported storage provider: ${env.STORAGE_PROVIDER}`)
  }
}

