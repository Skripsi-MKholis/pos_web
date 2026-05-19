import type { Metadata } from "next"
import Link from "next/link"
import {
  IconArrowLeft,
  IconBrandApple,
  IconBrandGooglePlay,
  IconBuildingStore,
  IconCheck,
  IconCloudDownload,
  IconDeviceMobile,
  IconDownload,
  IconQrcode,
  IconRefresh,
  IconShieldCheck,
  IconWifiOff,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Download Aplikasi Mobile",
  description:
    "Download aplikasi mobile Parzello POS untuk mengelola transaksi, stok, laporan, dan operasional toko langsung dari perangkat Android atau iOS.",
}

const mobileFeatures = [
  {
    icon: IconDeviceMobile,
    title: "Kasir di Genggaman",
    description: "Proses transaksi, cek meja, dan pantau order langsung dari perangkat mobile.",
  },
  {
    icon: IconRefresh,
    title: "Sinkronisasi Cloud",
    description: "Data produk, stok, dan laporan tersambung otomatis dengan dashboard web.",
  },
  {
    icon: IconWifiOff,
    title: "Mode Operasional Ringan",
    description: "Antarmuka dibuat cepat untuk penggunaan harian di toko, kafe, dan booth.",
  },
  {
    icon: IconShieldCheck,
    title: "Aman untuk Tim",
    description: "Login menggunakan akun Parzello POS dengan hak akses sesuai role pengguna.",
  },
]

const installSteps = [
  "Download aplikasi sesuai perangkat.",
  "Masuk memakai akun Parzello POS yang sudah aktif.",
  "Pilih toko dan mulai kelola operasional mobile.",
]

export default function DownloadPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background selection:bg-primary/30 selection:text-primary">
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/40 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <IconBuildingStore size={22} />
            </div>
            <span className="text-xl font-black tracking-tight">
              PARZELLO <span className="text-primary italic">POS</span>
            </span>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              className="gap-2 rounded-full text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              <IconArrowLeft size={16} />
              Kembali
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative">
        <section className="container mx-auto grid min-h-screen grid-cols-1 items-center gap-16 px-4 pb-24 pt-32 lg:grid-cols-2 lg:pt-24">
          <div className="relative z-10 max-w-3xl space-y-10">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-primary shadow-xl backdrop-blur-md">
              <IconCloudDownload size={16} />
              Aplikasi Mobile Parzello POS
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                DOWNLOAD APLIKASI MOBILE UNTUK BISNIS ANDA.
              </h1>
              <p className="max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
                Bawa operasional Parzello POS ke perangkat mobile. Cocok untuk kasir mobile, pengecekan
                stok cepat, monitoring order, dan akses laporan saat Anda tidak di depan komputer.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Button className="h-16 justify-start gap-3 rounded-2xl px-5 text-left shadow-2xl shadow-primary/30">
                <IconBrandGooglePlay size={26} />
                <span className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Download di</span>
                  <span className="text-sm font-black uppercase">Google Play</span>
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-16 justify-start gap-3 rounded-2xl border-2 border-white/10 bg-white/5 px-5 text-left backdrop-blur-xl"
              >
                <IconBrandApple size={28} />
                <span className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Download di</span>
                  <span className="text-sm font-black uppercase">App Store</span>
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-16 justify-start gap-3 rounded-2xl border-2 border-white/10 bg-white/5 px-5 text-left backdrop-blur-xl"
              >
                <IconDownload size={26} />
                <span className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Installer</span>
                  <span className="text-sm font-black uppercase">APK Android</span>
                </span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
              {["Android 8+", "iOS 14+", "Sinkron Cloud", "Akun Parzello"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <IconCheck size={14} className="text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-lg">
            <div className="absolute h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="relative w-[280px] rounded-[3rem] border border-white/20 bg-[#0f111a] p-4 shadow-[0_50px_120px_rgba(0,0,0,0.45)] sm:w-[330px]">
              <div className="rounded-[2.4rem] border border-white/10 bg-background p-5">
                <div className="mx-auto mb-6 h-1.5 w-20 rounded-full bg-white/15" />
                <div className="space-y-5">
                  <div className="rounded-[2rem] bg-primary p-5 text-primary-foreground shadow-2xl shadow-primary/30">
                    <div className="mb-12 flex items-center justify-between">
                      <IconBuildingStore size={26} />
                      <span className="rounded-full bg-white/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                        Live
                      </span>
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-70">Penjualan Hari Ini</p>
                    <p className="mt-2 text-3xl font-black tracking-tight">Rp 8,4 jt</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {["Transaksi", "Stok", "Order", "Laporan"].map((item, index) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-6 h-8 w-8 rounded-xl bg-primary/15" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {item}
                        </p>
                        <p className="mt-1 text-xl font-black">{index === 0 ? "128" : index === 1 ? "943" : index === 2 ? "24" : "12"}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Scan untuk akses
                      </span>
                      <IconQrcode size={18} className="text-primary" />
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 49 }).map((_, index) => (
                        <div
                          key={index}
                          className={`aspect-square rounded-[3px] ${
                            index % 3 === 0 || index % 7 === 0 || index % 11 === 0 ? "bg-primary" : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-white/[0.02] px-4 py-24">
          <div className="container mx-auto grid gap-4 md:grid-cols-4">
            {mobileFeatures.map((feature) => (
              <div key={feature.title} className="rounded-[2rem] border border-white/10 bg-card/50 p-7 shadow-xl backdrop-blur-xl">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <feature.icon size={24} />
                </div>
                <h2 className="mb-3 text-lg font-black uppercase tracking-tight">{feature.title}</h2>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Mulai dalam 3 langkah</p>
              <h2 className="text-4xl font-black uppercase leading-none tracking-tight md:text-5xl">
                Instal, login, langsung operasional.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {installSteps.map((step, index) => (
                <div key={step} className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
                  <span className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="text-sm font-black uppercase leading-relaxed tracking-wider">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[420px] w-[420px] -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-500/10 blur-[110px]" />
      </div>
    </div>
  )
}
