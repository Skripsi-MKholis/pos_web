"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconCheck, IconStar, IconCrown, IconBolt, IconRocket, IconBuildingStore } from "@tabler/icons-react"
import { toast } from "sonner"
import { useState } from "react"
import { updateStorePlan, toggleSubscriptionGating, type Plan, type Subscription } from "@/lib/subscription-actions"
import { useRouter } from "next/navigation"
import posthog from "posthog-js"

interface BillingClientProps {
  storeId: string
  initialSubscription: Subscription | null
  initialPlans: Plan[]
  initialGatingEnabled: boolean
}

export default function BillingClient({ 
  storeId, 
  initialSubscription, 
  initialPlans,
  initialGatingEnabled
}: BillingClientProps) {
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(initialSubscription)
  const [isUpdating, setIsUpdating] = useState(false)

  const plans = initialPlans.map(plan => {
    let icon = IconBuildingStore
    if (plan.slug === 'umkm-hebat') icon = IconRocket
    if (plan.slug === 'bisnis-skalabel') icon = IconCrown

    // Format features for display
    const displayFeatures = [
      `${plan.max_outlets} Outlet Aktif`,
      plan.max_transactions === 0 ? "Transaksi UNLIMITED" : `Hingga ${plan.max_transactions} Transaksi / bln`,
    ]

    if (plan.features.tables) displayFeatures.push("Manajemen Meja & Dine-in")
    if (plan.features.kds) displayFeatures.push("Kitchen Display System (KDS)")
    if (plan.features.reservations) displayFeatures.push("Sistem Reservasi")
    if (plan.features.customers) displayFeatures.push("Manajemen Pelanggan")
    if (plan.features.promotions) displayFeatures.push("Promo & Voucher")
    if (plan.features.advanced_reports) displayFeatures.push("Laporan Detail & Ekspor")
    if (plan.features.multi_store_staff) displayFeatures.push("Manajemen Staf Multi-Toko")

    return {
      ...plan,
      displayFeatures,
      icon,
      popular: plan.slug === 'umkm-hebat',
      current: subscription?.plan_id === plan.id
    }
  })

  const handleSelect = async (plan: any) => {
    if (plan.current) {
      toast.info("Anda sudah menggunakan paket ini.")
      return
    }

    setIsUpdating(true)
    try {
      const result = await updateStorePlan(storeId, plan.slug)
      if (result.success) {
        posthog.capture("plan_upgraded", {
          plan_name: plan.name,
          plan_slug: plan.slug,
          plan_price: plan.price,
          store_id: storeId,
        })
        toast.success(`Berhasil beralih ke paket ${plan.name}!`)
        router.refresh()
      } else {
        toast.error("Gagal mengubah paket: " + result.error)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl rounded-[2.5rem] border-none bg-muted/30 ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
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
              <CardDescription className="text-xs line-clamp-2">{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-6 pt-4">
              <div className="space-y-1">
                <div className="text-3xl font-black">
                  {plan.price === 0 ? "Gratis" : `Rp ${(plan.price / 1000).toLocaleString()}rb`}
                  <span className="text-sm font-normal text-muted-foreground"> /bulan</span>
                </div>
              </div>

              <div className="space-y-4">
                <ul className="space-y-3 text-sm">
                  {plan.displayFeatures.map((feature) => (
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
                disabled={isUpdating}
                onClick={() => handleSelect(plan)}
                className={`w-full rounded-2xl h-12 text-sm font-bold transition-all ${plan.current ? "bg-muted text-muted-foreground" : "shadow-lg shadow-primary/20"}`} 
                variant={plan.current ? "secondary" : "default"}
              >
                {plan.current ? "Kelola Paket" : isUpdating ? "Memproses..." : `Pilih Paket`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Admin Toggle Section */}
      <Card className="rounded-[2.5rem] border-2 border-dashed border-primary/20 bg-primary/5 overflow-hidden">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary">
              <Badge className="bg-primary text-primary-foreground">Admin Mode</Badge>
              <h3 className="text-xl font-black tracking-tight">Toggle Pembatasan Fitur</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Gunakan toggle ini untuk mengaktifkan atau menonaktifkan pengecekan langganan secara global (untuk tujuan pengujian).
            </p>
          </div>
          <Button 
            onClick={async () => {
              const newValue = initialGatingEnabled ? 'false' : 'true'
              // We need an action for this
              toast.promise(toggleSubscriptionGating(newValue), {
                loading: 'Memperbarui status...',
                success: 'Status pembatasan fitur berhasil diubah!',
                error: 'Gagal memperbarui status.'
              })
            }}
            variant={initialGatingEnabled ? "destructive" : "default"} 
            className="rounded-xl px-10 h-14 font-bold shrink-0"
          >
            {initialGatingEnabled ? "Matikan Pembatasan" : "Aktifkan Pembatasan"}
          </Button>
        </CardContent>
      </Card>

      {/* Custom Solution Card - Clean Style */}
      <Card className="rounded-[2.5rem] border-none bg-muted/20 shadow-sm overflow-hidden">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tight text-center md:text-left">Butuh solusi khusus?</h3>
            <p className="text-sm text-muted-foreground text-center md:text-left">Hubungi tim kami untuk penawaran paket kustom sesuai skala bisnis anda.</p>
          </div>
          <Button 
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
