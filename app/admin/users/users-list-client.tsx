"use client"

import * as React from "react"
import { 
  IconUserShield, 
  IconMail, 
  IconDotsVertical,
  IconKey,
  IconLock,
  IconSearch,
  IconArrowsSort,
  IconUser,
  IconCalendar,
  IconBuildingStore,
  IconInfoCircle,
  IconChevronRight,
  IconUserCheck,
  IconUserX
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { updateUserAdminStatus } from "@/lib/admin-actions"

type SortField = 'full_name' | 'email' | 'created_at'
type SortOrder = 'asc' | 'desc'

export function UsersListClient({ users, currentUserId }: { users: any[], currentUserId?: string }) {
  console.log("DEBUG: Admin Users Data:", users)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortField, setSortField] = React.useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc')
  const [selectedUser, setSelectedUser] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState<string | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    setIsLoading(userId)
    try {
      const result = await updateUserAdminStatus(userId, !currentStatus)
      if (result.success) {
        toast.success(`Akses ${!currentStatus ? 'Super Admin' : 'Standard'} berhasil diberikan ke ${selectedUser?.full_name || 'user'}.`)
        // Update local state if needed or refresh
      } else {
        toast.error(result.error || "Gagal mengubah status admin.")
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.")
    } finally {
      setIsLoading(null)
      setSelectedUser(null)
    }
  }

  const filteredUsers = React.useMemo(() => {
    return users
      .filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1
        if (sortField === 'created_at') {
          return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * factor
        }
        return (a[sortField] || '').localeCompare(b[sortField] || '') * factor
      })
  }, [users, searchTerm, sortField, sortOrder])

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="p-6 pb-2">
        <div className="relative group max-w-md">
          <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Cari nama atau email pengguna..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            <TableHead 
              className="py-6 pl-8 font-black uppercase text-[10px] tracking-widest cursor-pointer group"
              onClick={() => handleSort('full_name')}
            >
              <div className="flex items-center gap-2">
                PENGGUNA
                <IconArrowsSort size={12} className={`transition-opacity ${sortField === 'full_name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
              </div>
            </TableHead>
            <TableHead 
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer group"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center gap-2">
                EMAIL
                <IconArrowsSort size={12} className={`transition-opacity ${sortField === 'email' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
              </div>
            </TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest">
              TOKO / OUTLET
            </TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">
              HAK AKSES
            </TableHead>
            <TableHead 
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer group"
              onClick={() => handleSort('created_at')}
            >
              <div className="flex items-center gap-2">
                TERDAFTAR
                <IconArrowsSort size={12} className={`transition-opacity ${sortField === 'created_at' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
              </div>
            </TableHead>
            <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">OPSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? filteredUsers.map((user) => (
            <TableRow 
              key={user.id} 
              className="border-b border-muted/20 hover:bg-muted/5 transition-all group cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <TableCell className="py-5 pl-8">
                <div className="flex items-center gap-4">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${user.is_admin ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm tracking-tight">{user.full_name || "Tanpa Nama"}</div>
                    <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5 italic">
                      <div className={`h-1.5 w-1.5 rounded-full ${user.is_admin ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'}`} />
                      {user.role || "User"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-xs font-bold opacity-70">
                  <IconMail size={14} className="text-muted-foreground" />
                  {user.email}
                </div>
              </TableCell>
              <TableCell>
                {user.store ? (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <IconBuildingStore size={12} />
                    </div>
                    <span className="text-xs font-bold tracking-tight">
                      {Array.isArray(user.store) ? user.store[0]?.name : user.store?.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground italic opacity-40 uppercase tracking-widest">Bebas Tugas</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {user.is_admin ? (
                  <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] uppercase px-3 py-1 rounded-full italic tracking-tighter">
                    Super Admin
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground border-muted/50 font-black text-[9px] uppercase px-3 py-1 rounded-full tracking-tighter bg-transparent">
                    Standard
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <IconCalendar size={14} className="opacity-40" />
                  {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </TableCell>
              <TableCell className="text-right pr-8">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <IconChevronRight size={18} />
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={6} className="py-32 text-center">
                <div className="flex flex-col items-center gap-3 opacity-20">
                  <IconSearch size={48} />
                  <p className="font-black uppercase tracking-widest text-xs">User tidak ditemukan</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* User Detail Modal - Vertical Style */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="rounded-[3rem] max-w-xl border-none shadow-2xl p-0 overflow-hidden bg-background flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
             
             <div className="relative flex items-center gap-6">
                <div className="h-20 w-20 rounded-[2rem] bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-3xl font-black shadow-2xl">
                  {selectedUser?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-black tracking-tight leading-none">
                    {selectedUser?.full_name}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <DialogDescription className="bg-white/20 border-none text-white font-bold text-[10px] uppercase tracking-widest backdrop-blur-md px-3 py-1 rounded-full italic">
                      {selectedUser?.is_admin ? "SUPER ADMIN" : "STANDARD USER"}
                    </DialogDescription>
                  </div>
                </div>
             </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-muted/5">
             <div className="space-y-8">
                {/* Section 1: Profil */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 px-1">
                      <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                         <IconInfoCircle size={14} />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Profil & Akses</h4>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-[2rem] bg-background border border-muted/50 space-y-1">
                         <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Email Terverifikasi</p>
                         <div className="flex items-center gap-2">
                            <IconMail size={14} className="text-primary" />
                            <p className="font-bold text-sm">{selectedUser?.email}</p>
                         </div>
                      </div>
                      <div className="p-5 rounded-[2rem] bg-background border border-muted/50 space-y-1">
                         <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Sistem Role</p>
                         <p className="font-bold text-sm capitalize">{selectedUser?.role || "Member"}</p>
                      </div>
                      <div className="col-span-2 p-5 rounded-[2.5rem] bg-background border border-muted/50 space-y-1">
                         <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Penugasan Toko</p>
                         {selectedUser?.store ? (
                           <div className="flex items-center gap-3 pt-1">
                              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                 <IconBuildingStore size={20} />
                              </div>
                              <div className="space-y-0.5">
                                 <p className="text-sm font-black tracking-tight">
                                   {Array.isArray(selectedUser.store) ? selectedUser.store[0]?.name : selectedUser.store?.name}
                                 </p>
                                 <p className="text-[10px] text-muted-foreground font-bold italic uppercase tracking-tighter">Aktif sebagai {selectedUser.role}</p>
                              </div>
                           </div>
                         ) : (
                           <p className="text-sm font-bold text-muted-foreground italic py-2 opacity-50">Tidak terhubung ke toko manapun</p>
                         )}
                      </div>
                   </div>
                </div>

                {/* Section 2: Administrasi */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 px-1">
                      <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                         <IconKey size={14} />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Hak Istimewa Admin</h4>
                   </div>
                   <div className="p-6 rounded-[2.5rem] border-2 border-dashed border-muted/50 bg-muted/20 space-y-4">
                      <div className="space-y-2">
                         <p className="text-xs font-black tracking-tight leading-snug">
                            Status Admin saat ini: <span className={selectedUser?.is_admin ? 'text-primary' : 'text-muted-foreground'}>
                              {selectedUser?.is_admin ? 'AKTIF' : 'NON-AKTIF'}
                            </span>
                         </p>
                         <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                           {selectedUser?.is_admin 
                             ? "User ini memiliki akses penuh ke seluruh fitur administratif sistem. Harap berhati-hati saat mencabut akses ini."
                             : "User ini hanya memiliki akses standar. Anda dapat memberikan hak istimewa Super Admin untuk manajemen sistem."}
                         </p>
                      </div>
                      <Button 
                        disabled={selectedUser?.id === currentUserId || isLoading === selectedUser?.id}
                        className={`w-full h-12 rounded-2xl font-black text-xs shadow-xl transition-all active:scale-95 ${selectedUser?.is_admin ? 'bg-destructive hover:bg-destructive/90 shadow-destructive/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
                        onClick={() => handleToggleAdmin(selectedUser.id, selectedUser.is_admin)}
                      >
                         {isLoading === selectedUser?.id ? (
                            <div className="flex items-center gap-2">
                               <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                               MEMPROSES...
                            </div>
                         ) : (
                            <>
                              {selectedUser?.is_admin ? (
                                <><IconUserX size={18} className="mr-2" /> CABUT AKSES ADMIN</>
                              ) : (
                                <><IconUserCheck size={18} className="mr-2" /> BERIKAN AKSES ADMIN</>
                              )}
                            </>
                         )}
                      </Button>
                   </div>
                </div>
             </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-muted/50 flex justify-end shrink-0 bg-background">
             <Button 
              variant="outline" 
              className="rounded-2xl px-10 font-bold h-12 text-xs border-muted-foreground/20 hover:bg-muted" 
              onClick={() => setSelectedUser(null)}
             >
                Tutup Profil
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
