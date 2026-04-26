"use client"

import * as React from "react"
import { 
  IconReceipt, 
  IconEye, 
  IconChevronDown, 
  IconChevronUp,
  IconCalendar,
  IconDownload,
  IconCheck,
  IconCurrencyDollar,
  IconTrash,
  IconCreditCard,
  IconClock,
  IconArmchair,
  IconHash,
  IconUser,
  IconUserCircle,
  IconTicket,
  IconCalculator
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
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { cn, formatCurrency } from "@/lib/utils"
import { GeneralPaymentModal } from "@/components/payment-modal"

export function TransactionTableClient({ 
  initialData, 
  store
}: { 
  initialData: any[], 
  store: any
}) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [isSplitOpen, setIsSplitOpen] = React.useState(false)
  const [activeTx, setActiveTx] = React.useState<any>(null)
  
  const router = useRouter()

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const downloadCSV = () => {
    if (initialData.length === 0) return
    const headers = ["Waktu", "ID Transaksi", "Meja", "Kasir", "Pelanggan", "Metode", "Status", "Total Amount", "Items"]
    const rows = initialData.map(tx => {
      const items = tx.transaction_items?.map((i: any) => `${i.product_name} (${i.quantity})`).join("; ")
      return [
        format(new Date(tx.created_at), "yyyy-MM-dd HH:mm"),
        tx.id,
        tx.tables?.name || "-",
        tx.cashier?.full_name || "-",
        tx.customers?.name || "-",
        tx.payment_method,
        tx.status,
        tx.total_amount,
        `"${items}"`
      ]
    })
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
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
        <Button onClick={downloadCSV} variant="outline" className="gap-2 rounded-xl text-xs font-bold uppercase tracking-wider">
          <IconDownload className="h-4 w-4" />
          Ekspor CSV
        </Button>
      </div>
      <div className="rounded-3xl border bg-card overflow-hidden shadow-xl border-muted/50">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID & Waktu</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Meja / Pelanggan</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kasir</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Metode</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
            <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</TableHead>
            <TableHead className="w-[100px] text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
                Belum ada transaksi
              </TableCell>
            </TableRow>
          ) : (
            initialData.map((tx) => (
              <React.Fragment key={tx.id}>
                <TableRow 
                  className={cn(
                    "hover:bg-muted/30 transition-colors cursor-pointer border-muted/30",
                    expandedId === tx.id ? 'bg-muted/20' : ''
                  )}
                  onClick={() => toggleExpand(tx.id)}
                >
                  <TableCell>
                    <div className="h-10 w-10 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground shadow-inner">
                       <IconReceipt size={20} />
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-muted-foreground">#{tx.id.slice(0, 8)}</span>
                      <span className="font-bold text-xs uppercase">{format(new Date(tx.created_at), "dd MMM yyyy", { locale: id })}</span>
                      <span className="text-[10px] text-muted-foreground font-black">{format(new Date(tx.created_at), "HH:mm")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {tx.tables?.name ? (
                        <Badge variant="secondary" className="gap-1 px-2 py-0.5 bg-primary/10 text-primary border-none font-black uppercase text-[9px] w-fit italic">
                          <IconArmchair size={10} /> Meja {tx.tables.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-[9px] font-black uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-lg w-fit">Langsung</span>
                      )}
                      {tx.customers?.name && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                          <IconUserCircle size={12} /> {tx.customers.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm">
                        <IconUser size={12} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter">{tx.cashier?.full_name || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-black text-[9px] uppercase px-2 border-muted-foreground/20 text-muted-foreground">
                      {tx.payment_method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-black text-[9px] uppercase px-2 shadow-sm",
                      tx.status === 'Berhasil' 
                        ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200' 
                        : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200'
                    )}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-black text-primary text-sm tracking-tight">
                    Rp {formatCurrency(tx.total_amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {tx.status === 'Pending' && (
                        <Button 
                          size="sm" 
                          className="h-8 px-4 text-[9px] font-black uppercase rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.05] transition-transform"
                          onClick={(e) => {
                             e.stopPropagation()
                             setActiveTx(tx)
                             setIsSplitOpen(true)
                          }}
                        >
                          Bayar
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80 rounded-xl">
                        {expandedId === tx.id ? <IconChevronUp className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                
                {expandedId === tx.id && (
                  <TableRow className="bg-muted/5 animate-in fade-in slide-in-from-top-2 duration-200 border-none">
                    <TableCell colSpan={8} className="p-0 border-b overflow-hidden border-t border-muted/50">
                      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-muted/10">
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
                               <IconHash size={14} /> Daftar Pesanan | ID: {tx.id.slice(0, 16)}...
                            </h4>
                            <Badge variant="outline" className="text-[9px] uppercase font-black bg-white/50">{tx.transaction_items?.length} Menu Diproses</Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                            {tx.transaction_items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center text-sm p-4 rounded-[2rem] bg-background border border-muted/50 shadow-sm group hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-muted group-hover:bg-primary/5 transition-colors">
                                    {item.products?.image_url ? (
                                      <img src={item.products.image_url} alt={item.product_name} className="h-full w-full object-cover" />
                                    ) : (
                                      <IconReceipt className="h-5 w-5 opacity-20" />
                                    )}
                                  </div>
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-[11px] uppercase leading-tight tracking-tight">{item.product_name}</p>
                                    <p className="text-[9px] text-muted-foreground font-black">
                                      {item.quantity} x Rp {formatCurrency(item.unit_price)}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-black text-primary text-xs tracking-tighter">Rp {formatCurrency(item.subtotal)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="lg:col-span-5 space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Ringkasan Pembayaran Akhir</h4>
                          <div className="p-8 rounded-[2.5rem] border-2 border-muted bg-background space-y-5 shadow-2xl relative overflow-hidden">
                            <div className="space-y-4 pb-4 border-b border-dashed">
                               <div className="flex justify-between text-xs font-bold">
                                  <span className="text-muted-foreground uppercase tracking-widest text-[9px]">Subtotal Pesanan</span>
                                  <span className="font-black tracking-tighter">Rp {formatCurrency(tx.total_amount + (tx.discount_total || 0))}</span>
                               </div>
                               
                               {(tx.discount_total > 0 || tx.voucher_info?.code) && (
                                 <div className="flex justify-between text-xs font-bold text-destructive">
                                    <span className="flex items-center gap-1.5 uppercase tracking-widest text-[9px]">
                                       <IconTicket size={12} /> Diskon {tx.voucher_info?.code && `(${tx.voucher_info.code})`}
                                    </span>
                                    <span className="font-black tracking-tighter">- Rp {formatCurrency(tx.discount_total)}</span>
                                 </div>
                               )}
                            </div>

                            <div className="flex justify-between items-end py-2">
                               <div className="space-y-1">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Dibayar</p>
                                  <p className="text-5xl font-black text-primary leading-none tracking-tighter">Rp {formatCurrency(tx.total_amount)}</p>
                               </div>
                            </div>
                            
                            <Separator className="bg-muted/50" />

                            <div className="space-y-3 bg-muted/10 p-6 rounded-[2rem] border border-muted/50 shadow-inner">
                               <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                  <span>Metode: {tx.payment_method}</span>
                                  <span className="flex items-center gap-1 text-primary"><IconCalculator size={10} strokeWidth={3} /> Audit Keuangan</span>
                                </div>
                               
                               <div className="space-y-2">
                                  <div className="flex justify-between text-[11px] font-bold">
                                     <span className="text-muted-foreground uppercase tracking-wider">Uang Diterima</span>
                                     <span className="text-emerald-600 font-black tracking-tighter">Rp {formatCurrency(tx.cash_paid || tx.total_amount)}</span>
                                  </div>
                                  <div className="flex justify-between text-[11px] font-bold">
                                     <span className="text-muted-foreground uppercase tracking-wider">Kembalian</span>
                                     <span className="text-primary font-black tracking-tighter">Rp {formatCurrency(tx.change_amount || 0)}</span>
                                  </div>
                               </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                               <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                     <IconUser size={18} />
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-[8px] font-black uppercase text-muted-foreground leading-none">Kasir Bertugas</span>
                                     <span className="text-[10px] font-black uppercase tracking-tight">{tx.cashier?.full_name || "Petugas"}</span>
                                  </div>
                               </div>
                               {tx.customers?.name && (
                                 <div className="flex items-center gap-3 text-right">
                                    <div className="flex flex-col">
                                       <span className="text-[8px] font-black uppercase text-muted-foreground leading-none">Pembeli</span>
                                       <span className="text-[10px] font-black uppercase text-primary tracking-tight">{tx.customers.name}</span>
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                       <IconUserCircle size={18} />
                                    </div>
                                 </div>
                               )}
                            </div>

                            {tx.status === 'Pending' && (
                              <Button 
                                className="w-full rounded-[1.5rem] h-14 font-black uppercase text-xs gap-3 shadow-xl shadow-primary/20 mt-4 border-b-4 border-primary/20 active:border-b-0 active:translate-y-1 transition-all"
                                onClick={() => {
                                  setActiveTx(tx)
                                  setIsSplitOpen(true)
                                }}
                              >
                                <IconCheck size={18} strokeWidth={3} /> Lunasi Sekarang
                              </Button>
                            )}
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

      {/* Unified Payment Modal */}
      <GeneralPaymentModal
        isOpen={isSplitOpen}
        onClose={() => setIsSplitOpen(false)}
        activeTx={activeTx}
        store={store}
        userName="Manager"
        onSuccess={() => {
          router.refresh()
        }}
      />
    </div>
  )
}
