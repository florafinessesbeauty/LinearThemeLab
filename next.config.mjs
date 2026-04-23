/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "@server": "commonjs @server",
    });
    return config;
  },
};

export default nextConfig;

