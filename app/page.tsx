import Link from "next/link"
import { 
  IconBuildingStore, 
  IconShoppingCart, 
  IconChartBar, 
  IconDeviceMobile, 
  IconShieldCheck,
  IconArrowRight,
  IconCheck
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/select-store")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <IconBuildingStore size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Kholis POS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Fitur</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Harga</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button className="font-bold shadow-lg shadow-primary/20">Mulai Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--primary-muted)_0%,transparent_100%)] opacity-30" />
          
          <div className="container text-center space-y-8 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Sistem POS Cloud Terbaru v1.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Kelola Bisnis Jadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Jauh Lebih Mudah</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sistem kasir modern berbasis cloud untuk UMKM hingga Enterprise. Pantau stok, laporan keuangan, dan kelola banyak cabang dalam satu genggaman.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:scale-105 transition-transform group">
                  Daftar Sekarang Secara Gratis
                  <IconArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-2xl bg-background/50 backdrop-blur-sm border-2">
                  Coba Demo Dashboard
                </Button>
              </Link>
            </div>

            {/* Dashboard Mockup Shadow Effect */}
            <div className="mt-16 relative mx-auto max-w-5xl rounded-3xl border bg-card p-2 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-1000">
               <div className="bg-muted rounded-2xl aspect-video w-full relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
                 <div className="p-8 flex flex-col gap-4">
                    <div className="h-8 w-1/3 bg-background rounded-md animate-pulse" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-32 bg-background rounded-xl shadow-sm border animate-pulse" />
                      <div className="h-32 bg-background rounded-xl shadow-sm border animate-pulse" />
                      <div className="h-32 bg-background rounded-xl shadow-sm border animate-pulse" />
                    </div>
                    <div className="h-full bg-background rounded-xl shadow-sm border animate-pulse" />
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Hadir Dengan Fitur Lengkap</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Kami membangun POS ini berdasarkan kebutuhan nyata pemilik bisnis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Kasir Responsif",
                  desc: "Antarmuka yang dioptimalkan untuk tablet, smartphone, maupun komputer.",
                  icon: IconDeviceMobile,
                  color: "bg-blue-500"
                },
                {
                  title: "Manajemen Inventaris",
                  desc: "Pantau stok secara real-time dan dapatkan notifikasi saat stok mulai menipis.",
                  icon: IconShoppingCart,
                  color: "bg-green-500"
                },
                {
                  title: "Laporan Canggih",
                  desc: "Visualisasi data penjualan harian, mingguan, hingga tahunan secara instan.",
                  icon: IconChartBar,
                  color: "bg-purple-500"
                },
                {
                  title: "Multi-Outlet",
                  desc: "Kelola banyak cabang toko hanya dari satu akun pusat manajemen.",
                  icon: IconBuildingStore,
                  color: "bg-orange-500"
                },
                {
                  title: "Data Cloud Aman",
                  desc: "Data tersimpan aman di cloud dengan cadangan otomatis (backup).",
                  icon: IconShieldCheck,
                  color: "bg-red-500"
                },
                {
                  title: "Keamanan Role-Based",
                  desc: "Atur hak akses yang berbeda untuk Owner dan Karyawan kasir.",
                  icon: IconCheck,
                  color: "bg-emerald-500"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-card border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`h-14 w-14 rounded-2xl ${feature.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-${feature.color.split('-')[1]}/20`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24">
          <div className="container">
            <div className="bg-primary rounded-[3rem] p-12 text-primary-foreground text-center space-y-8 shadow-2xl shadow-primary/30 relative overflow-hidden">
              {/* Abstract decorative circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              
              <h2 className="text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight relative">
                Siap Meluncurkan Bisnis Anda ke Level Berikutnya?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto relative">
                Tanpa biaya pendaftaran, tanpa kartu kredit. Mulai operasional toko Anda hari ini juga.
              </p>
              <div className="flex justify-center relative">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold rounded-2xl hover:scale-105 transition-transform bg-white text-primary">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <IconBuildingStore size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight">Kholis POS</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium text-center">
            &copy; {new Date().getFullYear()} Kholis POS. Sistem Kasir Modern untuk Indonesia.
          </p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-primary transition-colors">Kontak</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
