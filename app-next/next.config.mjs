/** @type {import('next').NextConfig} */
const backendApiUrl = process.env.BACKEND_API_URL;
const nextConfig = {
  async rewrites() {
    return [
      // Route for main meals listing (public endpoint)
      {
        source: "/api/meals/all",
        destination: `${backendApiUrl}/api/meals`, // backend meals endpoint
      },
      // Route for other backend API calls that don't conflict with Next.js routes
      {
        source: "/api/backend/:path*",
        destination: `${backendApiUrl}/api/:path*`, // backend port
      },
    ];
  },
};

export default nextConfig;
