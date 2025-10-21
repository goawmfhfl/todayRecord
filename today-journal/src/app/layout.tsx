import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JournalProvider } from "./providers";
import { BottomNavigation } from "../components/BottomNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Today Journal",
  description: "오늘의 기록을 남기고 분석하는 일기 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JournalProvider>
          <div className="min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
            <main className="pb-20">{children}</main>
            <BottomNavigation />
          </div>
        </JournalProvider>
      </body>
    </html>
  );
}
