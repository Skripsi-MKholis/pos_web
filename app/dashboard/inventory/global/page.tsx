import { getGlobalInventory } from "@/lib/inventory-actions"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { IconPackage, IconAlertTriangle } from "@tabler/icons-react"

export default async function GlobalInventoryPage() {
  const inventory = await getGlobalInventory()

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stok Global</h1>
          <p className="text-muted-foreground underline decoration-primary/30 underline-offset-4">
             Pantau ketersediaan stok di seluruh cabang outlet Anda (Enterprise Feature).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Produk</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                   Belum ada produk yang terdaftar di outlet manapun.
                </TableCell>
              </TableRow>
            ) : (
              inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconPackage size={20} />
                      </div>
                      <div>
                        <div className="font-bold">{item.name}</div>
                        <div className="text-xs text-muted-foreground">SKU: {item.sku || "-"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-md">
                      {item.stores?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-bold text-lg">
                      {item.is_infinite_stock ? "∞" : item.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    {!item.is_infinite_stock && item.stock_quantity <= (item.min_stock_level || 5) ? (
                      <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-none">
                        <IconAlertTriangle size={14} className="mr-1" />
                        Stok Rendah
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                        Tersedia
                      </Badge>
                    )}
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
