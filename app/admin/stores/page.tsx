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

import { StoresListClient } from "./stores-list-client"

export default async function AdminStoresPage() {
  const supabase = await createClient()
  
  // Fetch all stores with their owners, subscriptions, and members
  const { data: stores, error } = await supabase
    .from('stores')
    .select(`
      *,
      owner:users!stores_owner_id_public_users_fkey (
        full_name, 
        email
      ),
      subscriptions (
        plan:subscription_plans (name, slug),
        status,
        end_date
      ),
      members:store_members (
        role,
        user:user_id (
          full_name,
          email
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("DEBUG: Error fetching stores:", error)
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">Manajemen Toko</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Kelola dan pantau seluruh outlet yang terdaftar</p>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <StoresListClient stores={stores || []} />
        </CardContent>
      </Card>
    </div>
  )
}
