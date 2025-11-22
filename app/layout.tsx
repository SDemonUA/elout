import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
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
  title: "Графік відключень електроенергії в Черкасах",
  description:
    "Переглядайте графік відключень електроенергії в Черкасах за групами, отриманий з офіційних Telegram-каналів.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fixel.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
