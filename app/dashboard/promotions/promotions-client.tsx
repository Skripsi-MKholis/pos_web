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
  IconTrash,
  IconDotsVertical,
  IconEdit,
  IconPower
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
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
import { 
  createDiscount, 
  createVoucher, 
  updateDiscount, 
  deleteDiscount, 
  toggleDiscount,
  updateVoucher,
  deleteVoucher,
  toggleVoucher
} from "@/lib/promotion-actions"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { cn, formatCurrency } from "@/lib/utils"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

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
  
  const [editingVoucher, setEditingVoucher] = React.useState<any>(null)
  const [editingDiscount, setEditingDiscount] = React.useState<any>(null)
  
  const [deletingDiscountId, setDeletingDiscountId] = React.useState<string | null>(null)
  const [deletingVoucherId, setDeletingVoucherId] = React.useState<string | null>(null)
  
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

  const handleUpdateDiscount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingDiscount) return
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as "percentage" | "fixed",
      value: Number(formData.get("value")),
      start_date: formData.get("start_date") ? new Date(formData.get("start_date") as string).toISOString() : null,
      end_date: formData.get("end_date") ? new Date(formData.get("end_date") as string).toISOString() : null,
    }

    const res = await updateDiscount(editingDiscount.id, data)
    if (res.success) {
      toast.success("Diskon diperbarui")
      setEditingDiscount(null)
      window.location.reload()
    } else {
      toast.error(res.error || "Gagal memperbarui diskon")
    }
    setIsLoading(false)
  }

  const handleUpdateVoucher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingVoucher) return
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const data = {
      code: formData.get("code") as string,
      type: formData.get("type") as "percentage" | "fixed",
      value: Number(formData.get("value")),
      min_purchase: Number(formData.get("min_purchase") || 0),
      max_discount: formData.get("max_discount") ? Number(formData.get("max_discount")) : null,
      usage_limit: formData.get("usage_limit") ? Number(formData.get("usage_limit")) : null,
      expires_at: formData.get("expires_at") ? new Date(formData.get("expires_at") as string).toISOString() : null,
    }

    const res = await updateVoucher(editingVoucher.id, data)
    if (res.success) {
      toast.success("Voucher diperbarui")
      setEditingVoucher(null)
      window.location.reload()
    } else {
      toast.error(res.error || "Gagal memperbarui voucher")
    }
    setIsLoading(false)
  }

  const confirmDeleteDiscount = async () => {
    if (!deletingDiscountId) return
    setIsLoading(true)
    const res = await deleteDiscount(deletingDiscountId)
    setIsLoading(false)
    if (res.success) {
      toast.success("Diskon dihapus")
      window.location.reload()
    } else {
      setDeletingDiscountId(null)
    }
  }

  const confirmDeleteVoucher = async () => {
    if (!deletingVoucherId) return
    setIsLoading(true)
    const res = await deleteVoucher(deletingVoucherId)
    setIsLoading(false)
    if (res.success) {
      toast.success("Voucher dihapus")
      window.location.reload()
    } else {
      setDeletingVoucherId(null)
    }
  }

  const handleToggleDiscount = async (id: string, current: boolean) => {
    const res = await toggleDiscount(id, current)
    if (res.success) {
      toast.success(current ? "Diskon dinonaktifkan" : "Diskon diaktifkan")
      window.location.reload()
    }
  }

  const handleToggleVoucher = async (id: string, current: boolean) => {
    const res = await toggleVoucher(id, current)
    if (res.success) {
      toast.success(current ? "Voucher dinonaktifkan" : "Voucher diaktifkan")
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
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
                          <span className="text-xl font-bold">Rp {formatCurrency(v.value)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-4 relative">
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <IconDotsVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 border-none shadow-xl rounded-xl p-2 bg-background/95 backdrop-blur-md">
                          <DropdownMenuItem onClick={() => setEditingVoucher(v)} className="rounded-lg gap-2 cursor-pointer">
                            <IconEdit size={14} className="text-muted-foreground" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleVoucher(v.id, v.is_active)} className="rounded-lg gap-2 cursor-pointer text-blue-600">
                            <IconPower size={14} />
                            <span>{v.is_active ? "Nonaktifkan" : "Aktifkan"}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="opacity-10" />
                          <DropdownMenuItem onClick={() => setDeletingVoucherId(v.id)} className="rounded-lg gap-2 cursor-pointer text-destructive focus:bg-destructive/10">
                            <IconTrash size={14} />
                            <span>Hapus</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <h4 className={cn("text-xl font-black tracking-tighter", v.is_active ? "text-primary" : "text-muted-foreground")}>
                           {v.code}
                         </h4>
                         {!v.is_active && <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">NONAKTIF</span>}
                      </div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                         Min. Belanja: Rp {formatCurrency(v.min_purchase)}
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
                       <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                             {d.is_active ? 'AKTIF' : 'NONAKTIF'}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <IconDotsVertical size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 border-none shadow-xl rounded-xl p-2 bg-background/95 backdrop-blur-md">
                              <DropdownMenuItem onClick={() => setEditingDiscount(d)} className="rounded-lg gap-2 cursor-pointer text-sm">
                                <IconEdit size={14} />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleDiscount(d.id, d.is_active)} className="rounded-lg gap-2 cursor-pointer text-sm text-blue-600">
                                <IconPower size={14} />
                                <span>{d.is_active ? "Nonaktifkan" : "Aktifkan"}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="opacity-10" />
                              <DropdownMenuItem onClick={() => setDeletingDiscountId(d.id)} className="rounded-lg gap-2 cursor-pointer text-sm text-destructive focus:bg-destructive/10">
                                <IconTrash size={14} />
                                <span>Hapus</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                    </div>
                    <div className="p-6 space-y-4">
                       <div className={cn("text-3xl font-black", d.is_active ? "text-primary" : "text-muted-foreground")}>
                          {d.type === 'percentage' ? `${d.value}%` : `Rp ${formatCurrency(d.value)}`}
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

      <Dialog open={!!editingVoucher} onOpenChange={(open) => !open && setEditingVoucher(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Voucher</DialogTitle>
          </DialogHeader>
          {editingVoucher && (
            <form onSubmit={handleUpdateVoucher} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-code">Kode Voucher</Label>
                <Input id="edit-code" name="code" defaultValue={editingVoucher.code} required className="h-11 uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-v-type">Tipe</Label>
                  <Select name="type" defaultValue={editingVoucher.type}>
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
                  <Label htmlFor="edit-v-value">Nilai</Label>
                  <Input id="edit-v-value" name="value" type="number" defaultValue={editingVoucher.value} required className="h-11" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-v-min">Min. Belanja (Rp)</Label>
                  <Input id="edit-v-min" name="min_purchase" type="number" defaultValue={editingVoucher.min_purchase} className="h-11" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-v-expires">Kadaluarsa</Label>
                  <Input 
                    id="edit-v-expires" 
                    name="expires_at" 
                    type="date" 
                    defaultValue={editingVoucher.expires_at ? format(new Date(editingVoucher.expires_at), "yyyy-MM-dd") : ""} 
                    className="h-11" 
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-11 font-bold" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Update Voucher"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingDiscount} onOpenChange={(open) => !open && setEditingDiscount(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Diskon Toko</DialogTitle>
          </DialogHeader>
          {editingDiscount && (
            <form onSubmit={handleUpdateDiscount} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-d-name">Nama Diskon</Label>
                <Input id="edit-d-name" name="name" defaultValue={editingDiscount.name} required className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-d-type">Tipe</Label>
                  <Select name="type" defaultValue={editingDiscount.type}>
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
                  <Label htmlFor="edit-d-value">Nilai</Label>
                  <Input id="edit-d-value" name="value" type="number" defaultValue={editingDiscount.value} required className="h-11" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                  <Label htmlFor="edit-d-start">Mulai</Label>
                  <Input 
                    id="edit-d-start" 
                    name="start_date" 
                    type="date" 
                    defaultValue={editingDiscount.start_date ? format(new Date(editingDiscount.start_date), "yyyy-MM-dd") : ""} 
                    className="h-11" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-d-end">Berakhir</Label>
                  <Input 
                    id="edit-d-end" 
                    name="end_date" 
                    type="date" 
                    defaultValue={editingDiscount.end_date ? format(new Date(editingDiscount.end_date), "yyyy-MM-dd") : ""} 
                    className="h-11" 
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-11 font-bold" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Update Diskon"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingDiscountId}
        onOpenChange={(open) => !open && setDeletingDiscountId(null)}
        title="Hapus Diskon Toko"
        description="Apakah Anda yakin ingin menghapus diskon ini? Semua pesanan di masa depan tidak akan bisa menggunakan diskon ini lagi."
        onConfirm={confirmDeleteDiscount}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={!!deletingVoucherId}
        onOpenChange={(open) => !open && setDeletingVoucherId(null)}
        title="Hapus Voucher"
        description="Apakah Anda yakin ingin menghapus voucher ini? Voucher yang dihapus tidak dapat digunakan lagi oleh pelanggan."
        onConfirm={confirmDeleteVoucher}
        isLoading={isLoading}
      />
    </div>
  )
}
