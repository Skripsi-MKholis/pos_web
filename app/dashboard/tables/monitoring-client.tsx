"use client"

import * as React from "react"
import { 
  IconArmchair, 
  IconUsers, 
  IconClock, 
  IconReceipt,
  IconPlus,
  IconChevronRight,
  IconCheck,
  IconCurrencyDollar
} from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TransactionPayload, splitTransaction } from "@/lib/transaction-actions"
import { Checkbox } from "@/components/ui/checkbox"

export function TablesMonitoringClient({ 
  initialTables, 
  storeId 
}: { 
  initialTables: any[]
  storeId: string
}) {
  const [selectedTable, setSelectedTable] = React.useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isSplitOpen, setIsSplitOpen] = React.useState(false)
  const [splitItems, setSplitItems] = React.useState<Record<string, number>>({})
  const [paymentMethod, setPaymentMethod] = React.useState("Tunai")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const router = useRouter()

  const handleTableClick = (table: any) => {
    setSelectedTable(table)
    setIsDetailOpen(true)
  }

  // Get active transaction (status Pending)
  const activeTx = selectedTable?.transactions?.[0]

  const handleSplitBill = async () => {
    if (!activeTx) return
    
    // Prepare items to pay
    const paidItems = activeTx.transaction_items
      .filter((item: any) => (splitItems[item.id] || 0) > 0)
      .map((item: any) => ({
        product_id: item.product_id,
        quantity: splitItems[item.id],
        unit_price: item.unit_price
      }))

    if (paidItems.length === 0) {
      toast.error("Pilih menu yang ingin dibayar!")
      return
    }

    setIsProcessing(true)
    try {
      const res = await splitTransaction({
        originalTransactionId: activeTx.id,
        paidItems,
        paymentMethod,
        storeId
      })

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Pembayaran terpisah berhasil!")
        setIsSplitOpen(false)
        setIsDetailOpen(false)
        setSplitItems({})
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleSplitItem = (itemId: string, maxQty: number) => {
    setSplitItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) >= maxQty ? 0 : maxQty
    }))
  }

  const splitTotal = activeTx?.transaction_items.reduce((acc: number, item: any) => {
    return acc + (item.unit_price * (splitItems[item.id] || 0))
  }, 0) || 0

  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="flex gap-6 p-4 bg-card/50 rounded-2xl border border-dashed">
         <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted border" />
            <span className="text-xs font-bold text-muted-foreground uppercase">Tersedia</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            <span className="text-xs font-bold text-muted-foreground uppercase">Terisi (Open Bill)</span>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {initialTables.map((table) => {
          const isOccupied = table.status === 'occupied'
          const tx = table.transactions?.[0]
          
          return (
            <button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={cn(
                "group relative aspect-square rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center justify-center gap-2 overflow-hidden",
                isOccupied 
                  ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 scale-105 z-10" 
                  : "bg-background hover:border-primary/50 text-muted-foreground border-dashed"
              )}
            >
              <IconArmchair size={isOccupied ? 48 : 32} className={cn("transition-transform group-hover:scale-110", isOccupied && "animate-pulse")} />
              <div className="text-center">
                <p className="font-black text-lg uppercase leading-none">{table.name}</p>
                <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-tighter">Cap: {table.capacity}</p>
              </div>

              {isOccupied && tx && (
                <div className="absolute inset-x-0 bottom-0 bg-black/10 py-2 px-3 text-[10px] font-bold flex flex-col items-center">
                   <p>Rp {formatCurrency(tx.total_amount)}</p>
                   <p className="opacity-70 mt-0.5">{formatDistanceToNow(new Date(tx.created_at), { addSuffix: true, locale: id })}</p>
                </div>
              )}

              {!isOccupied && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-muted-foreground/20" />
              )}
            </button>
          )
        })}
      </div>

      {initialTables.length === 0 && (
         <div className="py-20 text-center border-2 border-dashed rounded-[3rem] bg-muted/20">
            <IconArmchair size={64} className="mx-auto mb-4 opacity-10" />
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Belum Ada Meja Terdaftar</p>
            <Button variant="link" onClick={() => router.push("/dashboard/settings/tables")}>Atur Meja Sekarang</Button>
         </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0">
          <div className={cn(
            "p-8 text-white",
            selectedTable?.status === 'occupied' ? "bg-primary" : "bg-muted text-muted-foreground"
          )}>
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <h2 className="text-4xl font-black uppercase leading-none">{selectedTable?.name}</h2>
                  <p className="flex items-center gap-2 text-xs font-bold opacity-80 uppercase tracking-widest">
                     <IconUsers size={14} /> Kapasitas {selectedTable?.capacity} Orang
                  </p>
               </div>
               {selectedTable?.status === 'occupied' && (
                  <Badge variant="outline" className="bg-white/20 text-white border-white/20 uppercase font-black tracking-tighter px-3 py-1">Active Order</Badge>
               )}
            </div>
          </div>

          <div className="p-8 space-y-6 bg-background">
            {activeTx ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <span>Daftar Pesanan</span>
                    <span>{activeTx.transaction_items.length} Menu</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                    {activeTx.transaction_items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center group">
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm uppercase">{item.product_name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {item.quantity} x Rp {formatCurrency(item.unit_price)}
                          </p>
                        </div>
                        <p className="font-black text-sm">Rp {formatCurrency(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Tagihan</p>
                      <p className="text-3xl font-black text-primary leading-none">Rp {formatCurrency(activeTx.total_amount)}</p>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase">
                         <IconClock size={12} /> {formatDistanceToNow(new Date(activeTx.created_at), { addSuffix: true, locale: id })}
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                   <Button 
                     variant="outline" 
                     className="rounded-2xl h-14 font-black uppercase text-xs gap-2 border-2 hover:bg-muted"
                     onClick={() => {
                        // Redirect to cashier with special flag or session?
                        // For now, simple redirect
                        router.push(`/dashboard/cashier?table=${selectedTable.id}`)
                     }}
                   >
                     <IconPlus size={18} /> Tambah
                   </Button>
                   <Button 
                     className="rounded-2xl h-14 font-black uppercase text-xs gap-2 shadow-xl shadow-primary/20"
                     disabled={isProcessing}
                     onClick={async () => {
                        if (!activeTx) return
                        setIsProcessing(true)
                        try {
                          const res = await splitTransaction({
                            originalTransactionId: activeTx.id,
                            paidItems: activeTx.transaction_items.map((item: any) => ({
                              product_id: item.product_id,
                              quantity: item.quantity,
                              unit_price: item.unit_price
                            })),
                            paymentMethod: "Tunai",
                            storeId
                          })
                          if (res.error) toast.error(res.error)
                          else {
                            toast.success("Pembayaran meja berhasil diselesaikan!")
                            setIsDetailOpen(false)
                          }
                        } catch (err) {
                          toast.error("Gagal memproses pembayaran")
                        } finally {
                          setIsProcessing(false)
                        }
                     }}
                   >
                     {isProcessing ? "..." : <><IconReceipt size={18} /> Bayar Semua</>}
                   </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full rounded-xl text-xs font-bold text-muted-foreground border border-dashed hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                  onClick={() => setIsSplitOpen(true)}
                >
                  <IconCurrencyDollar size={16} className="mr-2" /> Bayar Terpisah (Split Bill)
                </Button>
              </>
            ) : (
              <div className="py-12 text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center text-muted-foreground/20">
                   <IconArmchair size={40} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Meja Ini Sedang Kosong</p>
                  <p className="text-[10px] text-muted-foreground">Silakan pilih meja ini di menu Kasir untuk membuat pesanan baru.</p>
                </div>
                <Button 
                  className="w-full rounded-2xl h-14 font-black uppercase text-xs shadow-lg"
                  onClick={() => {
                    router.push(`/dashboard/cashier?table=${selectedTable.id}`)
                  }}
                >
                  Buat Pesanan Baru <IconChevronRight size={18} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Split Bill Dialog */}
      <Dialog open={isSplitOpen} onOpenChange={setIsSplitOpen}>
        <DialogContent className="sm:max-w-lg rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
           <div className="bg-primary p-8 text-white">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Bayar Terpisah</DialogTitle>
              <DialogDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest mt-1">
                Pilih menu dari {selectedTable?.name} yang ingin dibayar sekarang
              </DialogDescription>
           </div>

           <div className="p-8 space-y-6 bg-background">
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                {activeTx?.transaction_items.map((item: any) => {
                  const isSelected = (splitItems[item.id] || 0) > 0
                  return (
                    <div 
                      key={item.id} 
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                        isSelected ? "border-primary bg-primary/5" : "border-muted hover:border-primary/20"
                      )}
                      onClick={() => toggleSplitItem(item.id, item.quantity)}
                    >
                      <div className={cn(
                        "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-colors",
                        isSelected ? "bg-primary border-primary text-white" : "border-muted-foreground/20"
                      )}>
                        {isSelected && <IconCheck size={14} strokeWidth={4} />}
                      </div>
                      <div className="flex-1">
                         <p className="font-bold uppercase text-sm">{item.product_name}</p>
                         <p className="text-[10px] text-muted-foreground font-black">
                            {item.quantity} x Rp {formatCurrency(item.unit_price)}
                         </p>
                      </div>
                      <div className="text-right">
                         <p className="font-black text-sm text-primary">Rp {formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-4 p-6 bg-muted/30 rounded-[2rem]">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Metode Bayar</span>
                    <select 
                      className="bg-transparent text-sm font-black uppercase tracking-tighter focus:outline-none"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option>Tunai</option>
                      <option>QRIS</option>
                      <option>Transfer</option>
                    </select>
                 </div>
                 <Separator className="bg-background" />
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Bayar</span>
                    <span className="text-3xl font-black text-primary leading-none">Rp {formatCurrency(splitTotal)}</span>
                 </div>
              </div>

              <DialogFooter className="gap-3 sm:gap-0">
                 <Button variant="ghost" className="rounded-xl font-bold uppercase text-xs" onClick={() => setIsSplitOpen(false)}>Batal</Button>
                 <Button 
                  className="flex-1 rounded-2xl h-14 font-black uppercase text-xs shadow-xl shadow-primary/20"
                  disabled={splitTotal === 0 || isProcessing}
                  onClick={handleSplitBill}
                 >
                   {isProcessing ? "Memproses..." : "Konfirmasi Pembayaran"}
                 </Button>
              </DialogFooter>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
