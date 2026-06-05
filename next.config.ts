import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Thêm dòng này để cho phép Playwright truy cập vào Next.js
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;