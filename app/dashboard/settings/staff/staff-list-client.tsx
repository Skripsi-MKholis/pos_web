"use client"

import * as React from "react"
import { 
  IconUserPlus, 
  IconTrash, 
  IconShieldCheck, 
  IconUser,
  IconSearch,
  IconShieldLock,
  IconCopy,
  IconRefresh,
  IconTicket,
  IconEdit
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  addStaffByEmail, 
  removeStaff, 
  refreshStoreInviteCode,
  updateStaffRole
} from "@/lib/staff-actions"
import { Card, CardContent } from "@/components/ui/card"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
// Imports consolidated above

export function StaffListClient({ 
  initialData, 
  storeId, 
  inviteCode: initialInviteCode,
  currentUserId
}: { 
  initialData: any[], 
  storeId: string,
  inviteCode?: string,
  currentUserId?: string
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [inviteCode, setInviteCode] = React.useState(initialInviteCode)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [editingMember, setEditingMember] = React.useState<{id: string, name: string, role: "Owner" | "Karyawan"} | null>(null)
  const [deletingMember, setDeletingMember] = React.useState<{id: string, name: string} | null>(null)
  const [isRefreshCodeDialogOpen, setIsRefreshCodeDialogOpen] = React.useState(false)

  const filteredStaff = initialData.filter(m => {
    if (!searchQuery) return true
    return m.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.users?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  async function handleAddStaff(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const role = formData.get("role") as "Owner" | "Karyawan"

    const result = await addStaffByEmail(storeId, email, role)
    setIsLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Staf berhasil ditambahkan")
      setIsAddDialogOpen(false)
    }
  }

  async function confirmRemove() {
    if (!deletingMember) return
    
    setIsLoading(true)
    const result = await removeStaff(deletingMember.id)
    setIsLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Staf telah dihapus")
      setDeletingMember(null)
    }
  }

  async function handleUpdateRole(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editingMember) return
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const role = formData.get("role") as "Owner" | "Karyawan"

    const result = await updateStaffRole(editingMember.id, role)
    setIsLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Peran staf berhasil diperbarui")
      setEditingMember(null)
    }
  }

  async function confirmRefreshCode() {
    setIsLoading(true)
    const result = await refreshStoreInviteCode(storeId)
    setIsLoading(false)
    if (result.success) {
      setInviteCode(result.code)
      toast.success("Kode undangan diperbarui")
    } else {
      toast.error(result.error || "Gagal memperbarui kode")
    }
    setIsRefreshCodeDialogOpen(false)
  }

  function copyCode() {
    if (!inviteCode) return
    navigator.clipboard.writeText(inviteCode)
    toast.success("Kode berhasil disalin!")
  }

  return (
    <div className="space-y-6">
      {/* Invite Code Card */}
      <Card className="rounded-[2rem] border-none bg-primary/5 overflow-hidden">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
              <IconTicket size={30} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tight">Cepat & Mudah</h3>
              <p className="text-xs text-muted-foreground">Berikan kode ini kepada staf agar mereka bisa bergabung sendiri.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="bg-background border rounded-2xl px-6 h-14 flex items-center justify-center font-black text-2xl tracking-[0.2em] min-w-[160px] shadow-inner font-mono text-primary">
              {inviteCode || "---- ----"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-primary/20 hover:bg-primary/5" onClick={copyCode}>
                <IconCopy size={22} />
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-primary/20 hover:bg-primary/5" onClick={() => setIsRefreshCodeDialogOpen(true)} disabled={isLoading}>
                <IconRefresh size={22} className={isLoading ? "animate-spin" : ""} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama atau email staf..." 
            className="pl-9 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20">
              <IconUserPlus className="mr-2 h-4 w-4" />
              Tambah Staf
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <form onSubmit={handleAddStaff}>
              <DialogHeader>
                <DialogTitle>Tambah Staf Baru</DialogTitle>
                <DialogDescription>
                  Masukkan alamat email pengguna yang sudah terdaftar di POS System.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Pengguna</Label>
                  <Input id="email" name="email" type="email" placeholder="karyawan@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role / Peran</Label>
                  <Select name="role" defaultValue="Karyawan">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Karyawan" className="rounded-lg">Karyawan (Kasir)</SelectItem>
                      <SelectItem value="Owner" className="rounded-lg">Owner (Akses Penuh)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isLoading}>Batal</Button>
                <Button type="submit" disabled={isLoading} className="rounded-xl">
                  {isLoading ? "Memproses..." : "Tambahkan Staf"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
          <DialogContent className="rounded-2xl">
            <form onSubmit={handleUpdateRole}>
              <DialogHeader>
                <DialogTitle>Edit Peran Staf</DialogTitle>
                <DialogDescription>
                  Ubah hak akses untuk {editingMember?.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role / Peran</Label>
                  {/* use a key on defaultValue so it re-renders correctly when editing a new member */}
                  {editingMember && (
                    <Select name="role" defaultValue={editingMember.role}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Karyawan" className="rounded-lg">Karyawan (Kasir)</SelectItem>
                        <SelectItem value="Owner" className="rounded-lg">Owner (Akses Penuh)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingMember(null)} disabled={isLoading}>Batal</Button>
                <Button type="submit" disabled={isLoading} className="rounded-xl">
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deletingMember}
          onOpenChange={(open) => !open && setDeletingMember(null)}
          title="Hapus Staf"
          description={<>Apakah Anda yakin ingin menghapus <strong>{deletingMember?.name}</strong> dari toko ini? Mereka akan segera kehilangan akses ke kasir, pesanan, dan laporan operasional.</>}
          onConfirm={confirmRemove}
          isLoading={isLoading}
        />
        <ConfirmDialog
          open={isRefreshCodeDialogOpen}
          onOpenChange={setIsRefreshCodeDialogOpen}
          title="Perbarui Kode Undangan"
          description="Buat ulang kode undangan? Kode lama tidak akan bisa digunakan lagi oleh calon staf."
          onConfirm={confirmRefreshCode}
          isLoading={isLoading}
        />
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nama & Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  Belum ada staf yang terdaftar
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <IconUser size={20} />
                      </div>
                      <div>
                        <div className="font-bold">{member.users?.full_name || member.users?.email?.split('@')[0] || "Staf"}</div>
                        <div className="text-xs text-muted-foreground">{member.users?.email || "-"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.role === "Owner" ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3">
                        <IconShieldCheck size={14} className="mr-1" />
                        Owner
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3">
                        <IconShieldLock size={14} className="mr-1" />
                        Kasir
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-primary hover:bg-primary/10 rounded-full h-8 w-8"
                        onClick={() => setEditingMember({
                          id: member.id,
                          name: member.users?.full_name || member.users?.email?.split('@')[0] || "Staf",
                          role: member.role as "Owner" | "Karyawan"
                        })}
                        disabled={isLoading || member.users?.id === currentUserId}
                        title={member.users?.id === currentUserId ? "Tidak dapat mengedit peran sendiri" : "Edit peran staf"}
                      >
                        <IconEdit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                        onClick={() => setDeletingMember({
                          id: member.id,
                          name: member.users?.full_name || member.users?.email?.split('@')[0] || "Staf"
                        })}
                        disabled={member.role === "Owner" || isLoading || member.users?.id === currentUserId}
                        title={member.users?.id === currentUserId ? "Tidak dapat menghapus diri sendiri" : "Hapus staf"}
                      >
                        <IconTrash size={16} />
                      </Button>
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
