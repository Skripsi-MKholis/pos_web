import * as React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getReservations } from "@/lib/reservation-actions"
import { getTables } from "@/lib/table-actions"
import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { ReservationsClient } from "./reservations-client"
import { FeatureGate } from "@/components/dashboard/feature-gate"

export default async function ReservationsPage() {
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

  const [reservations, tablesRes] = await Promise.all([
    getReservations(activeStoreId),
    getTables(activeStoreId)
  ])

  const tables = (tablesRes as any).tables || []

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <FeatureGate feature="reservations" storeId={activeStoreId}>
        <ReservationsClient 
          initialReservations={reservations} 
          tables={tables} 
          storeId={activeStoreId}
        />
      </FeatureGate>
    </div>
  )
}
