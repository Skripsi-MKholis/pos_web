"use client"

import * as React from "react"
import { 
  IconUserShield, 
  IconMail, 
  IconDotsVertical,
  IconKey,
  IconLock
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
import { toast } from "sonner"
import { updateUserAdminStatus } from "@/lib/admin-actions"

export function UsersListClient({ users, currentUserId }: { users: any[], currentUserId?: string }) {
  const [isLoading, setIsLoading] = React.useState<string | null>(null)

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    setIsLoading(userId)
    const result = await updateUserAdminStatus(userId, !currentStatus)
    setIsLoading(null)

    if (result.success) {
      toast.success(`Berhasil ${currentStatus ? 'mencabut' : 'memberikan'} hak akses admin.`)
    } else {
      toast.error(result.error || "Gagal mengubah status admin.")
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 border-none hover:bg-muted/50">
          <TableHead className="py-6 pl-8 font-black uppercase text-[10px] tracking-widest">Pengguna</TableHead>
          <TableHead className="font-black uppercase text-[10px] tracking-widest">Email</TableHead>
          <TableHead className="font-black uppercase text-[10px] tracking-widest">Role Sistem</TableHead>
          <TableHead className="font-black uppercase text-[10px] tracking-widest">Tgl Bergabung</TableHead>
          <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="border-b border-muted/20 hover:bg-muted/5 transition-colors group">
            <TableCell className="py-6 pl-8">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl ${user.is_admin ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'} flex items-center justify-center font-black group-hover:scale-110 transition-transform`}>
                  {user.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-base">{user.full_name || "Tanpa Nama"}</div>
                  <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{user.role || "User"}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-sm font-medium">
                <IconMail size={16} className="text-muted-foreground" />
                {user.email}
              </div>
            </TableCell>
            <TableCell>
              {user.is_admin ? (
                <Badge className="rounded-lg px-3 py-1 bg-primary text-primary-foreground border-none font-bold uppercase text-[10px] tracking-widest italic">
                  <IconUserShield size={14} className="mr-1.5" />
                  Super Admin
                </Badge>
              ) : (
                <Badge variant="secondary" className="rounded-lg px-3 py-1 bg-muted text-muted-foreground border-none font-bold uppercase text-[10px] tracking-widest">
                  Standard User
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="text-xs font-medium text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </TableCell>
            <TableCell className="text-right pr-8">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary ${isLoading === user.id ? 'animate-pulse' : ''}`} 
                  title={user.is_admin ? "Revoke Admin" : "Assign as Admin"}
                  disabled={user.id === currentUserId || isLoading === user.id}
                  onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                >
                  <IconKey size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive" title="Ban User" disabled={user.is_admin}>
                  <IconLock size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                  <IconDotsVertical size={18} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
