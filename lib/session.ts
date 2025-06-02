import { SessionOptions } from "iron-session"

export type DiscordSessionUser = {
  id: string
  username: string
  avatar: string | null
  discriminator: string
  accessToken: string
  guilds?: any[]
  roles?: string[]
}

export interface SessionData {
  user?: DiscordSessionUser
}

const SESSION_PASSWORD = process.env.SESSION_PASSWORD;
if (!SESSION_PASSWORD) {
  throw new Error("SESSION_PASSWORD is not set. Please provide a strong password in the environment variables.");
}
if (SESSION_PASSWORD.length < 16) {
  throw new Error("SESSION_PASSWORD is too weak. It must be at least 16 characters long.");
}

export const sessionOptions: SessionOptions = {
  password: SESSION_PASSWORD,
  cookieName: process.env.SESSION_COOKIE_NAME || "mediadrop_discord_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
  },
} 