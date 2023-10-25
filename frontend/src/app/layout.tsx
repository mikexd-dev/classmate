import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Work_Sans as Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIducation",
  description: "Supercharge your learning!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen")}>
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
