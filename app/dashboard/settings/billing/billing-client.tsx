"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconCheck, IconStar, IconCrown, IconBolt, IconRocket, IconBuildingStore } from "@tabler/icons-react"
import { toast } from "sonner"

export default function BillingClient() {
  const plans = [
    {
      name: "Lite (UMKM Pemula)",
      price: "Rp 0",
      description: "Solusi dasar untuk memulai bisnis digital.",
      features: [
        "1 Outlet Aktif", 
        "Hingga 100 Transaksi /bulan", 
        "Manajemen Meja & Dine-in", 
        "Laporan Penjualan Dasar",
        "Dukungan Komunitas"
      ],
      icon: IconBuildingStore,
      current: true
    },
    {
      name: "UMKM Hebat",
      price: "Rp 49rb",
      description: "Fitur lengkap dengan harga paling bersahabat.",
      features: [
        "1 Outlet Aktif", 
        "Transaksi UNLIMITED", 
        "Buka Semua Fitur Modular", 
        "KDS & Sistem Reservasi", 
        "Manajemen Pelanggan & Promo",
        "Laporan Detail & Ekspor"
      ],
      icon: IconRocket,
      popular: true
    },
    {
      name: "Bisnis Skalabel",
      price: "Rp 149rb",
      description: "Untuk rantai bisnis yang siap ekspansi.",
      features: [
        "Hingga 5 Outlet Aktif", 
        "Transaksi UNLIMITED", 
        "Semua Fitur Modular + Eksklusif", 
        "Manajemen Staf Multi-Toko", 
        "Data Sync Real-time",
        "Dukungan Prioritas 24/7"
      ],
      icon: IconCrown
    }
  ]

  const handleSelect = (planName: string) => {
    toast.info(`Fitur pilihan paket ${planName} akan segera hadir!`, {
      description: "Mohon maaf, saat ini sistem pembayaran masih dalam tahap pengembangan.",
      duration: 4000
    })
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl rounded-[2.5rem] border-none bg-muted/30 ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
            {plan.current && (
              <div className="absolute top-6 right-6">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-none px-3 font-bold uppercase text-[10px] tracking-widest">Paket Sekarang</Badge>
              </div>
            )}
            
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-primary py-1.5 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground">Paling Populer</span>
              </div>
            )}

            <CardHeader className="pt-10">
              <div className={`h-14 w-14 rounded-2xl ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'} flex items-center justify-center mb-6`}>
                <plan.icon size={28} />
              </div>
              <CardTitle className="text-xl font-black">{plan.name}</CardTitle>
              <CardDescription className="text-xs">{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-6 pt-4">
              <div className="space-y-1">
                <div className="text-3xl font-black">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground"> /bulan</span>
                </div>
              </div>

              <div className="space-y-4">
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <IconCheck size={16} className="text-primary mt-0.5 shrink-0" strokeWidth={3} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="pb-8 pt-4">
              <Button 
                onClick={() => handleSelect(plan.name)}
                className={`w-full rounded-2xl h-12 text-sm font-bold transition-all ${plan.current ? "bg-muted text-muted-foreground" : "shadow-lg shadow-primary/20"}`} 
                variant={plan.current ? "secondary" : "default"}
              >
                {plan.current ? "Kelola Paket" : `Pilih Paket`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Custom Solution Card - Clean Style */}
      <Card className="rounded-[2.5rem] border-none bg-muted/20 shadow-sm overflow-hidden">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tight text-center md:text-left">Butuh solusi khusus?</h3>
            <p className="text-sm text-muted-foreground text-center md:text-left">Hubungi tim kami untuk penawaran paket kustom sesuai skala bisnis anda.</p>
          </div>
          <Button 
            onClick={() => handleSelect("Enterprise")}
            variant="outline" 
            className="rounded-xl px-10 h-14 font-bold border-primary text-primary hover:bg-primary/10 shrink-0"
          >
            Hubungi Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
