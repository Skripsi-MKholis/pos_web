"use client"

import * as React from "react"
import { 
  IconPlus, 
  IconTicket, 
  IconTag, 
  IconCalendar, 
  IconCheck, 
  IconX,
  IconPercentage,
  IconReceipt2,
  IconAlertCircle,
  IconTrash
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { createDiscount, createVoucher } from "@/lib/promotion-actions"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function PromotionsClient({ 
  storeId, 
  initialDiscounts, 
  initialVouchers 
}: { 
  storeId: string, 
  initialDiscounts: any[], 
  initialVouchers: any[] 
}) {
  const [discounts, setDiscounts] = React.useState(initialDiscounts)
  const [vouchers, setVouchers] = React.useState(initialVouchers)
  const [isAddingDiscount, setIsAddingDiscount] = React.useState(false)
  const [isAddingVoucher, setIsAddingVoucher] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleAddDiscount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      store_id: storeId,
      name: formData.get("name") as string,
      type: formData.get("type") as "percentage" | "fixed",
      value: Number(formData.get("value")),
      start_date: formData.get("start_date") ? new Date(formData.get("start_date") as string).toISOString() : undefined,
      end_date: formData.get("end_date") ? new Date(formData.get("end_date") as string).toISOString() : undefined,
    }

    const res = await createDiscount(data)
    if (res.success) {
      toast.success("Diskon berhasil dibuat")
      setIsAddingDiscount(false)
      // Refresh logic would ideally re-fetch or revalidate
      window.location.reload()
    } else {
      toast.error(res.error || "Gagal membuat diskon")
    }
    setIsLoading(false)
  }

  const handleAddVoucher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      store_id: storeId,
      code: formData.get("code") as string,
      type: formData.get("type") as "percentage" | "fixed",
      value: Number(formData.get("value")),
      min_purchase: Number(formData.get("min_purchase") || 0),
      max_discount: formData.get("max_discount") ? Number(formData.get("max_discount")) : undefined,
      usage_limit: formData.get("usage_limit") ? Number(formData.get("usage_limit")) : undefined,
      expires_at: formData.get("expires_at") ? new Date(formData.get("expires_at") as string).toISOString() : undefined,
    }

    const res = await createVoucher(data)
    if (res.success) {
      toast.success("Voucher berhasil dibuat")
      setIsAddingVoucher(false)
      window.location.reload()
    } else {
      toast.error(res.error || "Gagal membuat voucher")
    }
    setIsLoading(false)
  }

  return (
    <Tabs defaultValue="vouchers" className="w-full space-y-6">
      <div className="flex items-center justify-between bg-background p-1 rounded-xl border w-fit">
        <TabsList className="bg-transparent border-none">
          <TabsTrigger value="vouchers" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
             <IconTicket size={16} className="mr-2" />
             Voucher Belanja
          </TabsTrigger>
          <TabsTrigger value="discounts" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
             <IconTag size={16} className="mr-2" />
             Diskon Toko
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="vouchers" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Daftar Voucher</h3>
            <p className="text-sm text-muted-foreground">Pelanggan bisa memasukkan kode ini saat checkout.</p>
          </div>
          <Dialog open={isAddingVoucher} onOpenChange={setIsAddingVoucher}>
            <DialogTrigger asChild>
              <Button className="font-bold gap-2 rounded-xl h-11">
                <IconPlus size={18} />
                Buat Voucher Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Buat Voucher Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddVoucher} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Kode Voucher (Kapital)</Label>
                  <Input id="code" name="code" placeholder="CONTOH: PROMOHEMAT" required className="h-11 uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipe Potongan</Label>
                    <Select name="type" defaultValue="percentage">
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Persentase (%)</SelectItem>
                        <SelectItem value="fixed">Nominal Tetap (Rp)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="value">Nilai Potongan</Label>
                    <Input id="value" name="value" type="number" placeholder="10 / 5000" required className="h-11" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="min_purchase">Minimal Belanja (Rp)</Label>
                    <Input id="min_purchase" name="min_purchase" type="number" defaultValue="0" className="h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expires_at">Tanggal Kadaluarsa</Label>
                    <Input id="expires_at" name="expires_at" type="date" className="h-11" />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full h-11 font-bold" disabled={isLoading}>
                    {isLoading ? "Menyimpan..." : "Simpan Voucher"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {vouchers.map((v) => (
              <motion.div
                key={v.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative overflow-hidden bg-card border-2 border-dashed border-muted-foreground/20 rounded-2xl flex"
              >
                <div className="w-1/3 bg-primary/10 flex flex-col items-center justify-center p-4 border-r border-dashed border-muted-foreground/30 relative">
                  {/* Decorative Ornaments */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-background border-2 border-muted-foreground/20" />
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-background border-2 border-muted-foreground/20" />
                  
                  <div className="text-secondary-foreground flex flex-col items-center">
                    {v.type === "percentage" ? (
                      <>
                        <span className="text-3xl font-black">{v.value}</span>
                        <span className="text-xs font-bold uppercase tracking-widest">% OFF</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-bold uppercase">Potongan</span>
                        <span className="text-xl font-bold">Rp {v.value.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-black tracking-tighter text-primary">{v.code}</h4>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                       Min. Belanja: Rp {v.min_purchase.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-1 text-[10px] font-medium opacity-60">
                      <IconCalendar size={12} />
                      {v.expires_at ? format(new Date(v.expires_at), "dd MMM yyyy") : "Tanpa Batas"}
                    </div>
                    <div className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded uppercase">
                      {v.used_count} Terpakai
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {vouchers.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground space-y-4 border-2 border-dashed rounded-2xl">
               <IconTicket size={48} className="opacity-10" />
               <p className="text-sm font-medium">Belum ada voucher aktif</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="discounts" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Diskon Toko</h3>
            <p className="text-sm text-muted-foreground">Potongan harga otomatis yang berlaku di toko.</p>
          </div>
          <Dialog open={isAddingDiscount} onOpenChange={setIsAddingDiscount}>
            <DialogTrigger asChild>
              <Button className="font-bold gap-2 rounded-xl h-11">
                <IconPlus size={18} />
                Tambah Diskon Toko
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Tambah Diskon Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDiscount} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Diskon</Label>
                  <Input id="name" name="name" placeholder="Misal: Diskon Gajian" required className="h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipe Diskon</Label>
                    <Select name="type" defaultValue="percentage">
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Persentase (%)</SelectItem>
                        <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="value">Nilai</Label>
                    <Input id="value" name="value" type="number" placeholder="10" required className="h-11" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="grid gap-2">
                    <Label htmlFor="start_date">Mulai</Label>
                    <Input id="start_date" name="start_date" type="date" className="h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end_date">Berakhir</Label>
                    <Input id="end_date" name="end_date" type="date" className="h-11" />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full h-11 font-bold" disabled={isLoading}>
                    {isLoading ? "Menyimpan..." : "Aktifkan Diskon"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discounts.map((d) => (
             <Card key={d.id} className="overflow-hidden border-2 hover:border-primary/40 transition-all group">
                <CardContent className="p-0">
                  <div className="p-4 bg-muted/30 border-b flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                           {d.type === 'percentage' ? <IconPercentage size={18} /> : <IconReceipt2 size={18} />}
                        </div>
                        <span className="font-bold text-sm">{d.name}</span>
                     </div>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                        {d.is_active ? 'AKTIF' : 'NONAKTIF'}
                     </span>
                  </div>
                  <div className="p-6 space-y-4">
                     <div className="text-3xl font-black text-primary">
                        {d.type === 'percentage' ? `${d.value}%` : `Rp ${d.value.toLocaleString()}`}
                     </div>
                     <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-1">
                           <IconCalendar size={14} />
                           {d.start_date ? format(new Date(d.start_date), "dd/MM") : 'Anytime'} - {d.end_date ? format(new Date(d.end_date), "dd/MM") : 'Forever'}
                        </div>
                     </div>
                  </div>
                </CardContent>
             </Card>
          ))}
          {discounts.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground space-y-4 border-2 border-dashed rounded-2xl">
               <IconTag size={48} className="opacity-10" />
               <p className="text-sm font-medium">Belum ada diskon aktif</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
