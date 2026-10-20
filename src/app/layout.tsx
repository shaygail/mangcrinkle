import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Open_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Mang Crinkle | Filipino-Inspired Crinkles",
  description:
    "Handcrafted Filipino-inspired crinkles, soft-centred and fudgy. Order online for pickup.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${openSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
