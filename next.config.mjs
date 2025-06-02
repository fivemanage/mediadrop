/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
  },
}

export default nextConfig
