import * as React from "react"
import Link from "next/link"
import { IconArrowLeft, IconFileText, IconBuildingStore } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
               <IconBuildingStore size={22} />
            </div>
            <span className="font-black tracking-tight text-xl">PARZELLO <span className="text-primary italic">POS</span></span>
          </Link>
          <Link href="/">
             <Button variant="ghost" className="rounded-full gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                <IconArrowLeft size={16} />
                Kembali
             </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32 pb-24 max-w-4xl">
        <div className="space-y-12">
           <div className="space-y-4">
              <div className="h-16 w-16 rounded-[1.5rem] bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner border border-amber-500/20">
                 <IconFileText size={36} />
              </div>
              <h1 className="text-5xl font-black tracking-tighter tracking-tight">PERJANJIAN PENGGUNA</h1>
              <p className="text-muted-foreground uppercase tracking-[0.2em] font-black text-xs opacity-60">Terakhir Diperbarui: 27 April 2026</p>
           </div>

           <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                 <h2 className="text-white text-2xl font-black uppercase tracking-tight">1. Penerimaan Ketentuan</h2>
                 <p>Dengan mengakses atau menggunakan Parzello POS, Anda menyatakan bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Perjanjian ini. Penggunaan platform ini mencakup kepatuhan terhadap seluruh aturan operasional yang berlaku.</p>
              </section>

              <section className="space-y-4">
                 <h2 className="text-white text-2xl font-black uppercase tracking-tight">2. Akun dan Keamanan</h2>
                 <p>Anda bertanggung jawab penuh untuk menjaga kerahasiaan kredensial login Anda. Setiap transaksi atau aktivitas yang terjadi di bawah identitas akun Anda dianggap sebagai tindakan sah dari pemilik akun.</p>
              </section>

              <section className="space-y-4">
                 <h2 className="text-white text-2xl font-black uppercase tracking-tight">3. Batasan Penggunaan</h2>
                 <p>Dilarang keras menggunakan sistem ini untuk mencatat transaksi ilegal, melakukan rekayasa terbalik (reverse engineering), atau mencoba menembus keamanan infrastruktur cloud kami.</p>
              </section>

              <section className="space-y-4">
                 <h2 className="text-white text-2xl font-black uppercase tracking-tight">4. Langganan dan Biaya</h2>
                 <p>Sistem ini beroperasi dengan model biaya langganan untuk fitur premium. Pembatalan dapat dilakukan kapan saja, namun biaya yang sudah terbayar tidak dapat ditarik kembali kecuali ditentukan lain.</p>
              </section>

              <section className="space-y-4 p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 text-center">
                 <p className="text-sm">Untuk informasi hukum lebih lanjut, hubungi tim legal kami di <span className="text-white font-bold underline">legal@parzello.id</span></p>
              </section>
           </div>
        </div>
      </main>

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[130px]" />
      </div>
    </div>
  )
}
