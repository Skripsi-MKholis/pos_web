"use client"

import * as React from "react"
import { 
  IconBuildingStore, 
  IconPackage, 
  IconReceipt, 
  IconUsers, 
  IconDotsVertical,
  IconSearch,
  IconFilter,
  IconArrowUpRight,
  IconCreditCard,
  IconCalendar,
  IconMapPin,
  IconUser,
  IconMail,
  IconBan,
  IconCheck,
  IconArrowRight,
  IconLoader2
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { updateStoreStatus } from "@/lib/admin-actions"

interface StoreDetailClientProps {
  store: any
  products: any[]
  transactions: any[]
}

export function StoreDetailClient({ store, products, transactions }: StoreDetailClientProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [productSearch, setProductSearch] = React.useState("")
  const [transactionSearch, setTransactionSearch] = React.useState("")

  const isSuspended = store.settings?.is_suspended === true

  const handleToggleStatus = async () => {
    setIsLoading(true)
    const result = await updateStoreStatus(store.id, isSuspended)

    if (result.success) {
      toast.success(`Toko berhasil ${isSuspended ? 'diaktifkan kembali' : 'dinonaktifkan'}.`)
      window.location.reload() // Refresh to get updated state
    } else {
      toast.error(result.error || "Gagal mengubah status toko.")
    }
    setIsLoading(false)
  }

  // Calculate metrics
  const totalRevenue = transactions.reduce((sum, tx) => sum + Number(tx.total_amount), 0)
  const activeStaff = store.members?.length || 0

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(productSearch.toLowerCase())
  )

  const filteredTransactions = transactions.filter(tx => 
    tx.id.toLowerCase().includes(transactionSearch.toLowerCase()) ||
    tx.payment_method?.toLowerCase().includes(transactionSearch.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-primary text-primary-foreground relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-foreground/60 font-black text-[10px] uppercase tracking-widest">Total Pendapatan</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tighter">{formatCurrency(totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-[10px] font-bold opacity-80">
              <IconArrowUpRight size={14} />
              <span>Berdasarkan 50 transaksi terakhir</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-zinc-900 relative overflow-hidden group border border-muted/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">Katalog Produk</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tighter">{products.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
              <IconPackage size={14} />
              <span>Total SKU terdaftar</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-zinc-900 relative overflow-hidden group border border-muted/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">Total Transaksi</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tighter">{transactions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
              <IconReceipt size={14} />
              <span>Data history tersimpan</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-zinc-900 relative overflow-hidden group border border-muted/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground font-black text-[10px] uppercase tracking-widest">Karyawan Aktif</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tighter">{activeStaff}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500">
              <IconUsers size={14} />
              <span>Anggota tim outlet</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 border border-muted/20">
          <TabsTrigger value="overview" className="rounded-xl px-6 font-bold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Overview</TabsTrigger>
          <TabsTrigger value="products" className="rounded-xl px-6 font-bold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Produk</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-xl px-6 font-bold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Transaksi</TabsTrigger>
          <TabsTrigger value="staff" className="rounded-xl px-6 font-bold text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Store Information */}
            <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900 border border-muted/20">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black tracking-tight">Informasi Outlet</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pemilik</p>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {store.owner?.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{store.owner?.full_name}</p>
                          <p className="text-xs text-muted-foreground">{store.owner?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kontak & Alamat</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <IconMapPin size={14} className="text-primary" />
                          <span>{store.address || "Belum ada alamat"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium italic opacity-60">
                          <IconBuildingStore size={14} />
                          <span>ID: {store.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Paket Langganan</p>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted/20 flex items-center justify-between">
                        <div>
                          <p className="font-black text-primary text-sm uppercase tracking-tighter italic">
                            {store.subscriptions?.[0]?.plan?.name || "Lite (Free)"}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground">
                            {store.subscriptions?.[0]?.status === 'active' ? 'Aktif hingga ' + new Date(store.subscriptions[0].end_date).toLocaleDateString() : 'Status: ' + (store.subscriptions?.[0]?.status || 'Inaktif')}
                          </p>
                        </div>
                        <IconCreditCard className="text-muted-foreground opacity-20" size={32} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status Operasional</p>
                      <div className="flex items-center gap-3">
                        {isSuspended ? (
                          <Badge className="bg-destructive/10 text-destructive border-none px-4 py-1.5 rounded-full font-black italic text-[10px]">SUSPENDED</Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 rounded-full font-black italic text-[10px]">AKTIF & NORMAL</Badge>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full h-8 text-[10px] font-black uppercase px-4"
                          onClick={handleToggleStatus}
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : isSuspended ? "Aktifkan" : "Suspend"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900 border border-muted/20">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <CardDescription className="text-muted-foreground font-black text-[9px] uppercase tracking-[0.3em]">Operational Control</CardDescription>
                </div>
                <CardTitle className="text-xl font-black tracking-tighter">Quick Actions</CardTitle>
              </CardHeader>

              <CardContent className="p-8 pt-0 space-y-3">
                {/* Contact Action */}
                <button className="w-full group">
                  <div className="p-4 rounded-3xl border bg-card hover:bg-primary hover:border-primary transition-all duration-300 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center text-primary group-hover:text-white transition-colors">
                        <IconMail size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold group-hover:text-white transition-colors text-sm">Hubungi Pemilik</p>
                        <p className="text-[10px] text-muted-foreground group-hover:text-white/70 transition-colors font-medium">Kirim email resmi</p>
                      </div>
                    </div>
                    <IconArrowRight size={20} className="text-muted-foreground group-hover:text-white transition-all group-hover:translate-x-1" />
                  </div>
                </button>

                {/* Billing Action */}
                <button className="w-full group">
                  <div className="p-4 rounded-3xl border bg-card hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-500/10 group-hover:bg-white/20 flex items-center justify-center text-blue-500 group-hover:text-white transition-colors">
                        <IconCalendar size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold group-hover:text-white transition-colors text-sm">Riwayat Langganan</p>
                        <p className="text-[10px] text-muted-foreground group-hover:text-white/70 transition-colors font-medium">Log perpanjangan paket</p>
                      </div>
                    </div>
                    <IconArrowRight size={20} className="text-muted-foreground group-hover:text-white transition-all group-hover:translate-x-1" />
                  </div>
                </button>

                {/* Status Action */}
                <button 
                  onClick={handleToggleStatus}
                  disabled={isLoading}
                  className="w-full group"
                >
                  <div className={`p-4 rounded-3xl border transition-all duration-300 flex items-center justify-between shadow-sm ${
                    isSuspended 
                      ? 'bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-600 hover:border-emerald-600' 
                      : 'bg-destructive/5 border-destructive/10 hover:bg-destructive hover:border-destructive'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                        isSuspended 
                          ? 'bg-emerald-500/10 text-emerald-600 group-hover:bg-white/20 group-hover:text-white' 
                          : 'bg-destructive/10 text-destructive group-hover:bg-white/20 group-hover:text-white'
                      }`}>
                        {isLoading ? <IconLoader2 size={24} className="animate-spin" /> : isSuspended ? <IconCheck size={24} /> : <IconBan size={24} />}
                      </div>
                      <div className="text-left">
                        <p className={`font-bold transition-colors text-sm ${
                          isSuspended ? 'text-emerald-600 group-hover:text-white' : 'text-destructive group-hover:text-white'
                        }`}>
                          {isSuspended ? "Reactivate Outlet" : "Suspend Outlet"}
                        </p>
                        <p className={`text-[10px] font-medium transition-colors ${
                          isSuspended ? 'text-emerald-600/60 group-hover:text-white/70' : 'text-destructive/60 group-hover:text-white/70'
                        }`}>
                          {isSuspended ? "Kembalikan akses penuh" : "Batasi akses sementara"}
                        </p>
                      </div>
                    </div>
                    <IconArrowRight size={20} className={`transition-all group-hover:translate-x-1 ${
                      isSuspended ? 'text-emerald-600 group-hover:text-white' : 'text-destructive group-hover:text-white'
                    }`} />
                  </div>
                </button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="outline-none">
          <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900 border border-muted/20">
            <CardHeader className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black tracking-tight">Katalog Produk</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Daftar item yang dijual oleh outlet ini</CardDescription>
              </div>
              <div className="relative w-full md:w-64 group">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Cari produk..." 
                  className="pl-9 rounded-xl bg-muted/50 border-none focus-visible:ring-primary h-10"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 border-none">
                    <TableHead className="pl-8 py-5 font-black uppercase text-[10px] tracking-widest">Produk</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Kategori</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Harga Jual</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Stok</TableHead>
                    <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p) => (
                    <TableRow key={p.id} className="border-b border-muted/20 hover:bg-muted/5 transition-colors group">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center font-bold text-primary">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name} className="h-full w-full object-cover rounded-xl" />
                            ) : (
                              p.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm tracking-tight">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{p.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-lg px-2 py-0.5 border-muted-foreground/20 text-[10px] font-bold">
                          {p.category?.name || 'Uncategorized'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-sm">{formatCurrency(p.price)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <p className={`text-xs font-black ${p.stock_quantity <= 5 ? 'text-destructive' : 'text-emerald-600'}`}>
                            {p.stock_quantity} unit
                          </p>
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${p.stock_quantity <= 5 ? 'bg-destructive' : 'bg-emerald-500'}`} 
                              style={{ width: `${Math.min((p.stock_quantity / 100) * 100, 100)}%` }} 
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                          <IconDotsVertical size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-48 text-center">
                        <p className="text-xs font-bold text-muted-foreground italic">Tidak ada produk ditemukan.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="outline-none">
          <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900 border border-muted/20">
            <CardHeader className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black tracking-tight">Riwayat Transaksi</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">50 transaksi terakhir dari outlet ini</CardDescription>
              </div>
              <div className="relative w-full md:w-64 group">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Cari transaksi..." 
                  className="pl-9 rounded-xl bg-muted/50 border-none focus-visible:ring-primary h-10"
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 border-none">
                    <TableHead className="pl-8 py-5 font-black uppercase text-[10px] tracking-widest">ID / Waktu</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Pelanggan</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Pembayaran</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Total</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="border-b border-muted/20 hover:bg-muted/5 transition-colors group">
                      <TableCell className="pl-8 py-5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-xs font-mono uppercase">#{tx.id.slice(0, 8)}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase">
                            {new Date(tx.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                            {tx.customers?.name?.charAt(0) || "U"}
                          </div>
                          <p className="text-xs font-bold">{tx.customers?.name || "Guest"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-tighter rounded-lg">
                          {tx.payment_method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-black text-sm">{formatCurrency(tx.total_amount)}</TableCell>
                      <TableCell>
                        {tx.status === 'Berhasil' ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-black italic rounded-full px-3">PAID</Badge>
                        ) : tx.status === 'Dibatalkan' ? (
                          <Badge className="bg-destructive/10 text-destructive border-none text-[9px] font-black italic rounded-full px-3">CANCELLED</Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-600 border-none text-[9px] font-black italic rounded-full px-3">PENDING</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="sm" className="rounded-xl h-8 font-black text-[10px] uppercase hover:bg-primary/10 hover:text-primary">Detail</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center">
                        <p className="text-xs font-bold text-muted-foreground italic">Tidak ada transaksi ditemukan.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="outline-none">
          <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900 border border-muted/20">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black tracking-tight">Anggota Tim & Staff</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">User yang memiliki akses ke outlet ini</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {store.members?.map((member: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-muted/20 border border-muted/10 hover:border-primary/20 transition-all group">
                  <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-lg font-black group-hover:scale-110 transition-transform">
                    {member.user?.full_name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{member.user?.full_name}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase h-5 px-1.5 rounded-md">
                        {member.role}
                      </Badge>
                      <p className="text-[9px] text-muted-foreground truncate">{member.user?.email}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!store.members || store.members.length === 0) && (
                <div className="col-span-full py-12 text-center border-2 border-dashed rounded-[2.5rem] bg-muted/5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-30">No staff found for this store</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
