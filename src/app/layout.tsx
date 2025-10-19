import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASCII Wave Studio",
  description:
    "A real-time ASCII art generator with animated noise effects and multiple export formats",
  keywords: [
    "ascii art",
    "ascii generator",
    "animated ascii",
    "text art",
    "webgl",
    "noise animation",
    "ascii wave",
  ],
  authors: [{ name: "ASCII Wave Studio" }],
  creator: "ASCII Wave Studio",
  publisher: "ASCII Wave Studio",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
  },
  openGraph: {
    title: "ASCII Wave Studio",
    description:
      "Create mesmerizing ASCII animations with real-time noise effects",
    type: "website",
    siteName: "ASCII Wave Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASCII Wave Studio",
    description:
      "Create mesmerizing ASCII animations with real-time noise effects",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
