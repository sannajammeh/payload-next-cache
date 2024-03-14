import withPayload from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  transpilePackages: ['@payloadcms/next-cache'],
}

export default withPayload(nextConfig)
