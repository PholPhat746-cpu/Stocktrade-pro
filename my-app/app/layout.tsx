import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// นำเข้าเครื่องมือวัดผลทั้งสองตัวตามที่คุณพลระบุ
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StockTrade Pro",
  description: "By Phol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* ติดตั้งตัวติดตามทั้งคู่ไว้ท้าย body */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}


