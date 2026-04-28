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
  IconCurrencyDollar,
  IconPrinter,
  IconArrowsExchange,
  IconArrowRight,
  IconTrash
} from "@tabler/icons-react"
import { ReceiptPrint } from "@/components/receipt-print"
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
import { 
  TransactionPayload, 
  splitTransaction, 
  moveTransactionTable,
  clearTableOrders,
  completeFullTransaction
} from "@/lib/transaction-actions"
import { Checkbox } from "@/components/ui/checkbox"
import { GeneralPaymentModal } from "@/components/payment-modal"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export function TablesMonitoringClient({ 
  initialTables, 
  store 
}: { 
  initialTables: any[]
  store: any
}) {
  const [selectedTable, setSelectedTable] = React.useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isSplitOpen, setIsSplitOpen] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [printData, setPrintData] = React.useState<any>(null)
  const [isKitchenPrint, setIsKitchenPrint] = React.useState(false)
  const [isMoveOpen, setIsMoveOpen] = React.useState(false)
  const [isSelectAllMode, setIsSelectAllMode] = React.useState(false)
  const [targetTableId, setTargetTableId] = React.useState<string>("")
  const [isClearOrdersDialogOpen, setIsClearOrdersDialogOpen] = React.useState(false)
  const router = useRouter()

  const handleTableClick = (table: any) => {
    setSelectedTable(table)
    setIsDetailOpen(true)
  }

  // Get active transaction summary (Aggregating multiple pending transactions if they exist)
  const transactions = selectedTable?.transactions || []
  
  // Aggregate all items from all pending transactions
  const aggregatedItems = transactions.reduce((acc: any[], tx: any) => {
    return [...acc, ...tx.transaction_items]
  }, [])

  const totalAmount = transactions.reduce((acc: number, tx: any) => acc + Number(tx.total_amount), 0)
  const earliestCreatedAt = transactions.length > 0 
    ? transactions.reduce((min: string, tx: any) => tx.created_at < min ? tx.created_at : min, transactions[0].created_at)
    : null

  const activeTx = transactions[0] ? {
    ...transactions[0],
    total_amount: totalAmount,
    transaction_items: aggregatedItems,
    created_at: earliestCreatedAt
  } : null

  const handleMoveOrder = async () => {
    if (!activeTx || !targetTableId) return
    setIsProcessing(true)
    try {
      const results = await Promise.all(transactions.map((tx: any) => 
        moveTransactionTable(tx.id, selectedTable.id, targetTableId)
      ))
      
      const hasError = results.find(r => r.error)
      if (hasError) toast.error(hasError.error)
      else {
        toast.success(`Berhasil pindah ke meja ${initialTables.find(t => t.id === targetTableId)?.name}`)
        setIsMoveOpen(false)
        setIsDetailOpen(false)
        setTargetTableId("")
      }
    } catch (err) {
      toast.error("Gagal pindah meja")
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmClearOrders = async () => {
    if (!selectedTable) return
    setIsProcessing(true)
    try {
      const res = await clearTableOrders(selectedTable.id)
      if (res.error) toast.error(res.error)
      else {
        toast.success("Meja berhasil dikosongkan secara paksa")
        setIsDetailOpen(false)
        router.refresh()
      }
    } catch (err) {
      toast.error("Gagal mengosongkan meja")
    } finally {
      setIsProcessing(false)
      setIsClearOrdersDialogOpen(false)
    }
  }

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
          const txs = table.transactions || []
          const billTotal = txs.reduce((sum: number, t: any) => sum + Number(t.total_amount), 0)
          const oldestTx = txs.length > 0 ? txs.reduce((oldest: any, cur: any) => cur.created_at < oldest.created_at ? cur : oldest, txs[0]) : null
          
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
              <div className="text-center px-2">
                <p className="font-black text-lg uppercase leading-none">{table.name}</p>
                <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-tighter">Cap: {table.capacity}</p>
              </div>

              {isOccupied && oldestTx && (
                <div className="absolute inset-x-0 bottom-0 bg-black/10 py-2 px-3 text-[10px] font-bold flex flex-col items-center">
                   <p>Rp {formatCurrency(billTotal)}</p>
                   {txs.length > 1 && <p className="text-[8px] opacity-70 mb-0.5">{txs.length} Transaksi</p>}
                   <p className="opacity-70 mt-0.5 truncate w-full text-center">{formatDistanceToNow(new Date(oldestTx.created_at), { addSuffix: true, locale: id })}</p>
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
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0 flex flex-col h-[90vh] max-h-[90vh]">
          <div className={cn(
            "p-8 text-white shrink-0",
            selectedTable?.status === 'occupied' ? "bg-primary" : "bg-muted text-muted-foreground"
          )}>
            <div className="flex justify-between items-start">
               <div className="space-y-2">
                  <DialogTitle className="text-4xl font-black uppercase leading-none">{selectedTable?.name}</DialogTitle>
                  <p className="flex items-center gap-2 text-xs font-bold opacity-80 uppercase tracking-widest">
                     <IconUsers size={14} /> Kapasitas {selectedTable?.capacity} Orang
                  </p>
               </div>
               {selectedTable?.status === 'occupied' && (
                  <Badge variant="outline" className="bg-white/20 text-white border-white/20 uppercase font-black tracking-tighter px-3 py-1 text-[10px]">Active Order</Badge>
               )}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-background">
            <ScrollArea className="h-full w-full">
              <div className="p-8 space-y-8">
                {activeTx ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <span>Daftar Pesanan</span>
                        <span>{activeTx.transaction_items.length} Menu</span>
                      </div>
                      <div className="space-y-4 pr-1">
                         {activeTx.transaction_items.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-center group">
                            <div className="space-y-1">
                              <p className="font-bold text-sm uppercase">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground font-black">
                                {item.quantity} x Rp {formatCurrency(item.unit_price)}
                              </p>
                            </div>
                            <p className="font-black text-sm">Rp {formatCurrency(item.subtotal)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-muted/50" />

                    <div className="flex justify-between items-center bg-muted/30 p-6 rounded-[2rem] border-2 border-muted/50">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Tagihan</p>
                          <p className="text-3xl font-black text-primary leading-none tracking-tighter">Rp {formatCurrency(activeTx.total_amount)}</p>
                       </div>
                       <div className="flex flex-col items-end gap-1.5 pt-1">
                          <p className="text-[10px] font-black text-muted-foreground flex items-center gap-1.5 uppercase">
                             <IconClock size={12} className="text-primary" /> {formatDistanceToNow(new Date(activeTx.created_at), { addSuffix: true, locale: id })}
                          </p>
                       </div>
                    </div>

                    {/* PRIMARY ACTIONS */}
                     <div className="grid grid-cols-2 gap-4 pb-2">
                        <Button 
                          variant="outline" 
                          className="rounded-2xl h-14 font-black uppercase text-xs gap-2 border-2 hover:bg-muted transition-all active:scale-95"
                          onClick={() => {
                             router.push(`/dashboard/cashier?table=${selectedTable.id}`)
                          }}
                        >
                          <IconPlus size={20} /> Tambah Menu
                        </Button>
                        <Button 
                          className="rounded-2xl h-14 font-black uppercase text-xs gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
                          disabled={isProcessing}
                          onClick={() => {
                            setIsSelectAllMode(true)
                            setIsSplitOpen(true)
                          }}
                        >
                          <IconReceipt size={20} /> Bayar Semua
                        </Button>
                     </div>

                     {/* MANAGEMENT & PRINT GRID */}
                     <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="rounded-xl h-11 text-[10px] font-black uppercase text-muted-foreground border-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all"
                          onClick={() => {
                             setIsSelectAllMode(false)
                             setIsSplitOpen(true)
                          }}
                        >
                          <IconCurrencyDollar size={14} className="mr-2" /> Split Bill
                        </Button>
                        <Button 
                          variant="outline" 
                          className="rounded-xl h-11 text-[10px] font-black uppercase text-muted-foreground border-2 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all"
                          onClick={() => setIsMoveOpen(true)}
                        >
                          <IconArrowsExchange size={14} className="mr-2" /> Pindah Meja
                        </Button>
                        <Button 
                          variant="ghost"
                          className="rounded-xl h-11 font-black uppercase text-[10px] gap-2 text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                          onClick={() => {
                            setIsKitchenPrint(true)
                            setPrintData({
                              id: activeTx.id,
                              items: activeTx.transaction_items.map((it: any) => ({
                                name: it.product_name,
                                quantity: it.quantity,
                                price: it.unit_price,
                                notes: it.notes
                              }))
                            })
                            setTimeout(() => window.print(), 100)
                          }}
                        >
                          <IconPrinter size={16} /> Print Dapur
                        </Button>
                        <Button 
                          variant="ghost"
                          className="rounded-xl h-11 font-black uppercase text-[10px] gap-2 text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                          onClick={() => {
                            setIsKitchenPrint(false)
                            setPrintData({
                              id: activeTx.id,
                              total: activeTx.total_amount,
                              items: activeTx.transaction_items.map((it: any) => ({
                                name: it.product_name,
                                quantity: it.quantity,
                                price: it.unit_price
                              }))
                            })
                            setTimeout(() => window.print(), 100)
                          }}
                        >
                          <IconReceipt size={16} /> Print Tagihan
                        </Button>
                     </div>

                     <div className="pt-4">
                       <Button 
                          variant="ghost" 
                          className="w-full rounded-xl text-xs font-black uppercase text-destructive/50 hover:text-destructive hover:bg-destructive/5 h-12 transition-all border border-dashed border-destructive/20"
                          onClick={() => setIsClearOrdersDialogOpen(true)}
                          disabled={isProcessing}
                        >
                          <IconTrash size={16} className="mr-2" /> Paksa Kosongkan Meja
                        </Button>
                     </div>
                  </>
                ) : (
                  <div className="py-14 text-center space-y-6">
                    <div className="mx-auto w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center text-muted-foreground/30 shadow-inner">
                       <IconArmchair size={48} />
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-muted-foreground uppercase tracking-widest text-xs">Meja Ini Sedang Kosong</p>
                      <p className="text-xs text-muted-foreground px-8 font-medium">Buka menu Kasir untuk membuat pesanan baru pada meja ini.</p>
                    </div>
                    <Button 
                      className="w-full rounded-2xl h-16 font-black uppercase text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                      onClick={() => {
                        router.push(`/dashboard/cashier?table=${selectedTable.id}`)
                      }}
                    >
                      Buka Pesanan Baru <IconChevronRight size={20} className="ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* General Payment Modal */}
      <GeneralPaymentModal 
        isOpen={isSplitOpen}
        onClose={() => setIsSplitOpen(false)}
        activeTx={activeTx}
        store={store}
        userName="Kasir"
        onSuccess={() => {
          setIsDetailOpen(false)
          router.refresh()
        }}
        defaultSelectAll={isSelectAllMode}
      />

      {/* Move Table Dialog */}
      <Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl flex flex-col h-[90vh] max-h-[90vh]">
           <div className="bg-slate-950 p-8 text-white shrink-0">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">Pindah Meja</DialogTitle>
              <DialogDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest mt-1">
                Pindahkan pesanan {selectedTable?.name} ke meja baru
              </DialogDescription>
           </div>
           <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-background">
             <ScrollArea className="h-full w-full">
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     {initialTables.filter(t => t.status === 'available').map(table => (
                       <button
                         key={table.id}
                         onClick={() => setTargetTableId(table.id)}
                         className={cn(
                           "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1",
                           targetTableId === table.id 
                            ? "border-primary bg-primary/5 text-primary scale-105 shadow-lg" 
                            : "border-muted hover:border-primary/20 text-muted-foreground"
                         )}
                       >
                         <IconArmchair size={24} />
                         <span className="font-black text-sm uppercase">{table.name}</span>
                         <span className="text-[10px] font-bold opacity-60">Cap: {table.capacity}</span>
                       </button>
                     ))}
                  </div>

                  {initialTables.filter(t => t.status === 'available').length === 0 && (
                    <div className="py-8 text-center bg-muted/20 rounded-2xl border-2 border-dashed">
                      <p className="text-xs font-bold text-muted-foreground uppercase">Tidak ada meja tersedia</p>
                    </div>
                  )}
                </div>
             </ScrollArea>
           </div>
           <div className="p-8 bg-background border-t shrink-0">
              <DialogFooter className="gap-3 sm:gap-0">
                 <Button variant="ghost" className="rounded-xl font-bold uppercase text-xs w-full sm:w-auto" onClick={() => setIsMoveOpen(false)}>Batal</Button>
                 <Button 
                  className="flex-1 rounded-2xl h-14 font-black uppercase text-xs shadow-xl shadow-primary/20 gap-2 w-full sm:w-auto"
                  disabled={!targetTableId || isProcessing}
                  onClick={handleMoveOrder}
                 >
                   {isProcessing ? "Memproses..." : <><IconArrowRight size={18} /> Pindahkan Sekarang</>}
                 </Button>
              </DialogFooter>
           </div>
        </DialogContent>
      </Dialog>

      {/* Hidden Printing Area */}
      {printData && (
        <ReceiptPrint
          storeName={store.name}
          address={store.address}
          phone={store.phone}
          logoUrl={store.logo_url}
          transactionId={printData.id}
          cashierName="Kasir"
          items={printData.items}
          total={printData.total || 0}
          paymentMethod="Pending"
          tableName={selectedTable?.name}
          mode={isKitchenPrint ? "kitchen" : "invoice"}
        />
      )}

      <ConfirmDialog
        open={isClearOrdersDialogOpen}
        onOpenChange={setIsClearOrdersDialogOpen}
        title="Paksa Kosongkan Meja"
        description="PERINGATAN: Ini akan menghapus paksa seluruh pesanan yang belum dibayar di meja ini. Lanjutkan?"
        onConfirm={confirmClearOrders}
        isLoading={isProcessing}
      />
    </div>
  )
}
