"use client"

import * as React from "react"
import { 
  IconLoader2, 
  IconArrowRight, 
  IconToolsKitchen2, 
  IconBuildingStore, 
  IconFlame, 
  IconChevronLeft,
  IconCheck
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { createStore, setActiveStoreId } from "@/lib/store-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type BusinessModel = "restaurant" | "retail" | "coffee"

export function SetupForm() {
  const [step, setStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [model, setModel] = React.useState<BusinessModel>("restaurant")
  const router = useRouter()

  const [formData, setFormData] = React.useState({
    name: "",
    address: ""
  })

  const getInitialSettings = (model: BusinessModel) => {
    const base = {
      features: {
        tables: false,
        reservations: false,
        kds: false,
        promotions: true,
        customers: true
      },
      financial: {
        tax_enabled: false,
        tax_rate: 10,
        service_charge_enabled: false,
        service_charge_rate: 5
      },
      operational: {
        auto_print: false,
        low_stock_threshold: 5,
        business_model: model
      }
    }

    if (model === "restaurant") {
      base.features.tables = true
      base.features.reservations = true
      base.features.kds = true
      base.financial.tax_enabled = true
    } else if (model === "coffee") {
      base.features.kds = true
    }

    return base
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const settings = getInitialSettings(model)
      const result = await createStore(formData.name, formData.address, settings)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Toko berhasil dibuat! Menyiapkan dashboard...")
        if (result.data?.id) {
          await setActiveStoreId(result.data.id)
          window.location.href = "/dashboard"
        }
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-2xl bg-background/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-primary h-2 w-full transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }} />
        
        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black">Pilih Model Bisnis</h3>
                <p className="text-xs text-muted-foreground italic">Fitur akan menyesuaikan secara otomatis.</p>
              </div>

              <div className="grid gap-4">
                {[
                  { id: "restaurant", name: "Restoran / F&B", desc: "Mendukung Meja, KDS, & Reservasi", icon: IconToolsKitchen2, color: "text-primary bg-primary/10" },
                  { id: "retail", name: "Toko Ritel / Dagang", desc: "Fokus pada kecepatan & stok produk", icon: IconBuildingStore, color: "text-blue-500 bg-blue-500/10" },
                  { id: "coffee", name: "Kedai Kopi / Cafe", desc: "Sistem antrean & display dapur", icon: IconFlame, color: "text-orange-500 bg-orange-500/10" },
                ].map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setModel(item.id as BusinessModel)}
                    className={`relative p-4 rounded-3xl border-2 cursor-pointer transition-all ${model === item.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-border hover:border-primary/30'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <item.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                      {model === item.id && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          <IconCheck size={14} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={() => setStep(2)} className="w-full h-12 font-bold text-lg rounded-2xl shadow-xl shadow-primary/20">
                Lanjut
                <IconArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="rounded-full h-8 w-8">
                  <IconChevronLeft size={20} />
                </Button>
                <h3 className="text-xl font-black">Informasi Toko</h3>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="px-1 text-xs font-bold text-muted-foreground uppercase tracking-widest">Nama Toko / Outlet</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Contoh: Kopi Kenangan Jaya" 
                    className="h-12 rounded-2xl"
                    required 
                    autoFocus
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address" className="px-1 text-xs font-bold text-muted-foreground uppercase tracking-widest">Alamat Lengkap</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Jl. Merdeka No. 123" 
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>
              
              <div className="pt-4 space-y-3 text-center">
                 <Button type="submit" className="w-full h-12 font-black text-lg rounded-2xl shadow-xl shadow-primary/20" disabled={isLoading || !formData.name}>
                   {isLoading ? <IconLoader2 className="h-6 w-6 animate-spin" /> : "Konfirmasi & Mulai"}
                 </Button>
                 <p className="text-[10px] text-muted-foreground italic px-4">
                    Dengan klik Konfirmasi, fitur <span className="font-bold text-primary italic uppercase tracking-tighter">{model}</span> akan langsung disiapkan untuk anda.
                 </p>
              </div>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
