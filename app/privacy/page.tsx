import { IconShieldCheck } from "@tabler/icons-react"

import { LandingBackground, PublicFooter, PublicHeader } from "@/components/landing/public-shell"

const sections = [
  {
    title: "1. Informasi yang Kami Kumpulkan",
    body: "Kami mengumpulkan informasi yang diperlukan untuk menyediakan layanan operasional bisnis, termasuk data akun, informasi toko, data transaksi, produk, stok, pelanggan, dan pengaturan operasional.",
  },
  {
    title: "2. Penggunaan Informasi",
    body: "Informasi digunakan untuk menjalankan fitur kasir, mengelola toko, menampilkan laporan, menyinkronkan data antar perangkat, dan mengirim notifikasi operasional penting.",
  },
  {
    title: "3. Keamanan Data",
    body: "Kami menggunakan infrastruktur cloud dengan kontrol akses dan isolasi data untuk membantu menjaga informasi toko tetap aman sesuai hak akses pengguna.",
  },
  {
    title: "4. Hak Pengguna",
    body: "Anda dapat mengakses, memperbarui, atau meminta penghapusan data melalui dashboard pengaturan atau dengan menghubungi tim dukungan Parzello POS.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <LandingBackground />
      <PublicHeader backHref="/" />

      <main className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="mb-10 space-y-5">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <IconShieldCheck size={30} />
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-primary">Legal</p>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">Kebijakan Privasi</h1>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Terakhir diperbarui: 27 April 2026</p>
          </div>
        </div>

        <div className="space-y-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-black leading-tight tracking-tight">{section.title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">{section.body}</p>
            </section>
          ))}

          <section className="rounded-2xl border border-border bg-muted/30 p-5 sm:p-6">
            <h2 className="text-lg font-black tracking-tight">Hubungi Kami</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground">
              Pertanyaan terkait kebijakan privasi dapat dikirim ke{" "}
              <span className="font-black text-foreground">support@parzello.id</span>.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
