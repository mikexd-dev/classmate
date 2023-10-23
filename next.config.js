/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  //   experimental: {
  //     esmExternals: "loose",
  //   },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "s3.us-west-2.amazonaws.com",
      "aiducation.s3.ap-southeast-1.amazonaws.com",
      "oaidalleapiprodscus.blob.core.windows.net",
      "img.youtube.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
