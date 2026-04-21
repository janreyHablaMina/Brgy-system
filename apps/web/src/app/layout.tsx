import type { Metadata } from "next";
import { DM_Sans, Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ACCENT_COLOR_STORAGE_KEY, DEFAULT_ACCENT_COLOR } from "@/lib/theme";
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
  title: "Lingkod | Barangay Management System",
  description: "Multi-tenant barangay management dashboard",
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
        <script
          id="theme-handler"
          src="/theme-init.js"
          async
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
