import * as React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getPendingOrders } from "@/lib/kds-actions"
import { KDSClient } from "./kds-client"

export default async function KDSPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get active store
  const { data: staff } = await supabase
    .from("store_members")
    .select("store_id, stores(*)")
    .eq("user_id", user.id)
    .single()

  if (!staff || !staff.stores) {
    redirect("/dashboard")
  }

  const store = staff.stores as any
  const orders = await getPendingOrders(store.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-muted/30 min-h-screen">
      <KDSClient 
        initialOrders={orders} 
        storeId={store.id} 
      />
    </div>
  )
}
