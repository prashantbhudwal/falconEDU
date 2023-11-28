const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = require("next-pwa")({
  dest: "public",
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
  experimental: {},
  images: {
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
