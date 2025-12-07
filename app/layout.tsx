import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { supportedCities, getCityLabel } from "../lib/schedule-provider";
import "./globals.css";
import Footer from "../components/footer";

const fixel = localFont({
  src: "../public/FixelVariable.ttf",
  variable: "--font-fixel",
  weight: "100 900",
  style: "normal",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Графік відключень електроенергії",
  keywords: [
    "графік відключень",
    "електроенергія",
    "відключення світла",
    ...supportedCities.map(getCityLabel),
  ],
  description:
    "Переглядайте графік відключень електроенергії за групами, отриманий з офіційних Telegram-каналів та інших джерел.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${fixel.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Footer />
        <Analytics />
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
      </body>
    </html>
  );
}
