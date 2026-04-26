"use client"

import * as React from "react"
import { 
  IconSearch, 
  IconPlus, 
  IconDotsVertical, 
  IconEdit, 
  IconTrash, 
  IconUser,
  IconPhone,
  IconMail
} from "@tabler/icons-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCustomer, updateCustomer, deleteCustomer } from "@/lib/customer-actions"
import { Badge } from "@/components/ui/badge"

export function CustomerTableClient({ initialData, storeId }: { initialData: any[], storeId: string }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const filteredData = initialData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.phone && item.phone.includes(searchQuery)) ||
    (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      notes: formData.get("notes") as string,
    }

    const result = await createCustomer(storeId, data)
    setIsLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Pelanggan berhasil ditambahkan")
      setIsAddDialogOpen(false)
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      notes: formData.get("notes") as string,
    }

    const result = await updateCustomer(selectedCustomer.id, data)
    setIsLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Data pelanggan diperbarui")
      setIsEditDialogOpen(false)
    }
  }

  async function handleDelete() {
    setIsLoading(true)
    const result = await deleteCustomer(selectedCustomer.id)
    setIsLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Pelanggan dihapus")
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama, No. HP, atau email..."
            className="pl-9 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="rounded-xl shadow-lg shadow-primary/20">
          <IconPlus className="mr-2 h-4 w-4" />
          Tambah Pelanggan
        </Button>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px]">Pelanggan</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Terdaftar Sejak</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Tidak ada pelanggan ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <IconUser size={20} />
                      </div>
                      <div>
                        <div className="font-bold">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {customer.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {customer.phone && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <IconPhone size={14} className="text-muted-foreground" />
                          {customer.phone}
                        </div>
                      )}
                      {customer.email && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <IconMail size={14} className="text-muted-foreground" />
                          {customer.email}
                        </div>
                      )}
                      {!customer.phone && !customer.email && <span className="text-muted-foreground">-</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {customer.notes || "-"}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs">
                    {format(new Date(customer.created_at), "d MMMM yyyy", { locale: id })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <IconDotsVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl w-40">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedCustomer(customer)
                          setIsEditDialogOpen(true)
                        }} className="rounded-lg">
                          <IconEdit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedCustomer(customer)
                          setIsDeleteDialogOpen(true)
                        }} className="text-destructive focus:text-destructive rounded-lg">
                          <IconTrash className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="rounded-2xl">
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
              <DialogDescription>Masukkan detail pelanggan atau member Anda.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Nomor HP / WhatsApp</Label>
                <Input id="phone" name="phone" placeholder="08123456789" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Catatan Tambahan</Label>
                <Textarea id="notes" name="notes" placeholder="Member loyal, alergi kacang, dll." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isLoading}>Batal</Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl">
                {isLoading ? "Menyimpan..." : "Simpan Pelanggan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-2xl">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Pelanggan</DialogTitle>
              <DialogDescription>Perbarui informasi detail pelanggan Anda.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nama Lengkap</Label>
                <Input id="edit-name" name="name" defaultValue={selectedCustomer?.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Nomor HP / WhatsApp</Label>
                <Input id="edit-phone" name="phone" defaultValue={selectedCustomer?.phone} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={selectedCustomer?.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Catatan Tambahan</Label>
                <Textarea id="edit-notes" name="notes" defaultValue={selectedCustomer?.notes} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>Batal</Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl">
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Hapus Pelanggan?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pelanggan <strong>{selectedCustomer?.name}</strong> akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="rounded-xl">
              {isLoading ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
