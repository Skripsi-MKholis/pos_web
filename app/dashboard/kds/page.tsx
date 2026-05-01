import * as React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getPendingOrders } from "@/lib/kds-actions"
import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { KDSClient } from "./kds-client"
import { checkFeatureAccess } from "@/lib/subscription-actions"
import { FeatureGate } from "@/components/dashboard/feature-gate"

export default async function KDSPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const stores = await getStores()
  const activeId = await getActiveStoreId()
  const activeStoreId = activeId || (stores.length > 0 ? stores[0].id : null)

  if (!activeStoreId) {
    redirect("/dashboard")
  }

  const orders = await getPendingOrders(activeStoreId)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-muted/30 min-h-screen">
      <FeatureGate feature="kds" storeId={activeStoreId}>
        <KDSClient 
          initialOrders={orders} 
          storeId={activeStoreId}
        />
      </FeatureGate>
    </div>
  )
}
