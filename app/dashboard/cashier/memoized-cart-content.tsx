import * as React from "react"
import {
  IconShoppingCart,
  IconMinus,
  IconPlus,
  IconTrash,
  IconReceipt,
  IconX,
  IconDeviceFloppy,
  IconPrinter
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

export const MemoizedCartContent = React.memo(function MemoizedCartContent({
  cart,
  selectedTable,
  onCancelTable,
  updateQuantity,
  removeFromCart,
  cartTotal,
  finalTotal,
  discountAmount,
  appliedVoucher,
  handleApplyVoucher,
  removeVoucher,
  isValidatingVoucher,
  showTables,
  handleSaveOrder,
  onCheckout,
  VoucherSection
}: {
  cart: any[];
  selectedTable: any;
  onCancelTable: () => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  cartTotal: number;
  finalTotal: number;
  discountAmount: number;
  appliedVoucher: any;
  handleApplyVoucher: (code: string) => Promise<void>;
  removeVoucher: () => void;
  isValidatingVoucher: boolean;
  showTables: boolean;
  handleSaveOrder: (shouldPrint: boolean) => void;
  onCheckout: () => void;
  VoucherSection: React.ComponentType<any>;
}) {
  return (
    <div className="flex flex-col h-full bg-card">
      <header className="p-4 border-b flex items-center justify-between bg-background">
        <div className="flex items-center gap-2 font-bold text-lg">
          <IconShoppingCart className="text-primary h-5 w-5" />
          <span>Keranjang</span>
        </div>
        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-bold">
          {cart.length} Item
        </span>
      </header>

      {/* Continuation Indicator */}
      {selectedTable?.status === 'occupied' && (
        <div className="bg-primary/5 border-b border-primary/20 px-4 py-3 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <div className="space-y-0.5">
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary">Melanjutkan Pesanan</p>
                 <p className="text-xs font-bold uppercase">{selectedTable.name}</p>
              </div>
           </div>
           <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg text-[10px] font-bold uppercase gap-1 text-primary hover:bg-primary/10"
            onClick={onCancelTable}
           >
             <IconX size={14} /> Batal
           </Button>
        </div>
      )}

      <ScrollArea className="flex-1 p-0">
        {cart.length > 0 ? (
          <div className="divide-y divide-border/50">
            {cart.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Rp {formatCurrency(item.price)}</p>
                  </div>
                  <p className="font-bold text-sm shrink-0">
                    Rp {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-lg bg-muted/30 p-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <IconMinus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <IconPlus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <IconShoppingCart className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">Keranjang Kosong</p>
              <p className="text-xs text-muted-foreground">Pilih produk di samping</p>
            </div>
          </div>
        )}
      </ScrollArea>

      <footer className="p-6 border-t bg-background space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <VoucherSection
          appliedVoucher={appliedVoucher}
          onApply={handleApplyVoucher}
          onRemove={removeVoucher}
          discountAmount={discountAmount}
          isValidating={isValidatingVoucher}
        />

        <Separator className="opacity-50" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">Rp {formatCurrency(cartTotal)}</span>
          </div>
          {appliedVoucher && (
             <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Diskon Promo</span>
                <span>-Rp {formatCurrency(discountAmount)}</span>
             </div>
          )}
          <div className="flex justify-between items-end pt-2">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total</span>
            <span className="text-primary font-black text-2xl">Rp {formatCurrency(finalTotal)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          {showTables && (
            <>
              <Button
                variant="outline"
                className="flex-1 h-12 font-bold gap-2 text-xs"
                disabled={cart.length === 0 || isValidatingVoucher}
                onClick={() => handleSaveOrder(false)}
              >
                <IconDeviceFloppy size={18} />
                Simpan
              </Button>

              <Button
                variant="outline"
                className="flex-1 h-12 font-bold gap-2 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                disabled={cart.length === 0 || isValidatingVoucher || !selectedTable}
                onClick={() => handleSaveOrder(true)}
              >
                <IconPrinter size={18} />
                KOT
              </Button>
            </>
          )}

          <Button
            className="flex-[2] h-12 text-lg font-bold shadow-lg shadow-primary/20"
            disabled={cart.length === 0}
            onClick={onCheckout}
          >
            <IconReceipt className="mr-2 h-5 w-5" />
            Bayar
          </Button>
        </div>
      </footer>
    </div>
  )
})
