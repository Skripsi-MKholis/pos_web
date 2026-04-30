"use client"

import * as React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { updateSubscriptionPlan } from "@/lib/admin-actions"

export function EditPlanDialog({ 
  plan, 
  open, 
  onOpenChange 
}: { 
  plan: any, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    price: plan.price,
    max_outlets: plan.max_outlets,
    max_transactions: plan.max_transactions,
    features: { ...plan.features }
  })

  const handleSave = async () => {
    setIsLoading(true)
    const result = await updateSubscriptionPlan(plan.id, formData)
    setIsLoading(false)

    if (result.success) {
      toast.success("Konfigurasi paket berhasil diperbarui")
      onOpenChange(false)
    } else {
      toast.error(result.error || "Gagal memperbarui paket")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Edit Paket: {plan.name}</DialogTitle>
          <DialogDescription>Sesuaikan harga dan limitasi fitur untuk paket ini.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Harga Bulanan (Rp)</Label>
            <Input 
              id="price" 
              type="number" 
              value={formData.price} 
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="rounded-xl bg-muted/50 border-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="outlets">Max Outlets</Label>
              <Input 
                id="outlets" 
                type="number" 
                value={formData.max_outlets} 
                onChange={(e) => setFormData({ ...formData, max_outlets: Number(e.target.value) })}
                className="rounded-xl bg-muted/50 border-none"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tx">Max Transaksi</Label>
              <Input 
                id="tx" 
                type="number" 
                value={formData.max_transactions} 
                onChange={(e) => setFormData({ ...formData, max_transactions: Number(e.target.value) })}
                className="rounded-xl bg-muted/50 border-none"
              />
              <p className="text-[10px] text-muted-foreground">0 = Unlimited</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Akses Fitur</Label>
            <div className="space-y-3">
              {Object.keys(formData.features).map((feature) => (
                <div key={feature} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30">
                  <span className="text-sm font-bold capitalize">{feature.replace(/_/g, ' ')}</span>
                  <Switch 
                    checked={formData.features[feature]} 
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      features: { ...formData.features, [feature]: checked }
                    })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Batal</Button>
          <Button onClick={handleSave} disabled={isLoading} className="rounded-xl px-8 shadow-lg shadow-primary/20">
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
