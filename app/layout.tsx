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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://parzello-pos.vercel.app'),
  title: {
    default: "Parzello POS - Sistem Kasir Cloud Masa Depan",
    template: "%s | Parzello POS"
  },
  description: "Parzello POS adalah sistem kasir modern berbasis cloud untuk UMKM hingga Enterprise. Kelola stok, laporan keuangan, dan multi-cabang dengan satu dashboard cerdas.",
  keywords: ["POS", "Sistem Kasir", "Point of Sale", "Software Kasir", "Manajemen Inventaris", "Parzello", "UMKM Digital"],
  authors: [{ name: "Parzello Team" }],
  creator: "Parzello Systems",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://parzello-pos.vercel.app",
    title: "Parzello POS - Sistem Kasir Cloud Masa Depan",
    description: "Digitalisasikan operasional bisnis Anda dengan Parzello POS. Elegan, Cepat, dan Cerdas.",
    siteName: "Parzello POS",
    images: [
      {
        url: "/og-image.png", // Recommended: 1200x630
        width: 1200,
        height: 630,
        alt: "Parzello POS Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parzello POS - Sistem Kasir Cloud Masa Depan",
    description: "Digitalisasikan operasional bisnis Anda dengan Parzello POS.",
    images: ["/og-image.png"],
    creator: "@parzello",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/pos_web.ico",
    apple: "/pos_web.ico",
  },
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
