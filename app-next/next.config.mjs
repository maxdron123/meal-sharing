/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove rewrites since we're making direct API calls to the backend
  // and environment variables might not be available during build time
};

export default nextConfig;
