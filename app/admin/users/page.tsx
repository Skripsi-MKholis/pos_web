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

import { UsersListClient } from "./users-list-client"

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  
  // Fetch all users with their store information
  const { data: users, error } = await supabase
    .from('users')
    .select(`
      *,
      store:stores!users_store_id_fkey (
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("DEBUG: Error fetching admin users:", error)
  }

  return (
    <div className="flex flex-1 flex-col py-4 md:py-6 px-4 lg:px-6 space-y-8">
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
          <UsersListClient users={users || []} currentUserId={currentUser?.id} />
        </CardContent>
      </Card>
    </div>
  )
}
