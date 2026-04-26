import { Geist_Mono, Outfit, Space_Grotesk } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"

const spaceGroteskHeading = Space_Grotesk({subsets:['latin'],variable:'--font-heading'});

const outfit = Outfit({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})


import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Parzello POS - Sistem Kasir Cloud Masa Depan",
  description: "Parzello POS adalah sistem kasir modern berbasis cloud untuk UMKM hingga Enterprise. Kelola stok, laporan, dan cabang dengan mudah.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", outfit.variable, spaceGroteskHeading.variable)}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
