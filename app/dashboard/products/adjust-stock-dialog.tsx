"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconPackageImport, IconLoader2 } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateStock } from "@/lib/product-actions"
import posthog from "posthog-js"

export function AdjustStockDialog({ 
  id, 
  currentStock, 
  productName 
}: { 
  id: string; 
  currentStock: number; 
  productName: string 
}) {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [quantity, setQuantity] = React.useState(currentStock.toString())
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const newQty = parseInt(quantity)
      const result = await updateStock(id, newQty)
      if (result.error) {
        toast.error(result.error)
      } else {
        posthog.capture("stock_adjusted", {
          product_id: id,
          product_name: productName,
          previous_stock: currentStock,
          new_stock: newQty,
        })
        toast.success(`Stok ${productName} diperbarui`)
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
          <IconPackageImport className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Sesuaikan Stok</DialogTitle>
            <DialogDescription>
              Ubah jumlah stok untuk produk <strong>{productName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="stock">Jumlah Stok Sekarang</Label>
              <Input
                id="stock"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
              Perbarui Stok
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
