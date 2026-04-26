"use client"

import * as React from "react"
import { 
  IconUserPlus, 
  IconTrash, 
  IconShieldCheck, 
  IconUser,
  IconSearch,
  IconShieldLock
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
import { addStaffByEmail, removeStaff } from "@/lib/staff-actions"

export function StaffListClient({ initialData, storeId }: { initialData: any[], storeId: string }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredStaff = initialData.filter(m => 
    m.users.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.users.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  async function handleRemove(id: string, name: string) {
    if (!confirm(`Hapus ${name} dari toko?`)) return
    
    setIsLoading(true)
    const result = await removeStaff(id)
    setIsLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Staf telah dihapus")
    }
  }

  return (
    <div className="space-y-4">
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
                        <div className="font-bold">{member.users.full_name || "Tanpa Nama"}</div>
                        <div className="text-xs text-muted-foreground">{member.users.email}</div>
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                      onClick={() => handleRemove(member.id, member.users.full_name)}
                      disabled={member.role === "Owner" || isLoading}
                    >
                      <IconTrash size={16} />
                    </Button>
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
