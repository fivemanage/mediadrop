import { z } from "zod"

// Environment variables schema
export const envSchema = z.object({
  STORAGE_PROVIDER: z.enum(["s3", "r2"]),
  STORAGE_BUCKET: z.string().min(1),
  STORAGE_ACCESS_KEY_ID: z.string().min(1),
  STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
  STORAGE_PUBLIC_URL: z.string().url().optional(),
  STORAGE_ENDPOINT: z.string().url().optional(),
  STORAGE_REGION: z.string().optional(),
})

export type EnvConfig = z.infer<typeof envSchema>

// Validate environment variables
export function validateEnv() {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    // Format the error messages in a more user-friendly way
    const formattedErrors = result.error.issues
        .map((issue) => {
          return `${issue.path.join(".")}: ${issue.message}`
        })
        .join(", ")

    throw new Error(`Invalid environment configuration: ${formattedErrors}`)
  }

  // Additional validation for R2 provider
  if (result.data.STORAGE_PROVIDER === "r2" && !result.data.STORAGE_ENDPOINT) {
    throw new Error("R2 storage requires STORAGE_ENDPOINT to be set")
  }

  if (result.data.STORAGE_PROVIDER === "s3" && !result.data.STORAGE_REGION) {
    throw new Error("R2 storage requires STORAGE_ENDPOINT to be set")
  }

  return result.data
}