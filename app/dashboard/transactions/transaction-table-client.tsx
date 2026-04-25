"use client"

import * as React from "react"
import { 
  IconReceipt, 
  IconEye, 
  IconChevronDown, 
  IconChevronUp,
  IconCalendar,
  IconDownload
} from "@tabler/icons-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function TransactionTableClient({ initialData }: { initialData: any[] }) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const downloadCSV = () => {
    if (initialData.length === 0) return

    // Header CSV
    const headers = ["Waktu", "ID Transaksi", "Metode", "Status", "Total Amount", "Items"]
    
    // Data rows
    const rows = initialData.map(tx => {
      const items = tx.transaction_items?.map((i: any) => `${i.product_name} (${i.quantity})`).join("; ")
      return [
        format(new Date(tx.created_at), "yyyy-MM-dd HH:mm"),
        tx.id,
        tx.payment_method,
        tx.status,
        tx.total_amount,
        `"${items}"`
      ]
    })

    // Combine
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `laporan_penjualan_${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={downloadCSV} variant="outline" className="gap-2">
          <IconDownload className="h-4 w-4" />
          Ekspor CSV
        </Button>
      </div>
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Waktu Transaksi</TableHead>
            <TableHead>Metode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                Belum ada transaksi
              </TableCell>
            </TableRow>
          ) : (
            initialData.map((tx) => (
              <React.Fragment key={tx.id}>
                <TableRow 
                  className={`hover:bg-muted/30 transition-colors cursor-pointer ${expandedId === tx.id ? 'bg-muted/20' : ''}`}
                  onClick={() => toggleExpand(tx.id)}
                >
                  <TableCell>
                    <IconReceipt className="h-5 w-5 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{format(new Date(tx.created_at), "dd MMM yyyy", { locale: id })}</span>
                      <span className="text-xs text-muted-foreground">{format(new Date(tx.created_at), "HH:mm")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {tx.payment_method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={tx.status === 'Berhasil' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200' : ''}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    Rp {tx.total_amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {expandedId === tx.id ? <IconChevronUp className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
                
                {expandedId === tx.id && (
                  <TableRow className="bg-muted/5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <TableCell colSpan={6} className="p-0 border-b">
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/10">
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Detail Item</h4>
                          <div className="space-y-2">
                            {tx.transaction_items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center text-sm p-3 rounded-xl bg-background border shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0 border">
                                    {item.products?.image_url ? (
                                      <img src={item.products.image_url} alt={item.product_name} className="h-full w-full object-cover" />
                                    ) : (
                                      <IconReceipt className="h-5 w-5 opacity-20" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold">{item.product_name}</p>
                                    <p className="text-xs text-muted-foreground">{item.quantity} x Rp {item.unit_price.toLocaleString()}</p>
                                  </div>
                                </div>
                                <p className="font-extrabold text-primary">Rp {item.subtotal.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ringkasan Pembayaran</h4>
                          <div className="p-4 rounded-xl border bg-background space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>Rp {tx.total_amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t pt-3 font-bold text-lg">
                              <span>Total Bayar</span>
                              <span className="text-primary">Rp {tx.total_amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground italic">
                              <span>Metode</span>
                              <span>{tx.payment_method}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
