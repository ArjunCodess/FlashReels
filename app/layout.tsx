import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "@/providers/provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme-provider";
import Header from "@/components/header";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Flash Reels - AI-Generated Videos with a Click",
  description: "Flash Reels allows users to create AI-generated videos, reels, and shorts instantly with just one click. Unlock creativity with speed and innovation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased mx-auto max-w-7xl`}
          suppressHydrationWarning
        >
          <Script
            defer
            data-domain="flashreels.vercel.app"
            src="https://getanalyzr.vercel.app/tracking-script.js"
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <Provider>
              <Header />
              {children}
            </Provider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}