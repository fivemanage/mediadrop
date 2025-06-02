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
  MAX_FILE_SIZE: z.string().optional(), // e.g., '100mb', '20mb'
})

export type EnvConfig = z.infer<typeof envSchema> & { MAX_FILE_SIZE_BYTES?: number }

function parseFileSize(size: string | undefined): number | undefined {
  if (!size) return undefined;
  const match = size.trim().toLowerCase().match(/^(\d+)(mb|kb|gb)$/);
  if (!match) throw new Error('MAX_FILE_SIZE must be like "100mb", "20mb", etc');
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 'kb': return value * 1024;
    case 'mb': return value * 1024 * 1024;
    case 'gb': return value * 1024 * 1024 * 1024;
    default: throw new Error('Unknown unit for MAX_FILE_SIZE');
  }
}

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

  // Parse MAX_FILE_SIZE to bytes
  let MAX_FILE_SIZE_BYTES: number | undefined = undefined;
  if (result.data.MAX_FILE_SIZE) {
    MAX_FILE_SIZE_BYTES = parseFileSize(result.data.MAX_FILE_SIZE);
  }

  return { ...result.data, MAX_FILE_SIZE_BYTES };
}

export function getMaxFileSizeBytes(): number | undefined {
  return validateEnv().MAX_FILE_SIZE_BYTES;
}