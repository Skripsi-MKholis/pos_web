import * as React from "react"
import { 
  IconBuildingStore, 
  IconUser, 
  IconCreditCard, 
  IconDotsVertical,
  IconSearch,
  IconFilter,
  IconBan,
  IconCheck
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

export default async function AdminStoresPage() {
  const supabase = await createClient()
  
  // Fetch all stores with their owners and subscriptions
  const { data: stores, error } = await supabase
    .from('stores')
    .select(`
      *,
      owner:users!stores_owner_id_fkey (full_name, email),
      subscriptions (
        plan:subscription_plans (name, slug),
        status,
        end_date
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight">Manajemen Toko</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Kelola dan pantau seluruh outlet yang terdaftar</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64 group">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Cari toko atau owner..." 
              className="pl-9 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
            />
          </div>
          <Button variant="outline" className="rounded-xl border-dashed">
            <IconFilter size={18} className="mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-none hover:bg-muted/50">
                <TableHead className="py-6 pl-8 font-black uppercase text-[10px] tracking-widest">Toko & Alamat</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Owner</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Paket Langganan</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores?.map((store) => {
                const sub = store.subscriptions?.[0]
                const planName = sub?.plan?.name || "Lite (Free)"
                const status = sub?.status || "active"

                return (
                  <TableRow key={store.id} className="border-b border-muted/20 hover:bg-muted/5 transition-colors group">
                    <TableCell className="py-6 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                          {store.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-bold text-base">{store.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{store.address || "Tidak ada alamat"}</div>
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
                      <Badge variant="secondary" className="rounded-lg px-3 py-1 bg-primary/5 text-primary border-none font-bold">
                        <IconCreditCard size={14} className="mr-1.5" />
                        {planName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        AKTIF
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                          <IconCheck size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive">
                          <IconBan size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                          <IconDotsVertical size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {(!stores || stores.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <IconBuildingStore size={48} className="opacity-20" />
                      <p className="font-bold italic">Belum ada toko yang terdaftar di sistem.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
