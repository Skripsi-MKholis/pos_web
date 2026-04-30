import * as React from "react"
import { 
  IconUsers, 
  IconUserShield, 
  IconMail, 
  IconDotsVertical,
  IconSearch,
  IconFilter,
  IconLock,
  IconKey
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { createClient } from "@/lib/supabase/server"

export default async function AdminUsersPage() {
  const supabase = await createClient()
  
  // Fetch all users
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight">Manajemen User</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Kelola akses dan hak istimewa seluruh pengguna sistem</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64 group">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Cari user berdasarkan email..." 
              className="pl-9 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
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
              {users?.map((user) => (
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
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary" title="Assign as Admin">
                        <IconKey size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive" title="Ban User">
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
        </CardContent>
      </Card>
    </div>
  )
}
