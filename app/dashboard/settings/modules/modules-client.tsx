"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  IconArmchair, 
  IconCalendar, 
  IconToolsKitchen2, 
  IconTag, 
  IconBuildingStore,
  IconClick,
  IconReceipt2,
  IconFlame,
  IconSettings
} from "@tabler/icons-react"
import { updateStoreSettings } from "@/lib/store-actions"

interface ModuleSettingsClientProps {
  storeId: string
  initialSettings: any
}

export default function ModuleSettingsClient({ storeId, initialSettings }: ModuleSettingsClientProps) {
  const [saving, setSaving] = useState(false)
  const [storeSettings, setStoreSettings] = useState<any>(initialSettings)

  async function handleToggle(category: string, key: string, value: boolean) {
    const newSettings = { ...storeSettings }
    // Ensure nested objects exist
    if (!newSettings[category]) newSettings[category] = {}
    newSettings[category][key] = value
    setStoreSettings(newSettings)
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const res = await updateStoreSettings(storeId, storeSettings)
      if (res?.error) throw new Error(res.error)

      toast.success("Pengaturan modul berhasil diperbarui")
      // Force refresh to update sidebar and other layout elements
      window.location.reload()
    } catch (error: any) {
      toast.error("Gagal menyimpan: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  const applyPreset = (model: string) => {
    let preset = JSON.parse(JSON.stringify(storeSettings)) // Deep clone
    
    if (model === "restaurant") {
      preset.features = { tables: true, reservations: true, kds: true, promotions: true, customers: true }
      preset.operational.business_model = "restaurant"
    } else if (model === "retail") {
      preset.features = { tables: false, reservations: false, kds: false, promotions: true, customers: true }
      preset.operational.business_model = "retail"
    } else if (model === "coffee") {
      preset.features = { tables: false, reservations: false, kds: true, promotions: true, customers: true }
      preset.operational.business_model = "coffee"
    }

    setStoreSettings(preset)
    toast.info(`Template ${model} diterapkan. Jangan lupa klik Simpan.`)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Modul & Fitur Toko</h1>
        <p className="text-muted-foreground">Sesuaikan antarmuka POS Anda berdasarkan model bisnis Anda.</p>
      </div>

      {/* Preset Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2 rounded-2xl" onClick={() => applyPreset("restaurant")}>
          <IconToolsKitchen2 className="size-6 text-primary" />
          <div className="text-xs">Restoran</div>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2 rounded-2xl" onClick={() => applyPreset("retail")}>
          <IconBuildingStore className="size-6 text-blue-500" />
          <div className="text-xs">Toko Ritel</div>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2 rounded-2xl" onClick={() => applyPreset("coffee")}>
          <IconFlame className="size-6 text-orange-500" />
          <div className="text-xs">Kedai Kopi</div>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2 rounded-2xl" onClick={() => applyPreset("custom")}>
          <IconSettings className="size-6 text-muted-foreground" />
          <div className="text-xs">Kustom</div>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Features */}
        <Card className="rounded-[2rem] border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle>Fitur Operasional</CardTitle>
            <CardDescription>Aktifkan modul yang Anda butuhkan di harian.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-2xl border">
              <div className="flex items-center gap-3">
                <IconArmchair className="size-5 text-primary" />
                <div className="space-y-0.5">
                  <Label>Manajemen Meja</Label>
                  <p className="text-[10px] text-muted-foreground">Gunakan sistem Dine-in / Meja.</p>
                </div>
              </div>
              <Switch 
                checked={!!storeSettings.features?.tables} 
                onCheckedChange={(val) => handleToggle("features", "tables", val)} 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-2xl border">
              <div className="flex items-center gap-3">
                <IconCalendar className="size-5 text-primary" />
                <div className="space-y-0.5">
                  <Label>Sistem Reservasi</Label>
                  <p className="text-[10px] text-muted-foreground">Catat pesanan tempat pelanggan.</p>
                </div>
              </div>
              <Switch 
                checked={!!storeSettings.features?.reservations} 
                onCheckedChange={(val) => handleToggle("features", "reservations", val)} 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-2xl border">
              <div className="flex items-center gap-3">
                <IconToolsKitchen2 className="size-5 text-primary" />
                <div className="space-y-0.5">
                  <Label>Kitchen Display (KDS)</Label>
                  <p className="text-[10px] text-muted-foreground">Tampilan digital untuk bagian dapur.</p>
                </div>
              </div>
              <Switch 
                checked={!!storeSettings.features?.kds} 
                onCheckedChange={(val) => handleToggle("features", "kds", val)} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card className="rounded-[2rem] border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle>Pajak & Layanan</CardTitle>
            <CardDescription>Atur otomatisasi finansial pada setiap struk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-2xl border">
              <div className="flex items-center gap-3">
                <IconReceipt2 className="size-5 text-orange-500" />
                <div className="space-y-0.5">
                  <Label>Aktifkan Pajak (Tax)</Label>
                  <p className="text-[10px] text-muted-foreground">Hitung pajak otomatis di kasir.</p>
                </div>
              </div>
              <Switch 
                checked={!!storeSettings.financial?.tax_enabled} 
                onCheckedChange={(val) => handleToggle("financial", "tax_enabled", val)} 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-2xl border">
              <div className="flex items-center gap-3">
                <IconClick className="size-5 text-blue-500" />
                <div className="space-y-0.5">
                  <Label>Biaya Layanan (Service)</Label>
                  <p className="text-[10px] text-muted-foreground">Biaya tambahan per transaksi.</p>
                </div>
              </div>
              <Switch 
                checked={!!storeSettings.financial?.service_charge_enabled} 
                onCheckedChange={(val) => handleToggle("financial", "service_charge_enabled", val)} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          size="lg" 
          className="rounded-2xl px-12 font-bold" 
          onClick={saveSettings} 
          disabled={saving}
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  )
}
