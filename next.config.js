/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com"
    ],
  },
  eslint: {
    // This will ignore all ESLint errors during builds
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;
