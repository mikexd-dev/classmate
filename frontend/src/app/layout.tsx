import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Oi, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib";
// import "../styles/dist.css";
import "./globals.css";
import localFont from "@next/font/local";

const oi = localFont({
  src: [
    {
      path: "../../public/ChunkFive-Regular.ttf",
      weight: "500",
    },
  ],
  variable: "--font-oi",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const oi = Oi({
//   subsets: ["latin"],
//   weight: ["400"],
//   variable: "--font-oi",
// });

export const metadata: Metadata = {
  title: "Classmate",
  description: "Your Personalised Learning Companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oi.variable}`}>
      <body className={cn(inter.variable, oi.variable, "min-h-screen")}>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
