"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconArrowRight,
  IconChartBar,
  IconCheck,
  IconClipboardList,
  IconCloud,
  IconDeviceMobile,
  IconReceipt,
  IconShieldCheck,
  IconShoppingCart,
  IconUsers,
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"

import { CookieConsent } from "@/components/cookie-consent"
import { LandingBackground, PublicFooter, PublicHeader } from "@/components/landing/public-shell"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

const stats = [
  { label: "Modul operasional", value: "12+" },
  { label: "Sinkronisasi cloud", value: "Realtime" },
  { label: "Cocok untuk cabang", value: "Multi-outlet" },
]

const features = [
  {
    icon: IconShoppingCart,
    title: "Kasir Cepat",
    description: "Transaksi, diskon, pembayaran, dan struk dibuat ringkas untuk ritme toko yang sibuk.",
  },
  {
    icon: IconClipboardList,
    title: "Stok Terkontrol",
    description: "Pantau stok, kategori, harga modal, dan pergerakan inventory dari satu dashboard.",
  },
  {
    icon: IconChartBar,
    title: "Laporan Bisnis",
    description: "Ringkasan penjualan, profit, produk laris, dan performa toko tersaji jelas.",
  },
  {
    icon: IconUsers,
    title: "Tim dan Role",
    description: "Atur akses staff, kasir, owner, dan admin tanpa mencampur data antar toko.",
  },
]

const solutions = [
  "Toko retail dan minimarket",
  "Kafe, restoran, dan booth F&B",
  "Bisnis multi-cabang",
  "Operasional dengan kasir mobile",
]

const pricing = [
  "Dashboard web",
  "Aplikasi mobile",
  "Manajemen produk dan stok",
  "Laporan transaksi",
  "Hak akses staff",
]

export default function LandingPage() {
  const router = useRouter()

  React.useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push("/select-store")
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <CookieConsent />
      <LandingBackground />
      <PublicHeader />

      <main>
        <section className="mx-auto max-w-7xl grid min-h-[calc(100vh-4rem)] gap-12 px-6 py-12 sm:min-h-[calc(100vh-5rem)] sm:py-16 sm:px-10 md:px-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:px-24">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-primary shadow-sm">
              <IconCloud size={16} />
              POS cloud untuk bisnis modern
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Sistem kasir yang rapi untuk jualan, stok, dan laporan.
              </h1>
              <p className="max-w-2xl text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
                Parzello POS membantu toko, kafe, dan bisnis multi-cabang menjalankan transaksi harian,
                inventaris, pelanggan, meja, promosi, dan laporan dari web maupun aplikasi mobile.
              </p>
            </div>

            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Button asChild size="lg" className="h-12 rounded-xl px-5 text-xs font-black uppercase tracking-widest sm:h-14 sm:px-7">
                <Link href="/login">
                  Masuk ke Sistem
                  <IconArrowRight size={18} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl bg-background/70 px-5 text-xs font-black uppercase tracking-widest sm:h-14 sm:px-7"
              >
                <Link href="/download">
                  <IconDeviceMobile size={18} />
                  Download App
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-card/75 p-4">
                  <p className="text-xl font-black tracking-tight">{item.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <DashboardPreview />
        </section>

        <section id="features" className="border-y border-border/60 bg-muted/20 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16 lg:px-24 space-y-10">
            <SectionHeading
              eyebrow="Fitur utama"
              title="Alur kerja kasir sampai laporan dibuat dalam satu sistem."
              description="Setiap modul dirancang untuk pekerjaan operasional yang berulang, bukan hanya tampilan dashboard."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon size={23} />
                  </div>
                  <h3 className="text-lg font-black tracking-tight">{feature.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="solutions" className="mx-auto max-w-7xl grid gap-10 px-6 py-16 sm:px-10 sm:py-20 md:px-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-24">
          <SectionHeading
            eyebrow="Solusi"
            title="Dipakai untuk operasional toko yang butuh cepat dan terukur."
            description="Layout kasir, monitoring meja, KDS, reservasi, customer, dan broadcast disiapkan untuk bisnis yang sudah mulai butuh sistem."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {solutions.map((solution) => (
              <div key={solution} className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconCheck size={17} strokeWidth={3} />
                </span>
                <p className="text-sm font-black uppercase tracking-wide">{solution}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16 lg:px-24">
            <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-12">
              <div className="space-y-5">
                <p className="text-[11px] font-black uppercase tracking-widest text-primary">Paket awal</p>
                <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  Mulai dari ekosistem web dan mobile untuk operasional harian.
                </h2>
                <p className="max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
                  Gunakan web untuk setup dan monitoring, lalu aplikasi mobile untuk kebutuhan kasir and akses cepat di lapangan.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-12 rounded-xl text-xs font-black uppercase tracking-widest">
                    <Link href="/login">Mulai Sekarang</Link>
                  </Button>
                  <Button asChild variant="outline" className="h-12 rounded-xl text-xs font-black uppercase tracking-widest">
                    <Link href="/download">Lihat Mobile App</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                {pricing.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
                    <IconCheck size={18} className="shrink-0 text-primary" strokeWidth={3} />
                    <span className="text-sm font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 sm:pb-20 md:px-16 lg:px-24">
          <div className="overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-3xl space-y-3">
                <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                  Jalankan bisnis dari dashboard web dan aplikasi mobile.
                </h2>
                <p className="text-sm font-semibold leading-relaxed text-primary-foreground/75 sm:text-base">
                  Satu akun untuk transaksi, produk, staff, laporan, dan operasional cabang.
                </p>
              </div>
              <Button asChild variant="secondary" className="h-12 rounded-xl px-6 text-xs font-black uppercase tracking-widest">
                <Link href="/download">
                  Download App
                  <IconArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-[11px] font-black uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">{description}</p>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-3xl border border-border bg-card p-3 shadow-2xl shadow-black/10 sm:p-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Parzello Dashboard</span>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-[0.72fr_1.28fr] sm:p-5">
            <div className="space-y-3">
              <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
                <IconReceipt size={24} />
                <p className="mt-8 text-[10px] font-black uppercase tracking-widest opacity-70">Penjualan hari ini</p>
                <p className="mt-1 text-2xl font-black">Rp 8,4 jt</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order aktif</p>
                <p className="mt-2 text-2xl font-black">24</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {["Produk", "Staff", "Cabang"].map((item, index) => (
                  <div key={item} className="rounded-2xl border border-border bg-card p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item}</p>
                    <p className="mt-4 text-xl font-black">{index === 0 ? "943" : index === 1 ? "18" : "3"}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tren penjualan</p>
                  <IconChartBar size={18} className="text-primary" />
                </div>
                <div className="flex h-32 items-end gap-2">
                  {[36, 58, 44, 72, 64, 84, 76].map((height, index) => (
                    <span key={index} className="flex-1 rounded-t-lg bg-primary/80" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <IconDeviceMobile size={20} className="text-primary" />
                  <p className="mt-3 text-xs font-black uppercase tracking-widest">Mobile ready</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <IconShieldCheck size={20} className="text-primary" />
                  <p className="mt-3 text-xs font-black uppercase tracking-widest">Role access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
