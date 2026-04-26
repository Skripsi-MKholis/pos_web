"use client"

import * as React from "react"
import { 
  IconPlus, 
  IconSearch, 
  IconCalendar, 
  IconClock, 
  IconUsers, 
  IconPhone, 
  IconDotsVertical,
  IconCheck,
  IconX,
  IconChevronRight,
  IconMessage2,
  IconBrandWhatsapp
} from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { 
  createReservation, 
  updateReservationStatus, 
  deleteReservation,
  ReservationStatus 
} from "@/lib/reservation-actions"

type Reservation = {
  id: string
  customer_name: string
  customer_phone: string
  reservation_date: string
  reservation_time: string
  number_of_guests: number
  status: ReservationStatus
  notes: string
  table_id: string | null
  tables?: { name: string } | null
}

export function ReservationsClient({ 
  initialReservations, 
  tables,
  storeId 
}: { 
  initialReservations: any[]
  tables: any[]
  storeId: string
}) {
  const [reservations, setReservations] = React.useState<Reservation[]>(initialReservations as any)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form State
  const [formData, setFormData] = React.useState({
    customerName: "",
    customerPhone: "",
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: "18:00",
    numberOfGuests: 2,
    tableId: "none",
    notes: ""
  })

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.customer_name.toLowerCase().includes(search.toLowerCase()) || 
                         r.customer_phone?.includes(search)
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  async function handleAdd() {
    if (!formData.customerName) {
      toast.error("Nama pelanggan wajib diisi")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createReservation({
        storeId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        reservationDate: formData.reservationDate,
        reservationTime: formData.reservationTime,
        numberOfGuests: formData.numberOfGuests,
        tableId: formData.tableId === "none" ? null : formData.tableId,
        notes: formData.notes,
        status: 'Pending'
      })

      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Reservasi berhasil dibuat")
        // In a real app we'd refresh from server or use optimistic updates
        // For now, let's just close and the server action revalidatePath will handle the sync on refresh
        // But for local state:
        const newRes = res.data![0] as any
        if (formData.tableId !== "none") {
            newRes.tables = { name: tables.find(t => t.id === formData.tableId)?.name }
        }
        setReservations([newRes, ...reservations])
        setIsAddOpen(false)
        setFormData({
          customerName: "",
          customerPhone: "",
          reservationDate: new Date().toISOString().split('T')[0],
          reservationTime: "18:00",
          numberOfGuests: 2,
          tableId: "none",
          notes: ""
        })
      }
    } catch (error) {
      toast.error("Gagal membuat reservasi")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleStatusChange(id: string, status: ReservationStatus) {
    try {
      const res = await updateReservationStatus(id, status)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Status diperbarui menjadi ${status}`)
        setReservations(reservations.map(r => r.id === id ? { ...r, status } : r))
      }
    } catch (error) {
      toast.error("Gagal memperbarui status")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus reservasi ini?")) return
    try {
      const res = await deleteReservation(id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success("Reservasi dihapus")
        setReservations(reservations.filter(r => r.id !== id))
      }
    } catch (error) {
      toast.error("Gagal menghapus reservasi")
    }
  }

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'Pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-none">Menunggu</Badge>
      case 'Confirmed': return <Badge variant="outline" className="bg-[#00C2FF]/10 text-[#00C2FF] border-[#00C2FF]/20 text-xs">Dikonfirmasi</Badge>
      case 'Completed': return <Badge className="bg-emerald-100 text-emerald-700 border-none">Selesai</Badge>
      case 'Cancelled': return <Badge variant="destructive" className="bg-rose-100 text-rose-700 border-none">Dibatalkan</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Reservasi Meja</h1>
          <p className="text-muted-foreground font-medium">Kelola ketersediaan dan pesanan tempat pelanggan</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2 rounded-2xl h-12 px-6 shadow-lg shadow-primary/20">
          <IconPlus size={20} />
          Booking Baru
        </Button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-lg shadow-primary/20"
         >
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Booking</p>
            <div className="flex items-end justify-between">
               <h3 className="text-2xl md:text-4xl font-black leading-none">{reservations.length}</h3>
               <IconCalendar size={20} className="opacity-50 hidden sm:block" />
            </div>
         </motion.div>
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-none shadow-xl ring-1 ring-foreground/5"
         >
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Menunggu</p>
            <div className="flex items-end justify-between">
               <h3 className="text-2xl md:text-4xl font-black leading-none text-yellow-600">
                  {reservations.filter(r => r.status === 'Pending').length}
               </h3>
               <IconClock size={20} className="text-yellow-600/50 hidden sm:block" />
            </div>
         </motion.div>
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-none shadow-xl ring-1 ring-foreground/5"
         >
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Dikonfirmasi</p>
            <div className="flex items-end justify-between">
               <h3 className="text-2xl md:text-4xl font-black leading-none text-[#00C2FF]">
                  {reservations.filter(r => r.status === 'Confirmed').length}
               </h3>
               <IconCheck size={20} className="text-[#00C2FF]/50 hidden sm:block" />
            </div>
         </motion.div>
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-none shadow-xl ring-1 ring-foreground/5"
         >
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Tamu</p>
            <div className="flex items-end justify-between">
               <h3 className="text-2xl md:text-4xl font-black leading-none text-primary">
                  {reservations.filter(r => r.status !== 'Cancelled').reduce((sum, r) => sum + r.number_of_guests, 0)}
               </h3>
               <IconUsers size={20} className="text-primary/50 hidden sm:block" />
            </div>
         </motion.div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-3xl backdrop-blur-md border border-white/10">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Cari nama atau telepon..." 
            className="pl-10 h-12 rounded-2xl bg-background/50 border-none ring-1 ring-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-2xl bg-background/50 border-none ring-1 ring-white/10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-none shadow-2xl">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Pending">Menunggu</SelectItem>
            <SelectItem value="Confirmed">Dikonfirmasi</SelectItem>
            <SelectItem value="Completed">Selesai</SelectItem>
            <SelectItem value="Cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LIST */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((res) => (
              <motion.div 
                key={res.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-card p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-none shadow-lg hover:shadow-2xl transition-all duration-300 ring-1 ring-foreground/5 overflow-hidden"
              >
                {/* Accent Gradient */}
                <div className={cn(
                  "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20",
                  res.status === 'Pending' ? "bg-yellow-500" : 
                  res.status === 'Confirmed' ? "bg-[#00C2FF]" :
                  res.status === 'Completed' ? "bg-emerald-500" : "bg-rose-500"
                )} />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="space-y-1">
                      <h3 className="font-black text-lg md:text-xl leading-none">{res.customer_name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] md:text-xs text-muted-foreground font-bold flex items-center gap-1">
                          <IconPhone size={12} /> {res.customer_phone || "-"}
                        </p>
                        {res.customer_phone && (
                          <a 
                            href={`https://wa.me/${res.customer_phone.replace(/^0/, '62')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            <IconBrandWhatsapp size={14} />
                          </a>
                        )}
                      </div>
                  </div>
                  <div className="scale-90 origin-top-right">
                    {getStatusBadge(res.status)}
                  </div>
                </div>

                <div className="space-y-3 relative z-10">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="bg-muted/50 p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/5 space-y-1">
                          <p className="text-[8px] md:text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Waktu</p>
                          <div className="flex items-center gap-2 text-xs md:text-sm font-black">
                            <IconCalendar size={14} className="text-primary" />
                            {new Date(res.reservation_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-muted-foreground">
                            <IconClock size={12} />
                            {res.reservation_time.substring(0, 5)}
                          </div>
                      </div>
                      <div className="bg-muted/50 p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/5 space-y-1">
                          <p className="text-[8px] md:text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Kapasitas</p>
                          <div className="flex items-center gap-2 text-xs md:text-sm font-black">
                            <IconUsers size={14} className="text-primary" />
                            {res.number_of_guests} Orang
                          </div>
                          <div className="text-[10px] md:text-xs font-bold text-muted-foreground truncate">
                            {res.tables ? res.tables.name : "Tanpa Meja"}
                          </div>
                      </div>
                    </div>

                    {res.notes && (
                      <div className="flex gap-2 p-2 md:p-3 bg-primary/5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-medium text-primary line-clamp-2">
                        <IconMessage2 size={14} className="mt-0.5 shrink-0" />
                        {res.notes}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {res.status === 'Pending' && (
                          <Button 
                            size="sm" 
                            className="flex-1 rounded-xl bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white font-bold gap-1 text-[10px] md:text-xs h-9 border-none"
                            onClick={() => handleStatusChange(res.id, 'Confirmed')}
                          >
                            <IconCheck size={14} /> Konfirmasi
                          </Button>
                      )}
                      {res.status === 'Confirmed' && (
                          <Button 
                            size="sm" 
                            className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold gap-1 text-[10px] md:text-xs h-9"
                            onClick={() => handleStatusChange(res.id, 'Completed')}
                          >
                            <IconCheck size={14} /> Selesai
                          </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-xl px-2 border-none bg-muted/50 h-9">
                            <IconDotsVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[140px]">
                          <DropdownMenuItem 
                            className="rounded-xl font-bold text-rose-600 focus:text-rose-600 cursor-pointer"
                            onClick={() => handleDelete(res.id)}
                          >
                            <IconX size={16} className="mr-2" /> Hapus
                          </DropdownMenuItem>
                          {res.status !== 'Cancelled' && (
                            <DropdownMenuItem 
                              className="rounded-xl font-bold cursor-pointer"
                              onClick={() => handleStatusChange(res.id, 'Cancelled')}
                            >
                              <IconX size={16} className="mr-2" /> Batalkan
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-16 md:py-24 text-center bg-muted/20 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-muted mx-4 sm:mx-0"
            >
              <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <IconCalendar size={24} className="md:size-32 text-muted-foreground" />
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase">Belum ada reservasi</h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium">Klik tombol "Booking Baru" untuk memulai</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] sm:w-full rounded-[2rem] sm:rounded-[3rem] border-none shadow-2xl overflow-hidden p-0 max-h-[90vh] overflow-y-auto no-scrollbar">
          <DialogHeader className="p-6 md:p-8 bg-primary text-white space-y-1">
            <DialogTitle className="text-xl md:text-2xl font-black uppercase leading-none">Booking Baru</DialogTitle>
            <DialogDescription className="text-white/70 font-medium italic text-xs md:text-sm">Catat pesanan tempat pelanggan</DialogDescription>
          </DialogHeader>

          <div className="p-6 md:p-8 space-y-4 md:space-y-5">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs md:text-sm">Nama Pelanggan</Label>
                  <Input 
                    placeholder="Contoh: Budi Sudarsono" 
                    className="rounded-xl h-11 bg-muted/50 border-none"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs md:text-sm">No. Telepon</Label>
                  <Input 
                    placeholder="0812..." 
                    className="rounded-xl h-11 bg-muted/50 border-none"
                    value={formData.customerPhone}
                    onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs md:text-sm">Tanggal</Label>
                  <Input 
                    type="date"
                    className="rounded-xl h-11 bg-muted/50 border-none text-xs md:text-sm"
                    value={formData.reservationDate}
                    onChange={e => setFormData({ ...formData, reservationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs md:text-sm">Jam</Label>
                  <Input 
                    type="time"
                    className="rounded-xl h-11 bg-muted/50 border-none text-xs md:text-sm"
                    value={formData.reservationDate === new Date().toISOString().split('T')[0] ? "" : formData.reservationTime}
                    onChange={e => setFormData({ ...formData, reservationTime: e.target.value })}
                  />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs md:text-sm">Jumlah Orang</Label>
                  <Input 
                    type="number"
                    className="rounded-xl h-11 bg-muted/50 border-none"
                    value={formData.numberOfGuests}
                    onChange={e => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs md:text-sm">Pilih Meja (Opsional)</Label>
                  <Select value={formData.tableId} onValueChange={val => setFormData({ ...formData, tableId: val })}>
                    <SelectTrigger className="rounded-xl h-11 bg-muted/50 border-none text-xs md:text-sm">
                      <SelectValue placeholder="Pilih Meja" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                      <SelectItem value="none">Tanpa Meja</SelectItem>
                      {tables.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name} ({t.capacity} org)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
             </div>

             <div className="space-y-2">
                <Label className="font-bold text-xs md:text-sm">Catatan Tambahan</Label>
                <Textarea 
                  placeholder="Misal: Rayakan ulang tahun, Alergi kacang, dll"
                  className="rounded-xl bg-muted/50 border-none min-h-[80px] text-xs md:text-sm"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
             </div>
          </div>

          <DialogFooter className="p-6 md:p-8 pt-0 flex-col sm:flex-row gap-3">
            <Button variant="ghost" className="rounded-xl font-bold w-full sm:w-auto" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button 
                className="rounded-xl px-8 font-black uppercase tracking-tight shadow-lg shadow-primary/20 w-full sm:w-auto h-11"
                onClick={handleAdd}
                disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Buat Reservasi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
