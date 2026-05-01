"use client"

import { memo } from "react"
import { IconPlus, IconPackage } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

export const ProductCard = memo(function ProductCard({
  product, 
  onAddToCart 
}: { 
  product: any; 
  onAddToCart: (p: any) => void 
}) {
  const isOutOfStock = product.stock_quantity <= 0 && !product.is_infinite_stock

  return (
    <div 
      className={`group relative aspect-square bg-card border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50 flex flex-col ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !isOutOfStock && onAddToCart(product)}
    >
      {/* Background Image / Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-20">
            <IconPackage className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      
      {/* Status Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {isOutOfStock ? (
          <Badge variant="destructive" className="text-[10px] h-5">Stok Habis</Badge>
        ) : product.stock_quantity <= product.min_stock_level ? (
          <Badge className="bg-orange-500 text-white border-none text-[10px] h-5">Stok Rendah</Badge>
        ) : null}
      </div>

      {/* Product Info */}
      <div className="absolute inset-x-0 bottom-0 p-3 z-10 flex flex-col gap-0.5">
        <h3 className="font-bold text-white text-sm line-clamp-1 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="font-extrabold text-primary text-sm">
            Rp {formatCurrency(product.price)}
          </span>
          <div className="bg-primary/20 backdrop-blur-md rounded-full p-1 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
            <IconPlus className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Hover Interaction Overlay */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
})
