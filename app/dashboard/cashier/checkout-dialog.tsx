"use client"

import * as React from "react"
import { IconLoader2, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createTransaction } from "@/lib/transaction-actions"
import { toast } from "sonner"
import { ReceiptPrint } from "@/components/receipt-print"
import { formatCurrency } from "@/lib/utils"

type Product = {
  id: string
  name: string
  price: number
  quantity: number
}

export function CheckoutDialog({
  isOpen,
  onClose,
  cartItems,
  total,
  discountTotal = 0,
  voucherInfo = null,
  store,
  userName,
  tableId,
  onSuccess
}: {
  isOpen: boolean
  onClose: () => void
  cartItems: any[]
  total: number
  discountTotal?: number
  voucherInfo?: any
  store: any
  userName: string
  tableId?: string
  onSuccess: () => void
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [transactionId, setTransactionId] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState("Tunai")
  const [cashPaid, setCashPaid] = React.useState("")
  
  const changeAmount = parseFloat(cashPaid || "0") - total

  async function handleCheckout() {
    if (paymentMethod === "Tunai" && changeAmount < 0) {
      toast.error("Uang tunai tidak cukup")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        storeId: store.id,
        totalAmount: total,
        paymentMethod,
        discountTotal,
        voucherInfo,
        tableId,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }))
      }

      const result = await createTransaction(payload)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Transaksi Berhasil!")
        setTransactionId(result.transactionId || "")
        setIsSuccess(true)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          setIsSuccess(false)
          setCashPaid("")
          onSuccess()
          onClose()
        }
      }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Transaksi Berhasil</DialogTitle>
            <DialogDescription>Rincian kembalian dan opsi cetak struk.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-in zoom-in">
              <IconCheck size={40} strokeWidth={3} />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold">Transaksi Berhasil!</h2>
              <p className="text-muted-foreground text-sm">Kembalian: Rp {formatCurrency(changeAmount < 0 ? 0 : changeAmount)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pb-2">
            <Button 
              variant="outline" 
              className="h-11 rounded-xl"
              onClick={() => {
                window.print()
              }}
            >
              Cetak Struk
            </Button>
            <Button 
              className="h-11 rounded-xl"
              onClick={() => {
                setIsSuccess(false)
                setCashPaid("")
                onSuccess()
                onClose()
              }}
            >
              Transaksi Baru
            </Button>
          </div>

          <ReceiptPrint 
            storeName={store.name}
            address={store.address}
            phone={store.phone}
            logoUrl={store.logo_url}
            header={store.receipt_header}
            footer={store.receipt_footer}
            showLogo={store.receipt_show_logo}
            paperSize={store.preferred_paper_size}
            cashierName={userName}
            transactionId={transactionId}
            items={cartItems}
            total={total}
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selesaikan Pembayaran</DialogTitle>
          <DialogDescription>
            Pilih metode pembayaran dan konfirmasi total belanja.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>Total Belanja</span>
              <span>Rp {formatCurrency(total + discountTotal)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 text-sm italic">
                <span>Diskon / Voucher</span>
                <span>-Rp {formatCurrency(discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl text-primary border-t pt-2 mt-2">
              <span>Total Tagihan</span>
              <span>Rp {formatCurrency(total)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Metode Pembayaran</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tunai">Tunai</SelectItem>
                  <SelectItem value="QRIS">QRIS</SelectItem>
                  <SelectItem value="Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Kartu">Debit/Kredit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "Tunai" && (
              <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label htmlFor="cash-paid">Uang Tunai (Rp)</Label>
                  <Input 
                    id="cash-paid"
                    type="number" 
                    value={cashPaid}
                    onChange={(e) => setCashPaid(e.target.value)}
                    placeholder="Masukkan jumlah uang"
                    autoFocus
                  />
                </div>
                <div className="flex justify-between items-center p-3 bg-primary/5 border border-primary/20 rounded-md">
                  <span className="text-sm font-medium">Kembalian</span>
                  <span className={`font-bold ${changeAmount < 0 ? 'text-destructive' : 'text-primary'}`}>
                    Rp {formatCurrency(changeAmount < 0 ? 0 : changeAmount)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button 
            className="px-6" 
            onClick={handleCheckout} 
            disabled={isLoading || (paymentMethod === "Tunai" && !cashPaid)}
          >
            {isLoading ? (
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <IconCheck className="mr-2 h-4 w-4" />
            )}
            Konfirmasi Bayar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
