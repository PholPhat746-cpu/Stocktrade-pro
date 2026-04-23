/** @type {import('next').NextConfig} */
const nextConfig = {
  /* ใน Next.js 15 ไม่ต้องใส่ swcMinify: true แล้ว เพราะระบบเปิดให้เองอัตโนมัติครับ */
  
  // หากต้องการข้ามการตรวจ ESLint ตอน Build (ช่วยให้ Build เร็วขึ้นในเครื่องสเปกจำกัด)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // หากต้องการข้ามการตรวจ TypeScript ตอน Build
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

