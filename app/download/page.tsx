import type { Metadata } from "next"
import Image from "next/image"
import { IconDeviceMobile } from "@tabler/icons-react"

import { LandingBackground, PublicFooter, PublicHeader } from "@/components/landing/public-shell"
import { DownloadEmailModal } from "./download-email-modal"

export const metadata: Metadata = {
  title: "Download Aplikasi Mobile",
  description:
    "Download aplikasi mobile Parzello POS untuk mengelola transaksi, stok, laporan, dan operasional toko langsung dari perangkat Android atau iOS.",
}

const screenshots = [
  "Screenshot_20260520-030455.png",
  "Screenshot_20260520-030516.png",
  "Screenshot_20260520-030532.png",
  "Screenshot_20260520-030554.png",
  "Screenshot_20260520-030558.png",
  "Screenshot_20260520-030605.png",
  "Screenshot_20260520-030617.png",
  "Screenshot_20260520-030712.png",
]

export default function DownloadPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <LandingBackground />
      <PublicHeader backHref="/" />

      <main>
        <section className="container mx-auto grid gap-10 px-4 py-10 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
          <div className="max-w-2xl space-y-7">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-primary shadow-sm">
              <IconDeviceMobile size={16} />
              Aplikasi mobile Parzello POS
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
                Download aplikasi mobile Parzello POS.
              </h1>
              <p className="max-w-xl text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
                Daftarkan email tester, join Google Group Parzello Tester, lalu buka link Google Play Testing
                untuk install aplikasi mobile.
              </p>
            </div>

            <DownloadEmailModal />

            <p className="text-xs font-bold leading-relaxed text-muted-foreground">
              Gunakan email Google yang sama di semua langkah agar akses testing dapat dikenali oleh Google Play.
            </p>
          </div>

          <ScreenshotShowcase />
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

function ScreenshotShowcase() {
  const [mainScreenshot, ...thumbnailScreenshots] = screenshots

  return (
    <div className="relative">
      <div className="absolute inset-x-8 top-10 h-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative grid gap-4 rounded-3xl border border-border bg-card/85 p-4 shadow-2xl shadow-black/10 sm:p-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="mx-auto w-full max-w-[280px] sm:max-w-[330px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-background shadow-xl">
            <Image
              src={`/screenshot/${mainScreenshot}`}
              alt="Screenshot utama aplikasi mobile Parzello POS"
              width={430}
              height={932}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 self-center sm:gap-3 lg:grid-cols-3">
          {thumbnailScreenshots.map((name, index) => (
            <div key={name} className="relative overflow-hidden rounded-xl border border-border bg-background shadow-sm">
              <Image
                src={`/screenshot/${name}`}
                alt={`Screenshot kecil aplikasi mobile Parzello POS ${index + 2}`}
                width={430}
                height={932}
                className="aspect-[9/19] h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
