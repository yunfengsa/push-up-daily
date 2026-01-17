import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/sw-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "每日俯卧撑",
    template: "%s | 每日俯卧撑"
  },
  description: "记录你的每日俯卧撑，见证你的成长。",
  keywords: ["俯卧撑", "打卡", "运动", "健身", "记录"],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    shortcut: "/favicon.ico",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "每日俯卧撑",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "每日俯卧撑",
    description: "记录你的每日俯卧撑，见证你的成长。",
    type: "website",
    locale: "zh_CN",
    siteName: "每日俯卧撑",
  },
};

export const viewport: Viewport = {
  themeColor: "#10B981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
