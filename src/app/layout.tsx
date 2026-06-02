import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antiquity | Antique Marketplace",
  description: "India's most antique marketplace. Verified artifacts.Buy and sell antiques.",
};

import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark">
          <NextAuthProvider>
            <CartProvider>
              <Navbar />
              {children}
            </CartProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
