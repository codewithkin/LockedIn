import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LockedIn - Lock In To Your Goals Together",
  description: "Lock in to your goals with LockedIn. Track progress, stay accountable with gangs, and achieve more together. The ultimate goal tracking and accountability app.",
  keywords: ["goal tracking", "accountability", "productivity", "goals", "habits", "group goals", "gang", "motivation"],
  authors: [{ name: "Kin Leon Zinzombe", url: "https://codewithkin.space" }],
  creator: "Kin Leon Zinzombe",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lockedin.app",
    siteName: "LockedIn",
    title: "LockedIn - Lock In To Your Goals Together",
    description: "Lock in to your goals with LockedIn. Track progress, stay accountable with gangs, and achieve more together.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LockedIn App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LockedIn - Lock In To Your Goals Together",
    description: "Lock in to your goals with LockedIn. Track progress, stay accountable with gangs, and achieve more together.",
    creator: "@codewithkin",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
