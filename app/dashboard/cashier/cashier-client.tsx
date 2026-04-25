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
  IconX
} from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { ProductCard } from "./product-card"
import { CheckoutDialog } from "./checkout-dialog"
import { cn } from "@/lib/utils"

export function CashierClient({ 
  storeId, 
  initialProducts, 
  categories 
}: { 
  storeId: string;
  initialProducts: any[];
  categories: any[];
}) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [cart, setCart] = React.useState<any[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false)
  const [isCartOpen, setIsCartOpen] = React.useState(false)

  // Filter products
  const filteredProducts = initialProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Cart logic
  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Reusable Cart Content
  const CartContent = () => (
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

      <ScrollArea className="flex-1 p-0">
        {cart.length > 0 ? (
          <div className="divide-y divide-border/50">
            {cart.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Rp {item.price.toLocaleString()}</p>
                  </div>
                  <p className="font-bold text-sm shrink-0">
                    Rp {(item.price * item.quantity).toLocaleString()}
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
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="text-primary font-bold text-lg">Rp {cartTotal.toLocaleString()}</span>
          </div>
        </div>

        <Button 
          className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20" 
          disabled={cart.length === 0}
          onClick={() => {
            setIsCartOpen(false)
            setIsCheckoutOpen(true)
          }}
        >
          <IconReceipt className="mr-2 h-5 w-5" />
          Bayar
        </Button>
      </footer>
    </div>
  )

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
            <Button variant="outline" size="icon" className="shrink-0 lg:hidden" onClick={() => setIsCartOpen(true)}>
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
        <CartContent />
      </div>

      {/* Mobile Drawer Cart */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="p-0 w-full sm:max-w-md border-none flex flex-col">
          <SheetHeader className="sr-only">
            <SheetTitle>Keranjang Belanja</SheetTitle>
          </SheetHeader>
          <CartContent />
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
              <span className="text-base">Rp {cartTotal.toLocaleString()}</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-primary-foreground/20" />
            <IconReceipt className="h-6 w-6" />
          </Button>
        </div>
      )}

      <CheckoutDialog 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        total={cartTotal}
        storeId={storeId}
        onSuccess={() => setCart([])}
      />
    </div>
  )
}
