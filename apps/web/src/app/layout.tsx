import type { Metadata } from "next";
import { DM_Sans, Outfit, JetBrains_Mono } from "next/font/google";
<<<<<<< HEAD
import { APP_DESCRIPTION, APP_NAME } from "@/lib/config";
=======
import Script from "next/script";
>>>>>>> 98d6969a75bd0bf1bac480f0d540b96610dc4d72
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} | Barangay Management System`,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${outfit.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-handler"
          src="/theme-init.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[var(--background)] text-[var(--text)] transition-colors duration-300"
      >
        {children}
      </body>
    </html>
  );
}
