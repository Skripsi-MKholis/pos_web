import { IconFileText } from "@tabler/icons-react"

import { LandingBackground, PublicFooter, PublicHeader } from "@/components/landing/public-shell"

const sections = [
  {
    title: "1. Penerimaan Ketentuan",
    body: "Dengan mengakses atau menggunakan Parzello POS, Anda menyatakan telah membaca, memahami, dan setuju untuk mengikuti perjanjian pengguna ini.",
  },
  {
    title: "2. Akun dan Keamanan",
    body: "Anda bertanggung jawab menjaga kredensial akun. Aktivitas yang dilakukan melalui akun Anda dianggap sebagai aktivitas sah dari pemilik akun tersebut.",
  },
  {
    title: "3. Batasan Penggunaan",
    body: "Platform tidak boleh digunakan untuk transaksi ilegal, rekayasa balik, penyalahgunaan akses, atau upaya mengganggu keamanan layanan.",
  },
  {
    title: "4. Langganan dan Biaya",
    body: "Fitur premium dapat menggunakan model langganan. Pembatalan dan perubahan paket mengikuti kebijakan yang berlaku pada saat transaksi.",
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <LandingBackground />
      <PublicHeader backHref="/" />

      <main className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="mb-10 space-y-5">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <IconFileText size={30} />
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-primary">Legal</p>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">Perjanjian Pengguna</h1>
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
            <p className="text-sm font-medium leading-relaxed text-muted-foreground">
              Informasi hukum lebih lanjut dapat dikirim ke{" "}
              <span className="font-black text-foreground">legal@parzello.id</span>.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
