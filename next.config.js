const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config, { isServer, webpack }) => {
  //   if (!isServer) {
  //     config.watchOptions = {
  //       aggregateTimeout: 2000, // Delay after a change
  //     };
  //   }
  //   return config;
  // },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      //fs false
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
  experimental: {},
  images: {
    domains: ["lh3.googleusercontent.com", "i.ytimg.com", "img.youtube.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(withPWA(nextConfig));
