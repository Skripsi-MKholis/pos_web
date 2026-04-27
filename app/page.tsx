"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { 
  IconBuildingStore, 
  IconShoppingCart, 
  IconChartBar, 
  IconDeviceMobile, 
  IconShieldCheck,
  IconArrowRight,
  IconCheck,
  IconSparkles,
  IconBolt,
  IconWorld,
  IconRocket,
  IconStack2
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client" // Since it's a client component now
import { useRouter } from "next/navigation"
import { CookieConsent } from "@/components/cookie-consent"

export default function LandingPage() {
  const router = useRouter()

  React.useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push("/select-store")
      }
    }
    checkAuth()
  }, [router])
  
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <CookieConsent />
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-20" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-150" />
      </div>

      {/* Navigation */}
      <header 
        className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/40 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/40 group-hover:rotate-12 transition-transform duration-500 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
               <IconBuildingStore size={26} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none">PARZELLO <span className="text-primary italic">POS</span></span>
              <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase opacity-60">Enterprise Cloud</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10 text-[13px] font-black uppercase tracking-widest text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-all hover:tracking-[0.15em]">Sistem</Link>
            <Link href="#solutions" className="hover:text-primary transition-all hover:tracking-[0.15em]">Solusi</Link>
            <Link href="#pricing" className="hover:text-primary transition-all hover:tracking-[0.15em]">Harga</Link>
            <Link href="/privacy" className="hover:text-primary transition-all hover:tracking-[0.15em]">Privasi</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-black uppercase text-xs tracking-widest hover:bg-white/5">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button className="h-11 px-8 font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/50 rounded-xl relative overflow-hidden group">
                <span className="relative z-10">Mulai Sekarang</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-24 px-4 overflow-hidden">
          <div className="container mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest mb-10 shadow-xl backdrop-blur-md"
            >
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="h-5 w-5 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <span className="opacity-80">🔥 Dipercaya 1.2k+ Bisnis Lokal</span>
              <IconSparkles size={14} className="text-amber-400" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black tracking-tight max-w-5xl mx-auto leading-[0.95] mb-8"
            >
              KENDALIKAN BISNIS <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary via-emerald-400 to-emerald-600">DENGAN MAGIC.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
            >
              Satu ekosistem cerdas untuk operasional kasir, inventaris, hingga analitik cabang dalam satu antarmuka yang sangat elegan.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/register">
                <Button size="lg" className="h-16 px-12 text-sm font-black uppercase tracking-widest rounded-2xl shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] hover:shadow-primary/40 hover:-translate-y-1 transition-all group">
                  Bangun Toko Anda
                  <IconArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-all" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-16 px-10 text-sm font-black uppercase tracking-widest rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-white/10 hover:bg-white/10 group">
                  <IconBolt className="mr-3 text-amber-400 group-hover:animate-bounce" /> Lihat Fitur
                </Button>
              </Link>
            </motion.div>

            {/* Dashboard Preview - MagicUI Style */}
            <motion.div 
              initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="mt-24 relative mx-auto max-w-6xl p-4 rounded-[3.5rem] bg-gradient-to-b from-white/10 to-transparent border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
            >
               <div className="bg-[#0f111a] rounded-[2.5rem] aspect-[16/9] w-full relative overflow-hidden border border-white/5 group">
                  {/* Mock Dashboard UI */}
                  <div className="absolute inset-0 p-8 grid grid-cols-12 gap-6 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                    <div className="col-span-3 space-y-6">
                       <div className="h-12 w-full bg-white/10 rounded-2xl" />
                       <div className="h-full bg-white/5 rounded-3xl" />
                    </div>
                    <div className="col-span-9 space-y-6">
                       <div className="flex gap-4">
                          <div className="h-28 flex-1 bg-primary/20 rounded-[2rem] border border-primary/20" />
                          <div className="h-28 flex-1 bg-white/5 rounded-[2rem] border border-white/10" />
                          <div className="h-28 flex-1 bg-white/5 rounded-[2rem] border border-white/10" />
                       </div>
                       <div className="h-full bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center">
                          <div className="h-2/3 w-3/4 border-2 border-dashed border-white/10 rounded-[2rem]" />
                       </div>
                    </div>
                  </div>
                  {/* Floating Action Cards */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="relative h-20 w-20 bg-primary rounded-3xl shadow-3xl shadow-primary/50 animate-pulse flex items-center justify-center">
                        <IconSparkles size={40} className="text-white" />
                     </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent" />
               </div>
            </motion.div>
          </div>
        </section>

        {/* MARQUEE SECTION - Trusted By */}
        <section className="py-20 border-y border-white/5 bg-white/2 overflow-hidden relative">
           <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10" />
           <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10" />
           
           <div className="flex whitespace-nowrap animate-marquee px-4 gap-20 items-center">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="flex items-center gap-4 opacity-30 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-default">
                  <div className="h-10 w-10 bg-muted-foreground/20 rounded-xl" />
                  <span className="text-2xl font-black uppercase tracking-tighter">PARTNER_{i}</span>
                </div>
              ))}
           </div>
        </section>

        {/* BENTO GRID FEATURES */}
        <section id="features" className="py-32 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-24 space-y-6">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[0.9]">TEKNOLOGI MASA <br/><span className="text-primary italic">DEPAN</span> BISNIS ANDA.</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto uppercase tracking-widest font-black text-[10px] opacity-60">Keunggulan Parzello Cloud</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-7xl mx-auto">
              {/* Feature 1: Large Bento Card */}
              <motion.div whileHover={{ y: -5 }} className="md:col-span-8 h-[400px] rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-background border border-white/10 p-10 flex flex-col justify-between overflow-hidden group relative">
                 <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                 <div className="relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white mb-6 shadow-2xl shadow-primary/30">
                       <IconDeviceMobile size={28} />
                    </div>
                    <h3 className="text-4xl font-black tracking-tight mb-4 uppercase">Multi-Platform <br/>Sync.</h3>
                    <p className="text-muted-foreground text-lg max-w-sm">Akses dari tablet, hp, atau komputer. Semua data tersinkronisasi secara instan ke cloud.</p>
                 </div>
                 <div className="relative z-10 flex gap-2">
                    <Badge className="bg-white/5 border-white/10 text-white rounded-full">iOS</Badge>
                    <Badge className="bg-white/5 border-white/10 text-white rounded-full">Android</Badge>
                    <Badge className="bg-white/5 border-white/10 text-white rounded-full">Web</Badge>
                 </div>
              </motion.div>

              {/* Feature 2: Small Bento Card */}
              <motion.div whileHover={{ y: -5 }} className="md:col-span-4 h-[400px] rounded-[3rem] bg-card/60 backdrop-blur-xl border border-white/10 p-10 flex flex-col items-center justify-center text-center group shadow-xl">
                 <div className="h-20 w-20 rounded-[2rem] bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20 group-hover:rotate-[360deg] transition-transform duration-1000 shadow-lg shadow-amber-500/5">
                    <IconBolt size={32} />
                 </div>
                 <h3 className="text-2xl font-black tracking-tight mb-4 uppercase">Kecepatan <br/>Kilat.</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed font-medium">Arsitektur Next.js 15 & Turbopack memastikan transaksi terproses dalam milidetik.</p>
              </motion.div>

              {/* Feature 3: Small Bento Card */}
              <motion.div whileHover={{ y: -5 }} className="md:col-span-4 h-[400px] rounded-[3rem] bg-card/40 backdrop-blur-xl border border-white/10 p-10 flex flex-col justify-end group shadow-xl">
                 <div className="flex-1 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-3 opacity-30 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                       {[1,2,3,4].map(i => <div key={i} className="h-12 w-12 bg-primary/20 rounded-xl shadow-inner border border-primary/10" />)}
                    </div>
                 </div>
                 <h3 className="text-xl font-black tracking-tight mb-4 uppercase flex items-center gap-2">
                    <IconChartBar className="text-emerald-500" /> Analitik AI.
                 </h3>
                 <p className="text-muted-foreground text-sm font-medium">Prediksi stok dan analisis tren penjualan masa depan menggunakan data histori.</p>
              </motion.div>

              {/* Feature 4: Large Bento Card */}
              <motion.div whileHover={{ y: -5 }} className="md:col-span-8 h-[400px] rounded-[3rem] bg-card/50 backdrop-blur-2xl border border-white/10 p-10 relative overflow-hidden group shadow-xl">
                 <div className="absolute top-0 right-0 p-10">
                    <IconShieldCheck size={140} className="text-primary/5 group-hover:text-primary/10 transition-colors" />
                 </div>
                 <h2 className="text-4xl font-black tracking-tight mb-8 uppercase leading-none">KEAMANAN <br/>Tingkat Tinggi.</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["End-to-End Encryption", "Daily Automatic Backups", "99.9% Server Uptime", "PCI-DSS Compliance"].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                           <IconCheck size={14} strokeWidth={4} />
                        </div>
                        <span className="text-xs font-black opacity-70 uppercase tracking-widest">{item}</span>
                      </div>
                    ))}
                 </div>
                 <div className="mt-8 flex gap-2">
                    <div className="h-2 w-24 bg-primary/20 rounded-full overflow-hidden">
                       <div className="h-full w-2/3 bg-primary animate-pulse" />
                    </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION - MagicUI Style */}
        <section className="py-32 px-4">
          <div className="container mx-auto">
            <div className="relative rounded-[4rem] bg-primary p-20 overflow-hidden text-center shadow-[0_50px_100px_rgba(var(--primary-rgb),0.5)]">
               {/* Pattern */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
               
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="relative z-10 space-y-10"
               >
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none uppercase">
                    SIAP JADI <br/>LEBIH PROFESIONAL?
                  </h2>
                  <p className="text-xl text-white/80 max-w-xl mx-auto font-medium">
                    Gabung dengan ribuan bisnis modern yang telah beralih ke Parzello POS. Gratis 14 hari Trial Pro.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/register">
                      <Button size="lg" className="h-16 px-12 text-sm font-black uppercase tracking-widest rounded-2xl bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all shadow-2xl">
                        Mulai Sekarang Gratis
                      </Button>
                    </Link>
                    <Link href="/pricing">
                       <Button size="lg" variant="ghost" className="h-16 px-10 text-sm font-black uppercase tracking-widest text-white hover:bg-white/10 rounded-2xl">
                          Pelajari Pricing
                       </Button>
                    </Link>
                  </div>
               </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pt-32 pb-16 border-t border-white/5 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
        
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 relative z-10">
          <div className="col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-xl">
                 <IconBuildingStore size={22} />
              </div>
              <span className="text-2xl font-black tracking-tight uppercase">PARZELLO <span className="text-primary italic">POS</span></span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm font-medium leading-relaxed">
              Misi kami adalah mendigitalkan operasional UMKM di seluruh dunia dengan teknologi yang sangat kuat namun tetap indah dan mudah digunakan.
            </p>
          </div>
          
          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Perusahaan</h4>
             <ul className="space-y-4 text-sm font-black uppercase tracking-tighter opacity-70">
                <li><Link href="#">Tentang Kami</Link></li>
                <li><Link href="#">Karir</Link></li>
                <li><Link href="#">Blog</Link></li>
             </ul>
          </div>

          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dukungan</h4>
             <ul className="space-y-4 text-sm font-black uppercase tracking-tighter opacity-70">
                <li><Link href="#">Pusat Bantuan</Link></li>
                <li><Link href="#">Status Server</Link></li>
                <li><Link href="#">API Docs</Link></li>
             </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-t border-white/5 pt-8 opacity-40">
           <p>&copy; {new Date().getFullYear()} PARZELLO SYSTEMS INC. ALL RIGHTS RESERVED.</p>
           <div className="flex gap-10">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border rounded", className)}>
      {children}
    </span>
  )
}
