"use client"

import * as React from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconSearch, IconAlertCircle, IconFilter, IconPackage } from "@tabler/icons-react"
import { DeleteProductButton } from "./delete-product-button"
import { AdjustStockDialog } from "./adjust-stock-dialog"
import { EditProductDialog } from "./edit-product-dialog"

export function ProductTableClient({ 
  products, 
  categories 
}: { 
  products: any[]; 
  categories: any[] 
}) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (product.sku?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau SKU..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <IconFilter size={18} className="text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
              <SelectItem value="null">Tanpa Kategori</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Tidak ada produk yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center border">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <IconPackage className="h-5 w-5 text-muted-foreground/50" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{product.sku || "Tanpa SKU"}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.categories?.name || "Tanpa Kategori"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0
                    }).format(product.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={product.stock_quantity <= product.min_stock_level ? "text-destructive font-bold" : ""}>
                        {product.stock_quantity}
                      </span>
                      {product.stock_quantity <= product.min_stock_level && (
                        <IconAlertCircle size={14} className="text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <EditProductDialog product={product} categories={categories} />
                      <AdjustStockDialog 
                        id={product.id} 
                        currentStock={product.stock_quantity} 
                        productName={product.name} 
                      />
                      <DeleteProductButton id={product.id} imageUrl={product.image_url} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
