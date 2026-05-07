"use client"

import * as React from "react"
import { 
  IconCheck, 
  IconCreditCard, 
  IconReceipt,
  IconLoader2,
  IconPrinter,
  IconWallet
} from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn, formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { splitTransaction, completeFullTransaction, createTransaction } from "@/lib/transaction-actions"
import posthog from "posthog-js"
import { ReceiptPrint } from "@/components/receipt-print"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  store: any
  userName: string
  onSuccess: () => void
  // Mode Settle (for existing pending tx)
  activeTx?: any
  defaultSelectAll?: boolean
  // Mode Create (for new cashier tx)
  mode?: "create" | "settle"
  cartItems?: any[]
  total?: number
  discountTotal?: number
  voucherInfo?: any
  tableId?: string
}

export function GeneralPaymentModal({
  isOpen,
  onClose,
  store,
  userName,
  onSuccess,
  activeTx,
  defaultSelectAll = false,
  mode = "settle",
  cartItems = [],
  total: propTotal = 0,
  discountTotal = 0,
  voucherInfo = null,
  tableId
}: PaymentModalProps) {
  const [splitItems, setSplitItems] = React.useState<Record<string, number>>({})
  const [paymentMethod, setPaymentMethod] = React.useState("Tunai")
  const [cashPaid, setCashPaid] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [transactionId, setTransactionId] = React.useState("")

  // Calculate totals based on mode
  const isSettle = mode === "settle"
  
  // For Settle mode, the total is based on selected split items
  const settleTotal = activeTx?.transaction_items.reduce((acc: number, item: any) => {
    return acc + (item.unit_price * (splitItems[item.id] || 0))
  }, 0) || 0

  const finalTotal = isSettle ? settleTotal : propTotal
  const changeAmount = parseFloat(cashPaid || "0") - finalTotal

  // Reset states when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setIsSuccess(false)
      setCashPaid("")
      setTransactionId("")
      if (isSettle && activeTx) {
        if (defaultSelectAll) {
          const allItems: Record<string, number> = {}
          activeTx.transaction_items.forEach((it: any) => {
            allItems[it.id] = it.quantity
          })
          setSplitItems(allItems)
        } else {
          setSplitItems({})
        }
      }
    }
  }, [isOpen, activeTx?.id, defaultSelectAll, isSettle])

  const toggleSplitItem = (itemId: string, maxQty: number) => {
    setSplitItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) >= maxQty ? 0 : maxQty
    }))
  }

  const handleConfirmPayment = async () => {
    if (paymentMethod === "Tunai" && changeAmount < 0) {
      toast.error("Uang tunai tidak cukup")
      return
    }

    setIsProcessing(true)
    try {
      let res;
      if (isSettle) {
        const paidItems = activeTx.transaction_items
          .filter((item: any) => (splitItems[item.id] || 0) > 0)
          .map((item: any) => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: splitItems[item.id],
            unit_price: item.unit_price
          }))

        const totalOriginalQty = activeTx.transaction_items.reduce((acc: number, it: any) => acc + it.quantity, 0)
        const totalPaidQty = paidItems.reduce((acc: number, it: any) => acc + it.quantity, 0)
        const isPayingAll = totalPaidQty === totalOriginalQty && paidItems.length === activeTx.transaction_items.length

        if (isPayingAll) {
          res = await completeFullTransaction(activeTx.id, paymentMethod, parseFloat(cashPaid || "0"), changeAmount < 0 ? 0 : changeAmount)
        } else {
          res = await splitTransaction({
            originalTransactionId: activeTx.id,
            paidItems,
            paymentMethod,
            storeId: store.id,
            cashPaid: parseFloat(cashPaid || "0"),
            changeAmount: changeAmount < 0 ? 0 : changeAmount
          })
        }
      } else {
        // Mode Create (Cashier)
        res = await createTransaction({
          storeId: store.id,
          totalAmount: finalTotal,
          paymentMethod,
          discountTotal,
          voucherInfo,
          tableId,
          cashPaid: parseFloat(cashPaid || "0"),
          changeAmount: changeAmount < 0 ? 0 : changeAmount,
          items: cartItems.map(item => ({
            product_id: item.id,
            product_name: item.name,
            unit_price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          }))
        })
      }

      if (res.error) {
        toast.error(res.error)
      } else {
        posthog.capture("transaction_completed", {
          payment_method: paymentMethod,
          total_amount: finalTotal,
          discount_total: discountTotal,
          mode: isSettle ? "settle" : "create",
          store_id: store.id,
          has_voucher: !!voucherInfo,
        })
        toast.success("Transaksi Berhasil!")
        setTransactionId(res.transactionId || "")
        setIsSuccess(true)
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsProcessing(false)
    }
  }

  // --- RENDERING ---

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          onSuccess()
          onClose()
        }
      }}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-emerald-500 p-12 text-white flex flex-col items-center justify-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center animate-in zoom-in duration-500">
               <IconCheck size={64} strokeWidth={4} />
            </div>
            <div className="text-center">
               <h2 className="text-3xl font-black uppercase tracking-tight">Transaksi Berhasil</h2>
               <p className="text-white/80 font-bold uppercase text-[10px] tracking-widest mt-1">Pembayaran telah diterima & dicatat</p>
            </div>
          </div>

          <div className="p-8 space-y-6 bg-background">
             <div className="p-8 rounded-[2rem] bg-muted/30 border border-muted/50 space-y-4 shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                   <span>Kembalian</span>
                   <IconReceipt size={14} />
                </div>
                <p className="text-5xl font-black text-emerald-600 leading-none tracking-tighter">
                   Rp {formatCurrency(changeAmount < 0 ? 0 : changeAmount)}
                </p>
                <Separator className="bg-background/50" />
                <div className="flex justify-between text-xs font-bold uppercase">
                   <span className="text-muted-foreground">Total Tagihan</span>
                   <span>Rp {formatCurrency(finalTotal)}</span>
                </div>
             </div>

             <DialogFooter className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-2xl h-14 font-black uppercase text-xs gap-2 border-2"
                  onClick={() => {
                    window.print()
                  }}
                >
                  <IconPrinter size={18} /> Cetak Struk
                </Button>
                <Button 
                  className="rounded-2xl h-14 font-black uppercase text-xs shadow-xl shadow-primary/20"
                  onClick={() => {
                    onSuccess()
                    onClose()
                  }}
                >
                  Selesai
                </Button>
             </DialogFooter>
          </div>

          {/* Hidden Print Section */}
          <ReceiptPrint 
            storeName={store.name}
            address={store.address}
            phone={store.phone}
            logoUrl={store.logo_url}
            transactionId={transactionId || activeTx?.id}
            cashierName={userName}
            items={isSettle ? activeTx.transaction_items.filter((it: any) => (splitItems[it.id] || 0) > 0) : cartItems}
            total={finalTotal}
            paymentMethod={paymentMethod}
            cashPaid={parseFloat(cashPaid || "0")}
            changeAmount={changeAmount < 0 ? 0 : changeAmount}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0 border-none shadow-2xl flex flex-col h-[90vh] max-h-[90vh] overflow-hidden">
        <div className="p-8 text-white shrink-0 bg-primary">
          <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <IconWallet size={28} /> {isSettle ? "Penyelesaian Pembayaran" : "Konfirmasi Pembayaran"}
          </DialogTitle>
          <DialogDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest mt-1">
            {isSettle && activeTx?.tables?.name ? `Meja ${activeTx.tables.name}` : "Transaksi Penjualan"}
          </DialogDescription>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-background">
          <ScrollArea className="h-full w-full">
            <div className="p-8 space-y-8">
              {/* SECTION: Item Selection (Only for Settle) */}
              {isSettle && (
                <div className="space-y-4">
                   <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pilih Item untuk Dibayar</span>
                      <Badge variant="outline" className="text-[10px] font-black uppercase bg-muted/30">{activeTx?.transaction_items.length} Menu</Badge>
                   </div>
                  <div className="grid grid-cols-1 gap-3">
                    {activeTx?.transaction_items.map((item: any) => {
                      const isSelected = (splitItems[item.id] || 0) > 0
                      return (
                        <div 
                          key={item.id} 
                          className={cn(
                            "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group",
                            isSelected ? "border-primary bg-primary/5 shadow-inner" : "border-muted hover:border-primary/20"
                          )}
                          onClick={() => toggleSplitItem(item.id, item.quantity)}
                        >
                          <div className={cn(
                            "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0",
                            isSelected ? "bg-primary border-primary text-white" : "border-muted-foreground/20 group-hover:border-primary/40"
                          )}>
                            {isSelected && <IconCheck size={14} strokeWidth={4} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold uppercase text-sm truncate leading-tight">{item.product_name}</p>
                            <p className="text-xs text-muted-foreground font-black mt-1">
                              {item.quantity} x Rp {formatCurrency(item.unit_price)}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-black text-sm text-primary">Rp {formatCurrency(item.subtotal)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* SECTION: Payment Input */}
              <div className="space-y-8">
                <div className="p-8 bg-muted/30 rounded-[2.5rem] border-2 border-muted/50 space-y-6 shadow-inner">
                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Metode Pembayaran</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Tunai", "QRIS", "Transfer"].map((method) => (
                        <Button
                          key={method}
                          type="button"
                          variant={paymentMethod === method ? "default" : "outline"}
                          className={cn(
                            "rounded-2xl h-11 text-xs font-black uppercase transition-all border-2",
                            paymentMethod === method ? "shadow-lg shadow-primary/20 border-primary" : "bg-background border-muted"
                          )}
                          onClick={() => setPaymentMethod(method)}
                        >
                          {method}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === "Tunai" && (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                      <Label htmlFor="cash-input" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Uang Tunai Diterima (Rp)</Label>
                      <Input 
                        id="cash-input"
                        type="number"
                        value={cashPaid}
                        onChange={(e) => setCashPaid(e.target.value)}
                        className="h-16 rounded-[1.5rem] border-4 text-3xl font-black tracking-tighter transition-all focus:border-primary focus:ring-primary/10 px-6"
                        placeholder="0"
                        autoFocus
                      />
                      
                      {/* Quick Cash Buttons */}
                      <div className="space-y-3 mt-4">
                        <Button
                          variant="secondary"
                          className="w-full rounded-xl h-12 font-black uppercase text-xs border-2 border-primary/20 hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5 flex items-center justify-center gap-2 group"
                          onClick={() => setCashPaid(finalTotal.toString())}
                        >
                          <IconCheck size={18} className="text-primary group-hover:text-white" />
                          Uang Pas: Rp {formatCurrency(finalTotal)}
                        </Button>
                        <div className="grid grid-cols-3 gap-3">
                          {[20000, 50000, 100000].map((amount) => (
                            <Button
                              key={amount}
                              variant="outline"
                              className="rounded-xl h-12 text-[11px] font-black bg-background border-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all uppercase"
                              onClick={() => setCashPaid(amount.toString())}
                            >
                              {amount/1000}k
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total & Change Summary */}
                <div className="px-8 py-8 bg-muted/40 rounded-[2.5rem] border-2 border-muted/50 space-y-6 shadow-inner relative overflow-hidden">
                   <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-muted-foreground mb-1 relative z-10">
                       <span>Ringkasan Tagihan</span>
                       <IconCreditCard size={18} className="text-primary" />
                   </div>
                   
                   <div className="flex flex-col gap-6 relative z-10">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                           <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Bayar Sekarang</span>
                           <p className="text-5xl font-black text-primary leading-none tracking-tighter">Rp {formatCurrency(finalTotal)}</p>
                        </div>
                      </div>

                      {paymentMethod === "Tunai" && (
                        <div className="pt-6 border-t-2 border-muted flex justify-between items-center">
                           <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Kembalian Anda</span>
                              <p className={cn(
                                "text-3xl font-black tracking-tighter leading-none",
                                changeAmount < 0 ? "text-destructive" : "text-emerald-600"
                              )}>
                                Rp {formatCurrency(changeAmount < 0 ? 0 : changeAmount)}
                              </p>
                           </div>
                           <div className={cn(
                             "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                             changeAmount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground/30"
                           )}>
                              <IconReceipt size={32} />
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="p-8 bg-background border-t shrink-0">
          <DialogFooter className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="rounded-2xl h-14 font-black uppercase text-xs border-2 hover:bg-muted" 
              onClick={onClose} 
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button 
              className="rounded-2xl h-14 font-black uppercase text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform"
              disabled={finalTotal === 0 || isProcessing || (paymentMethod === "Tunai" && !cashPaid)}
              onClick={handleConfirmPayment}
            >
              {isProcessing ? (
                <IconLoader2 size={24} className="animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                   Konfirmasi Bayar
                </span>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
