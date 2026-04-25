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

export function CheckoutDialog({
  isOpen,
  onClose,
  cartItems,
  total,
  storeId,
  onSuccess
}: {
  isOpen: boolean
  onClose: () => void
  cartItems: any[]
  total: number
  storeId: string
  onSuccess: () => void
}) {
  const [isLoading, setIsLoading] = React.useState(false)
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
        storeId,
        totalAmount: total,
        paymentMethod,
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
        onSuccess()
        onClose()
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsLoading(false)
    }
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
            <div className="flex justify-between text-muted-foreground">
              <span>Total Belanja</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-primary">
              <span>Total Tagihan</span>
              <span>Rp {total.toLocaleString()}</span>
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
                    Rp {(changeAmount < 0 ? 0 : changeAmount).toLocaleString()}
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
