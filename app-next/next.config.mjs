/** @type {import('next').NextConfig} */
const backendApiUrl = process.env.BACKEND_API_URL;
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendApiUrl}/api/:path*`, // backend port
      },
    ];
  },
};

export default nextConfig;
