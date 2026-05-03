"use client"

import * as React from "react"
import { 
  IconSearch, 
  IconShoppingCart, 
  IconMinus, 
  IconPlus, 
  IconTrash,
  IconReceipt,
  IconFilter,
  IconX,
  IconArmchair,
  IconChevronDown,
  IconTicket,
  IconDeviceFloppy,
  IconPrinter
} from "@tabler/icons-react"
import { ReceiptPrint } from "@/components/receipt-print"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { ProductCard } from "./product-card"
import { GeneralPaymentModal } from "@/components/payment-modal"
import { cn, formatCurrency } from "@/lib/utils"
import { validateVoucher } from "@/lib/promotion-actions"
import { useSearchParams, useRouter } from "next/navigation"
import { createTransaction, TransactionPayload } from "@/lib/transaction-actions"

// Sub-component for Voucher to prevent full parent re-renders on every keystroke
function VoucherSection({ 
  appliedVoucher, 
  onApply, 
  onRemove, 
  discountAmount, 
  isValidating 
}: { 
  appliedVoucher: any;
  onApply: (code: string) => Promise<void>;
  onRemove: () => void;
  discountAmount: number;
  isValidating: boolean;
}) {
  const [localCode, setLocalCode] = React.useState("")

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <IconTicket size={14} />
          Voucher / Promo
        </Label>
        {appliedVoucher && (
          <button 
            onClick={() => {
              onRemove()
              setLocalCode("")
            }} 
            className="text-[10px] text-destructive font-bold uppercase hover:underline"
          >
            Hapus
          </button>
        )}
      </div>
      
      {appliedVoucher ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20 border-dashed">
           <div className="flex items-center gap-3">
             <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
               <IconTicket size={20} />
             </div>
             <div>
               <p className="text-xs font-black uppercase tracking-tight">{appliedVoucher.code}</p>
               <p className="text-[10px] text-muted-foreground">Tersimpan: Rp {formatCurrency(discountAmount)}</p>
             </div>
           </div>
           <div className="text-right">
              <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">AKTIF</span>
           </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input 
            placeholder="Kode promo..." 
            className="bg-muted/50 border-none h-11"
            value={localCode}
            onChange={(e) => setLocalCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApply(localCode)}
          />
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-11 w-11 shrink-0"
            onClick={() => onApply(localCode)}
            disabled={isValidating || !localCode}
          >
            <IconPlus className={cn("h-4 w-4", isValidating && "animate-spin")} />
          </Button>
        </div>
      )}
    </div>
  )
}



type CartContentProps = {
  cart: any[];
  selectedTable: any;
  showTables: boolean;
  appliedVoucher: any;
  discountAmount: number;
  cartTotal: number;
  finalTotal: number;
  isValidatingVoucher: boolean;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
  onApplyVoucher: (code: string) => Promise<void>;
  onRemoveVoucher: () => void;
  onSaveOrder: (shouldPrint: boolean) => Promise<void>;
  onCancelTable: () => void;
  onCheckout: () => void;
}


const CartContent = React.memo(function CartContent({
  cart,
  selectedTable,
  showTables,
  appliedVoucher,
  discountAmount,
  cartTotal,
  finalTotal,
  isValidatingVoucher,
  onUpdateQuantity,
  onRemoveFromCart,
  onApplyVoucher,
  onRemoveVoucher,
  onSaveOrder,
  onCancelTable,
  onCheckout
}: CartContentProps) {
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
                      onClick={() => onUpdateQuantity(item.id, -1)}
                    >
                      <IconMinus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                    >
                      <IconPlus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => onRemoveFromCart(item.id)}
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
          onApply={onApplyVoucher}
          onRemove={onRemoveVoucher}
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
                onClick={() => onSaveOrder(false)}
              >
                <IconDeviceFloppy size={18} />
                Simpan
              </Button>

              <Button
                variant="outline"
                className="flex-1 h-12 font-bold gap-2 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                disabled={cart.length === 0 || isValidatingVoucher || !selectedTable}
                onClick={() => onSaveOrder(true)}
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

export function CashierClient({ 
  store,
  userName,
  initialProducts, 
  categories,
  initialTables = []
}: { 
  store: any;
  userName: string;
  initialProducts: any[];
  categories: any[];
  initialTables?: any[];
}) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [cart, setCart] = React.useState<any[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false)
  const [isCartOpen, setIsCartOpen] = React.useState(false)
  const [appliedVoucher, setAppliedVoucher] = React.useState<any>(null)
  const [isValidatingVoucher, setIsValidatingVoucher] = React.useState(false)
  const [selectedTable, setSelectedTable] = React.useState<any>(null)
  const [isTableSelectOpen, setIsTableSelectOpen] = React.useState(false)
  const [printData, setPrintData] = React.useState<any>(null)
  const [isKitchenPrint, setIsKitchenPrint] = React.useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const notifiedTableRef = React.useRef<string | null>(null)

  const hasFeature = (feature: string) => {
    return store.settings?.features?.[feature] !== false
  }

  const showTables = hasFeature("tables")

  // Handle auto-selected table from URL
  React.useEffect(() => {
    const tableId = searchParams.get("table")
    if (tableId && initialTables.length > 0) {
      const table = initialTables.find(t => t.id === tableId)
      if (table) {
        setSelectedTable(table)
        // Only show toast if we haven't notified for THIS tableId yet
        if (table.status === 'occupied' && notifiedTableRef.current !== tableId) {
          toast.info(`Melanjutkan pesanan untuk ${table.name}`)
          notifiedTableRef.current = tableId
        }
      }
    }
  }, [searchParams, initialTables])

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return initialProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || p.category_id === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [initialProducts, searchQuery, selectedCategory])

  // Cart logic
  const addToCart = React.useCallback((product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const updateQuantity = React.useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }, [])

  const removeFromCart = React.useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }, [])

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Calculate Discount
  const discountAmount = React.useMemo(() => {
    if (!appliedVoucher) return 0
    
    if (appliedVoucher.type === "percentage") {
      let amount = (cartTotal * appliedVoucher.value) / 100
      if (appliedVoucher.max_discount) {
        amount = Math.min(amount, appliedVoucher.max_discount)
      }
      return amount
    } else {
      return appliedVoucher.value
    }
  }, [appliedVoucher, cartTotal])

  const finalTotal = Math.max(0, cartTotal - discountAmount)

  const handleApplyVoucher = React.useCallback(async (code: string) => {
    if (!code) return
    setIsValidatingVoucher(true)
    try {
      const res = await validateVoucher(store.id, code, cartTotal)
      if (res.success) {
        setAppliedVoucher(res.voucher)
        toast.success(`Voucher "${res.voucher.code}" berhasil dipasang!`)
      } else {
        toast.error(res.error || "Voucher tidak ditemukan")
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat memvalidasi voucher")
    } finally {
      setIsValidatingVoucher(false)
    }
  }, [store.id, cartTotal])

  const removeVoucher = React.useCallback(() => {
    setAppliedVoucher(null)
    toast.info("Voucher dilepas")
  }, [])

  const handleSaveOrder = React.useCallback(async (shouldPrint: boolean = false) => {
    if (cart.length === 0) return
    if (!selectedTable) {
      toast.error("Pilih meja terlebih dahulu untuk menyimpan pesanan tunda")
      return
    }

    setIsValidatingVoucher(true) // Misusing this state for convenience or use a new one
    try {
      const payload: TransactionPayload = {
        storeId: store.id,
        totalAmount: finalTotal,
        paymentMethod: "Pending",
        discountTotal: discountAmount,
        voucherInfo: appliedVoucher ? { code: appliedVoucher.code, amount: discountAmount } : null,
        tableId: selectedTable.id,
        status: "Pending",
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }))
      }

      const res = await createTransaction(payload)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Pesanan untuk ${selectedTable.name} berhasil disimpan!`)
        
        if (shouldPrint) {
          setIsKitchenPrint(true)
          setPrintData({
            id: res.transactionId,
            total: finalTotal,
            items: cart.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            }))
          })
          setTimeout(() => {
            window.print()
            setCart([])
            setAppliedVoucher(null)
            setSelectedTable(null)
            setIsCartOpen(false)
          }, 300)
        } else {
          setCart([])
          setAppliedVoucher(null)
          setSelectedTable(null)
          setIsCartOpen(false)
        }
      }
    } catch (err) {
      toast.error("Gagal menyimpan pesanan")
    } finally {
      setIsValidatingVoucher(false)
    }
  }, [cart, selectedTable, store.id, finalTotal, discountAmount, appliedVoucher])
  const handleCancelTable = React.useCallback(() => {
    setSelectedTable(null)
    notifiedTableRef.current = null
    router.push('/dashboard/cashier')
    toast.info('Kembali ke transaksi baru')
  }, [router])

  const handleCheckout = React.useCallback(() => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }, [])


  // Reusable Cart Content


  return (
    <div className="flex h-full gap-0 overflow-hidden bg-muted/30 relative">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col min-w-0 bg-background lg:border-r">
        <header className="p-4 border-b space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari produk..." 
                className="pl-9 bg-muted/50 border-none ring-offset-background focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {showTables && (
              <Popover open={isTableSelectOpen} onOpenChange={setIsTableSelectOpen}>
                <PopoverTrigger asChild disabled={selectedTable?.status === 'occupied'}>
                  <Button variant="outline" className={cn(
                    "h-11 rounded-xl gap-2 font-bold transition-all",
                    selectedTable ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30",
                    selectedTable?.status === 'occupied' && "opacity-100 cursor-not-allowed border-dashed"
                  )}>
                    <IconArmchair size={18} />
                    <span className="max-w-[80px] truncate">
                      {selectedTable ? selectedTable.name : "Meja"}
                    </span>
                    {selectedTable?.status !== 'occupied' && (
                      <IconChevronDown size={14} className={cn("transition-transform", isTableSelectOpen && "rotate-180")} />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 rounded-2xl overflow-hidden shadow-2xl border-none" align="start">
                  <div className="p-3 bg-muted/50 border-b">
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pilih Meja</p>
                  </div>
                  <div className="p-2 max-h-80 overflow-y-auto grid grid-cols-2 gap-2">
                     <Button 
                       variant={!selectedTable ? "default" : "outline"} 
                       className="h-10 rounded-lg text-xs" 
                       onClick={() => {
                         setSelectedTable(null)
                         setIsTableSelectOpen(false)
                       }}
                     >
                       Take Away
                     </Button>
                     {initialTables.map(table => (
                       <Button 
                         key={table.id}
                         variant={selectedTable?.id === table.id ? "default" : "outline"}
                         className={cn(
                           "h-10 rounded-lg text-xs justify-start px-3 gap-2 overflow-hidden",
                           table.status === 'occupied' && "opacity-50 border-dashed"
                         )}
                         onClick={() => {
                           setSelectedTable(table)
                           setIsTableSelectOpen(false)
                         }}
                         disabled={table.status === 'occupied'}
                       >
                         <IconArmchair size={14} />
                         <span className="truncate">{table.name}</span>
                       </Button>
                     ))}
                  </div>
                  {initialTables.length === 0 && (
                    <div className="p-4 text-center text-xs text-muted-foreground italic">
                      Belum ada meja terdaftar
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}

            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0 lg:hidden" onClick={() => setIsCartOpen(true)}>
              <div className="relative">
                <IconShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </div>
            </Button>
          </div>

          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              <Button 
                variant={selectedCategory === "all" ? "default" : "outline"} 
                size="sm"
                className="rounded-full px-5"
                onClick={() => setSelectedCategory("all")}
              >
                Semua
              </Button>
              {categories.map((cat) => (
                <Button 
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  className="rounded-full px-5"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </header>

        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <IconSearch className="h-12 w-12 mb-4 opacity-20" />
              <p>Produk tidak ditemukan</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Desktop Sidebar Cart */}
      <div className="hidden lg:flex w-[380px] flex-col shrink-0">
        <CartContent
          cart={cart}
          selectedTable={selectedTable}
          showTables={showTables}
          appliedVoucher={appliedVoucher}
          discountAmount={discountAmount}
          cartTotal={cartTotal}
          finalTotal={finalTotal}
          isValidatingVoucher={isValidatingVoucher}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onApplyVoucher={handleApplyVoucher}
          onRemoveVoucher={removeVoucher}
          onSaveOrder={handleSaveOrder}
          onCancelTable={handleCancelTable}
          onCheckout={handleCheckout}
        />
      </div>

      {/* Mobile Drawer Cart */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="p-0 w-full sm:max-w-md border-none flex flex-col">
          <SheetHeader className="sr-only">
            <SheetTitle>Keranjang Belanja</SheetTitle>
          </SheetHeader>
          <CartContent
          cart={cart}
          selectedTable={selectedTable}
          showTables={showTables}
          appliedVoucher={appliedVoucher}
          discountAmount={discountAmount}
          cartTotal={cartTotal}
          finalTotal={finalTotal}
          isValidatingVoucher={isValidatingVoucher}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onApplyVoucher={handleApplyVoucher}
          onRemoveVoucher={removeVoucher}
          onSaveOrder={handleSaveOrder}
          onCancelTable={handleCancelTable}
          onCheckout={handleCheckout}
        />
        </SheetContent>
      </Sheet>

      {/* Mobile FAB Checkout */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50 animate-in zoom-in duration-300">
          <Button 
            size="lg" 
            className="rounded-full h-14 px-6 shadow-2xl shadow-primary/40 flex items-center gap-3"
            onClick={() => setIsCheckoutOpen(true)}
          >
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] opacity-80 uppercase font-bold tracking-wider">Total</span>
              <span className="text-base">Rp {formatCurrency(cartTotal)}</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-primary-foreground/20" />
            <IconReceipt className="h-6 w-6" />
          </Button>
        </div>
      )}

      <GeneralPaymentModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        mode="create"
        cartItems={cart}
        total={finalTotal}
        discountTotal={discountAmount}
        voucherInfo={appliedVoucher ? { code: appliedVoucher.code, amount: discountAmount } : null}
        store={store}
        userName={userName}
        tableId={selectedTable?.id}
        onSuccess={() => {
          setCart([])
          setAppliedVoucher(null)
          setSelectedTable(null)
          router.refresh()
        }}
      />

      {/* Hidden Printing Area */}
      {printData && (
        <ReceiptPrint
          storeName={store.name}
          address={store.address}
          phone={store.phone}
          logoUrl={store.logo_url}
          transactionId={printData.id}
          cashierName={userName}
          items={printData.items}
          total={printData.total || 0}
          paymentMethod="Pending"
          tableName={selectedTable?.name}
          mode={isKitchenPrint ? "kitchen" : "invoice"}
        />
      )}
    </div>
  )
}
