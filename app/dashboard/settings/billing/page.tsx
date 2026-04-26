import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconCheck, IconStar, IconCrown, IconBolt } from "@tabler/icons-react"

export default function BillingPage() {
  const plans = [
    {
      name: "Free",
      price: "Rp 0",
      description: "Cocok untuk UMKM pemula",
      features: ["1 Outlet", "Stok Produk Terbatas", "Laporan Harian", "1 Akun Kasir"],
      icon: IconBolt,
      current: true
    },
    {
      name: "Professional",
      price: "Rp 150rb",
      description: "Untuk bisnis yang sedang berkembang",
      features: ["3 Outlet", "Stok Tanpa Batas", "Laporan Detail & Ekspor", "Manajemen Staf", "Support 24/7"],
      icon: IconStar,
      color: "border-primary shadow-primary/20 shadow-lg"
    },
    {
      name: "Enterprise",
      price: "Rp 450rb",
      description: "Solusi lengkap untuk rantai bisnis besar",
      features: ["Outlet Tanpa Batas", "Stok Global / Sync", "API Access", "Custom Branding", "Account Manager"],
      icon: IconCrown
    }
  ]

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Langganan & Billing</h1>
        <p className="text-muted-foreground">Pilih paket yang sesuai dengan skala bisnis Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 ${plan.color || ""}`}>
            {plan.current && (
              <div className="absolute top-0 right-0 p-3">
                <Badge className="bg-primary hover:bg-primary">Paket Aktif</Badge>
              </div>
            )}
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <plan.icon size={28} />
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">/bulan</span>
              </div>
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <IconCheck size={16} className="text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full rounded-xl h-11 font-bold" variant={plan.current ? "secondary" : "default"}>
                {plan.current ? "Kelola Paket" : `Upgrade ke ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20 rounded-2xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Butuh solusi khusus?</h3>
            <p className="text-sm text-muted-foreground">Hubungi tim penjualan kami untuk penawaran paket enterprise kustom.</p>
          </div>
          <Button variant="outline" className="rounded-xl px-8 border-primary text-primary hover:bg-primary/10">
            Hubungi Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
