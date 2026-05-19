import Link from "next/link"
import {
  IconArrowLeft,
  IconBuildingStore,
  IconDeviceMobile,
  IconLogin2,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Fitur", href: "/#features" },
  { label: "Solusi", href: "/#solutions" },
  { label: "Harga", href: "/#pricing" },
  { label: "Download", href: "/download" },
]

export function PublicHeader({ backHref }: { backHref?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:h-20">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <IconBuildingStore size={22} strokeWidth={2.4} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-black tracking-tight sm:text-xl">
              PARZELLO <span className="text-primary italic">POS</span>
            </span>
            <span className="hidden text-[10px] font-black uppercase tracking-widest text-muted-foreground sm:block">
              Cloud Point of Sale
            </span>
          </span>
        </Link>

        {backHref ? (
          <Button asChild variant="ghost" className="h-10 rounded-xl px-3 text-xs font-black uppercase tracking-widest">
            <Link href={backHref}>
              <IconArrowLeft size={16} />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
          </Button>
        ) : (
          <>
            <nav className="hidden items-center gap-7 text-[12px] font-black uppercase tracking-widest text-muted-foreground lg:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <Button asChild variant="outline" className="hidden h-10 rounded-xl px-3 text-xs font-black uppercase tracking-widest sm:inline-flex">
                <Link href="/download">
                  <IconDeviceMobile size={16} />
                  App
                </Link>
              </Button>
              <Button asChild className="h-10 rounded-xl px-3 text-xs font-black uppercase tracking-widest sm:px-5">
                <Link href="/login">
                  <IconLogin2 size={16} />
                  Masuk
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="max-w-md space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <IconBuildingStore size={22} />
            </span>
            <span className="text-xl font-black tracking-tight">
              PARZELLO <span className="text-primary italic">POS</span>
            </span>
          </Link>
          <p className="text-sm font-medium leading-relaxed text-muted-foreground">
            Sistem kasir cloud untuk operasional toko, restoran, dan bisnis multi-cabang dengan dashboard web dan aplikasi mobile.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Produk</h2>
          <div className="grid gap-3 text-sm font-bold">
            <Link href="/#features" className="hover:text-primary">Fitur</Link>
            <Link href="/#pricing" className="hover:text-primary">Harga</Link>
            <Link href="/download" className="hover:text-primary">Download Mobile</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Legal</h2>
          <div className="grid gap-3 text-sm font-bold">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col gap-3 border-t border-border/60 px-4 py-5 text-xs font-bold text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Parzello Systems. All rights reserved.</p>
        <p>Dibuat untuk operasional bisnis modern.</p>
      </div>
    </footer>
  )
}

export function LandingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
      <div className="absolute inset-0 bg-background/70" />
    </div>
  )
}
