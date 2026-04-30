import * as React from "react"
import { 
  IconCreditCard, 
  IconEdit, 
  IconCheck, 
  IconX,
  IconPlus,
  IconArrowRight,
  IconInfoCircle
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"

import { PlansListClient } from "./plans-list-client"

export default async function AdminPlansPage() {
  const supabase = await createClient()
  
  // Fetch all plans
  const { data: plans, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price', { ascending: true })

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight">Manajemen Paket</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Konfigurasi harga, limitasi, dan fitur paket langganan</p>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20">
          <IconPlus size={18} className="mr-2" />
          Tambah Paket Baru
        </Button>
      </div>

      <PlansListClient plans={plans || []} />

      <Card className="rounded-[2.5rem] border-2 border-dashed border-primary/20 bg-primary/5 overflow-hidden">
        <CardContent className="p-8 flex items-center gap-6">
          <div className="h-16 w-16 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
             <IconInfoCircle size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tight italic uppercase">Tips Admin</h3>
            <p className="text-sm text-muted-foreground">
              Perubahan pada paket langganan akan segera berdampak pada seluruh toko yang menggunakan paket tersebut. Gunakan fitur "Edit Konfigurasi" dengan hati-hati terutama saat mengubah harga atau limitasi transaksi.
            </p>
          </div>
          <Button className="ml-auto rounded-xl" variant="secondary">Pelajari Selengkapnya</Button>
        </CardContent>
      </Card>
    </div>
  )
}
