import * as React from "react"
import Link from "next/link"
import { IconArrowLeft, IconShieldCheck, IconBuildingStore } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
              <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner border border-emerald-500/20">
                 <IconShieldCheck size={36} />
              </div>
              <h1 className="text-5xl font-black tracking-tighter tracking-tight">KEBIJAKAN PRIVASI</h1>
              <p className="text-muted-foreground uppercase tracking-[0.2em] font-black text-xs opacity-60">Terakhir Diperbarui: 27 April 2026</p>
           </div>

           <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">
              <section className="space-y-4">
                 <h2 className="text-white text-2xl font-black uppercase tracking-tight">1. Informasi yang Kami Kumpulkan</h2>
                 <p>Kami mengumpulkan informasi yang diperlukan untuk menyediakan layanan operasional bisnis yang efektif kepada Anda, termasuk data pribadi, informasi bisnis toko, dan data transaksi operasional.</p>
                 <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Data Akun:</strong> Nama lengkap, email, dan foto profil.</li>
                    <li><strong>Data Toko:</strong> Nama toko, alamat outlet, dan pengaturan modular.</li>
                    <li><strong>Data Operasional:</strong> Inventaris produk, harga modal, riwayat penjualan, dan database pelanggan.</li>
                 </ul>
              </section>

              <section className="space-y-4">
                 <h2 className="text-white text-2xl font-black uppercase tracking-tight">2. Penggunaan Informasi</h2>
                 <p>Informasi Anda digunakan untuk menjalankan fungsi kasir secara akurat, personlisasi identitas toko pada struk, analisis bisnis grafik penjualan, dan pengiriman notifikasi operasional penting.</p>
              </section>

              <section className="space-y-4">
                 <h2 className="text-white text-2xl font-black uppercase tracking-tight">3. Keamanan Data</h2>
                 <p>Kami menggunakan infrastruktur cloud <strong>Supabase</strong> dengan enkripsi tingkat tinggi dan sistem <em>Row Level Security</em> (RLS) untuk memastikan data toko Anda terisolasi dan aman.</p>
              </section>

              <section className="space-y-4">
                 <h2 className="text-white text-2xl font-black uppercase tracking-tight">4. Hak Pengguna</h2>
                 <p>Anda berhak mengakses, memperbaiki, dan meminta penghapusan data Anda kapan saja melalui dashboard pengaturan atau dengan menghubungi tim dukungan kami.</p>
              </section>

              <section className="space-y-4 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                 <h2 className="text-emerald-500 text-xl font-black uppercase tracking-tight">Hubungi Kami</h2>
                 <p className="text-sm">Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, hubungi kami di <span className="text-white font-bold underline">support@parzello.id</span></p>
              </section>
           </div>
        </div>
      </main>

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>
    </div>
  )
}
