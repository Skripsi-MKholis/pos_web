"use client"

import * as React from "react"
import { 
  IconPlus, 
  IconUsers, 
  IconTrash, 
  IconEdit, 
  IconArmchair,
  IconDotsVertical,
  IconCheck,
  IconX,
  IconLoader2
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createTable, updateTable, deleteTable, toggleTableStatus } from "@/lib/table-actions"
import { useRouter } from "next/navigation"

export function TablesClient({ storeId, initialTables }: { storeId: string; initialTables: any[] }) {
  const [mounted, setMounted] = React.useState(false)
  const [tables, setTables] = React.useState(initialTables)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [editingTable, setEditingTable] = React.useState<any>(null)
  
  const router = useRouter()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddTable = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      store_id: storeId,
      name: formData.get("name") as string,
      capacity: parseInt(formData.get("capacity") as string) || 2
    }

    const res = await createTable(data)
    if (res.error) {
      toast.error(res.error)
    } else {
      setTables([...tables, res.table])
      setIsAddOpen(false)
      toast.success("Meja berhasil ditambahkan")
    }
    setIsLoading(false)
  }

  const handleUpdateTable = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      capacity: parseInt(formData.get("capacity") as string) || 2
    }

    const res = await updateTable(editingTable.id, data)
    if (res.error) {
      toast.error(res.error)
    } else {
      setTables(tables.map(t => t.id === editingTable.id ? { ...t, ...data } : t))
      setIsEditOpen(false)
      toast.success("Meja berhasil diperbarui")
    }
    setIsLoading(false)
  }

  const handleDeleteTable = async (id: string) => {
    if (!confirm("Hapus meja ini?")) return
    
    const res = await deleteTable(id)
    if (res.error) {
      toast.error(res.error)
    } else {
      setTables(tables.filter(t => t.id !== id))
      toast.success("Meja berhasil dihapus")
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "available" ? "occupied" : "available"
    const res = await toggleTableStatus(id, nextStatus)
    if (res.error) {
      toast.error(res.error)
    } else {
      setTables(tables.map(t => t.id === id ? { ...t, status: nextStatus } : t))
      toast.success(`Meja set ke ${nextStatus}`)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card/50 backdrop-blur-sm border p-4 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-widest text-primary">Overview</p>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{tables.filter(t => t.status === 'available').length} Tersedia</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{tables.filter(t => t.status === 'occupied').length} Terisi</span>
             </div>
          </div>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="rounded-xl font-bold h-11 gap-2 shadow-lg shadow-primary/20">
          <IconPlus size={18} />
          Tambah Meja
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tables.map((table) => (
          <Card key={table.id} className={cn(
            "group relative overflow-hidden transition-all duration-300 border shadow-sm",
            table.status === 'available' ? 'bg-background hover:border-emerald-200' : 'bg-amber-50/30 border-amber-100'
          )}>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                  table.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-100 text-amber-600'
                )}>
                  <IconArmchair size={24} />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconDotsVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl w-40">
                    <DropdownMenuItem className="gap-2 font-medium" onClick={() => {
                        setEditingTable(table);
                        setIsEditOpen(true);
                    }}>
                      <IconEdit size={14} /> Edit Meja
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="gap-2 font-medium"
                        onClick={() => handleToggleStatus(table.id, table.status)}
                    >
                      {table.status === 'available' ? <IconCheck size={14} /> : <IconX size={14} />}
                      Set {table.status === 'available' ? 'Terisi' : 'Tersedia'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 font-medium text-destructive" onClick={() => handleDeleteTable(table.id)}>
                      <IconTrash size={14} /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-lg truncate uppercase">{table.name}</h4>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-muted/50 w-fit px-2 py-0.5 rounded-full">
                  <IconUsers size={12} />
                  Cap: {table.capacity}
                </div>
              </div>

              <div className={cn(
                "py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-tighter text-center border",
                table.status === 'available' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-amber-500 text-white border-amber-400'
              )}>
                {table.status === 'available' ? 'Tersedia' : 'Terisi'}
              </div>
            </CardContent>
          </Card>
        ))}

        {tables.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 border border-dashed rounded-3xl">
             <IconArmchair size={48} className="opacity-20 mb-4" />
             <p className="font-medium text-sm">Belum ada meja yang terdaftar</p>
             <Button variant="link" onClick={() => setIsAddOpen(true)}>Tambah Meja Pertama</Button>
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <form onSubmit={handleAddTable}>
            <DialogHeader>
              <DialogTitle>Tambah Meja Baru</DialogTitle>
              <DialogDescription>Masukkan detail meja untuk ditambahkan ke toko.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama/Nomor Meja</Label>
                <Input id="name" name="name" placeholder="Meja 01..." required autoFocus className="h-11 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Kapasitas (Orang)</Label>
                <Input id="capacity" name="capacity" type="number" defaultValue={2} min={1} required className="h-11 rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl h-11 px-6">Batal</Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl h-11 px-8 shadow-lg shadow-primary/20">
                {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Meja
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <form onSubmit={handleUpdateTable}>
            <DialogHeader>
              <DialogTitle>Edit Meja</DialogTitle>
              <DialogDescription>Perbarui informasi meja {editingTable?.name}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-6">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nama/Nomor Meja</Label>
                <Input id="edit-name" name="name" defaultValue={editingTable?.name} required autoFocus className="h-11 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-capacity">Kapasitas (Orang)</Label>
                <Input id="edit-capacity" name="capacity" type="number" defaultValue={editingTable?.capacity} min={1} required className="h-11 rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl h-11 px-6">Batal</Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl h-11 px-8 shadow-lg shadow-primary/20">
                {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
