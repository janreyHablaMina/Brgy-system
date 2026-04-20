import { JetBrains_Mono, Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import { ACCENT_COLOR_STORAGE_KEY, DEFAULT_ACCENT_COLOR } from "@/lib/theme";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-serif",
  weight: "400",
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
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} ${dmSerifDisplay.variable} h-full antialiased`}
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
