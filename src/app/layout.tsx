import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LocaleFontProvider } from "@/components/locale-font-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plan Essential - Online Invitation",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Dangrek&family=Roboto&family=Pacifico&family=Montserrat&family=Ovo&family=Kantumruy+Pro&family=Great+Vibes&family=Dancing+Script&family=Moul&family=Battambang&family=Fasthand&family=Moulpali&family=Wix+Madefor+Display:wght@400;500;600;700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LocaleFontProvider>
          <Toaster position="top-center" />
          {children}
        </LocaleFontProvider>
      </body>
    </html>
  );
}
