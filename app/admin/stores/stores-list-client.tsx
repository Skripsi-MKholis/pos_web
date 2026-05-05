"use client"

import * as React from "react"
import Link from "next/link"
import { 
  IconBuildingStore, 
  IconCreditCard, 
  IconDotsVertical,
  IconBan,
  IconCheck,
  IconSearch,
  IconFilter,
  IconEye,
  IconCalendar,
  IconUser,
  IconUsers,
  IconMail,
  IconPhone,
  IconArrowsSort,
  IconInfoCircle
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { updateStoreStatus } from "@/lib/admin-actions"

export function StoresListClient({ stores }: { stores: any[] }) {
  const [isLoading, setIsLoading] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStore, setSelectedStore] = React.useState<any>(null)
  const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  // Sorting Logic
  const sortedStores = React.useMemo(() => {
    let items = [...stores]
    if (sortConfig !== null) {
      items.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]
        
        if (sortConfig.key === 'owner') {
          aValue = a.owner?.full_name || ""
          bValue = b.owner?.full_name || ""
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return items
  }, [stores, sortConfig])

  // Filtering Logic
  const filteredStores = sortedStores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.owner?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handleToggleStatus = async (storeId: string, isCurrentlySuspended: boolean) => {
    setIsLoading(storeId)
    const result = await updateStoreStatus(storeId, isCurrentlySuspended)
    setIsLoading(null)

    if (result.success) {
      toast.success(`Toko berhasil ${isCurrentlySuspended ? 'diaktifkan kembali' : 'dinonaktifkan'}.`)
    } else {
      toast.error(result.error || "Gagal mengubah status toko.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-8 pt-6">
        <div className="relative w-full md:w-96 group">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Cari toko atau owner..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-dashed">
            <IconFilter size={18} className="mr-2" />
            Filter Status
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 border-none hover:bg-muted/50">
            <TableHead className="py-6 pl-8">
              <button 
                className="flex items-center gap-1 font-black uppercase text-[10px] tracking-widest hover:text-primary transition-colors"
                onClick={() => requestSort('name')}
              >
                Toko & Alamat
                <IconArrowsSort size={12} className="opacity-50" />
              </button>
            </TableHead>
            <TableHead>
              <button 
                className="flex items-center gap-1 font-black uppercase text-[10px] tracking-widest hover:text-primary transition-colors"
                onClick={() => requestSort('owner')}
              >
                Owner
                <IconArrowsSort size={12} className="opacity-50" />
              </button>
            </TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest">Paket</TableHead>
            <TableHead>
              <button 
                className="flex items-center gap-1 font-black uppercase text-[10px] tracking-widest hover:text-primary transition-colors"
                onClick={() => requestSort('created_at')}
              >
                Tgl Dibuat
                <IconArrowsSort size={12} className="opacity-50" />
              </button>
            </TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
            <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStores.map((store) => {
            const sub = store.subscriptions?.[0]
            const planName = sub?.plan?.name || "Lite (Free)"
            const isSuspended = store.settings?.is_suspended === true

            return (
              <TableRow key={store.id} className="border-b border-muted/20 hover:bg-muted/5 transition-colors group">
                <TableCell className="py-6 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-sm">
                      {store.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-base tracking-tight">{store.name}</div>
                      <div className="text-[10px] text-muted-foreground line-clamp-1 italic max-w-[200px]">{store.address || "Tidak ada alamat"}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-bold text-sm">{store.owner?.full_name || "Unknown"}</div>
                    <div className="text-[10px] text-muted-foreground font-medium">{store.owner?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-lg px-2.5 py-0.5 bg-primary/5 text-primary border-none font-bold text-[10px]">
                    {planName}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {new Date(store.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </TableCell>
                <TableCell>
                  {isSuspended ? (
                    <Badge className="bg-destructive/10 text-destructive border-none text-[10px] font-black italic">SUSPENDED</Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-black italic">AKTIF</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/stores/${store.id}`}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                        title="Lihat Detail"
                      >
                        <IconEye size={18} />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90 ${isLoading === store.id ? 'animate-pulse' : ''}`}
                      onClick={() => handleToggleStatus(store.id, isSuspended)}
                      disabled={isLoading === store.id}
                      title={isSuspended ? "Aktifkan" : "Suspend"}
                    >
                      {isSuspended ? <IconCheck size={18} className="text-emerald-500" /> : <IconBan size={18} className="text-destructive" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
          {filteredStores.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center">
                    <IconBuildingStore size={32} className="opacity-20" />
                  </div>
                  <p className="font-bold italic text-sm">Tidak ada toko yang ditemukan.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Ultra Wide Scrollable Store Detail Modal */}
      <Dialog open={!!selectedStore} onOpenChange={(open) => !open && setSelectedStore(null)}>
        <DialogContent className="rounded-[3rem] max-w-4xl border-none shadow-2xl p-0 overflow-hidden bg-background flex flex-col max-h-[90vh]">
          {/* Fixed Header */}
          <div className="bg-primary p-6 text-primary-foreground relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
             
             <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-5">
                   <div className="h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-2xl font-black shadow-xl">
                     {selectedStore?.name?.charAt(0).toUpperCase()}
                   </div>
                   <div className="space-y-0.5">
                     <DialogTitle className="text-2xl font-black tracking-tighter leading-none">
                       {selectedStore?.name}
                     </DialogTitle>
                     <div className="flex items-center gap-2">
                       <DialogDescription className="bg-white/20 border-none text-white font-bold text-[9px] uppercase tracking-widest backdrop-blur-md px-2 py-0.5 rounded-full">
                         {selectedStore?.subscriptions?.[0]?.plan?.name || "Lite (Free)"}
                       </DialogDescription>
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                         ID: {selectedStore?.id}
                       </p>
                     </div>
                   </div>
                </div>
                <div className="flex gap-2">
                   {selectedStore?.settings?.is_suspended ? (
                     <Badge className="bg-destructive text-white border-none font-black italic px-4 py-1 rounded-full text-[10px] animate-pulse">SUSPENDED</Badge>
                   ) : (
                     <Badge className="bg-emerald-400 text-emerald-950 border-none font-black italic px-4 py-1 rounded-full text-[10px]">ACTIVE</Badge>
                   )}
                </div>
             </div>
          </div>

          {/* Scrollable Content Body - Vertical Layout */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-muted/5">
            <div className="max-w-2xl mx-auto space-y-6">
               {/* 1. Core Info Section */}
               <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                       <IconInfoCircle size={14} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Informasi Utama</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-4 rounded-2xl bg-background border border-muted/50 space-y-0.5 shadow-sm">
                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Tgl Bergabung</p>
                        <p className="font-bold text-sm">
                          {selectedStore && new Date(selectedStore.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                     </div>
                     <div className="p-4 rounded-2xl bg-background border border-muted/50 space-y-0.5 shadow-sm">
                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">ID System</p>
                        <p className="font-mono text-[10px] opacity-50 truncate">{selectedStore?.id}</p>
                     </div>
                     <div className="col-span-2 p-4 rounded-3xl bg-background border border-muted/50 space-y-1 shadow-sm">
                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Alamat Outlet</p>
                        <p className="text-xs italic text-muted-foreground leading-relaxed">
                          {selectedStore?.address || "Alamat outlet belum dilengkapi."}
                        </p>
                     </div>
                  </div>
               </div>

               {/* 2. Owner Info Section */}
               <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                       <IconUser size={14} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Pemilik & Kontak</h4>
                  </div>
                  <div className="p-5 rounded-[2.5rem] bg-primary/5 border border-primary/10 relative overflow-hidden group">
                     <div className="relative flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-xl shadow-primary/20 shrink-0">
                           {selectedStore?.owner?.full_name?.charAt(0)}
                        </div>
                        <div className="space-y-3 flex-1">
                           <div className="space-y-0.5">
                              <p className="text-lg font-black tracking-tight leading-none">{selectedStore?.owner?.full_name}</p>
                              <p className="text-[10px] font-bold text-primary italic uppercase tracking-tighter">Store Owner</p>
                           </div>
                           <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background/50 border border-primary/5 w-fit">
                                 <IconMail size={14} className="text-primary" />
                                 <p className="text-[11px] font-bold">{selectedStore?.owner?.email}</p>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background/50 border border-primary/5 w-fit opacity-50 italic">
                                 <IconPhone size={14} className="text-primary" />
                                 <p className="text-[11px] font-bold">No Phone</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 3. Staffing Section */}
               <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                       <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <IconUsers size={14} />
                       </div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Daftar Karyawan</h4>
                    </div>
                    <Badge variant="secondary" className="rounded-lg h-6 px-3 text-[9px] font-black bg-primary/10 text-primary border-none">
                     {selectedStore?.members?.length || 0} Members
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                     {selectedStore?.members?.length > 0 ? (
                        selectedStore.members.map((member: any, i: number) => (
                           <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-background border border-muted/50 hover:border-primary/30 transition-all group">
                              <div className="flex items-center gap-3">
                                 <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-[10px] font-black group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {member.user?.full_name?.charAt(0)}
                                 </div>
                                 <div className="space-y-0.5">
                                    <p className="text-xs font-black leading-none">{member.user?.full_name}</p>
                                    <p className="text-[9px] text-muted-foreground truncate w-48">{member.user?.email}</p>
                                 </div>
                              </div>
                              <Badge variant="outline" className="text-[8px] font-black uppercase rounded-lg px-2 h-5 bg-muted/20">
                                {member.role}
                              </Badge>
                           </div>
                        ))
                     ) : (
                       <div className="py-12 text-center border-2 border-dashed rounded-[2.5rem] bg-muted/5">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-30">No staff detected</p>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-8 pt-6 border-t border-muted/50 flex justify-end gap-3 shrink-0 bg-muted/5">
             <Button 
              variant="outline" 
              className="rounded-2xl px-8 font-bold h-12 text-xs border-muted-foreground/20 hover:bg-muted" 
              onClick={() => setSelectedStore(null)}
             >
                Tutup Panel
             </Button>
             <Button 
              className={`rounded-2xl px-10 font-black text-white h-12 text-xs shadow-xl transition-all active:scale-95 ${selectedStore?.settings?.is_suspended ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-destructive hover:bg-destructive/90 shadow-destructive/20'}`}
              onClick={() => {
                handleToggleStatus(selectedStore.id, selectedStore?.settings?.is_suspended)
                setSelectedStore(null)
              }}
             >
                {selectedStore?.settings?.is_suspended ? "AKTIFKAN SEKARANG" : "NONAKTIFKAN TOKO"}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
