import * as React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getReservations } from "@/lib/reservation-actions"
import { getTables } from "@/lib/table-actions"
import { ReservationsClient } from "./reservations-client"
import { FeatureGate } from "@/components/dashboard/feature-gate"

export default async function ReservationsPage() {
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
    .maybeSingle()

  if (!staff || !staff.stores) {
    redirect("/dashboard")
  }

  const store = staff.stores as any
  const [reservations, tablesRes] = await Promise.all([
    getReservations(store.id),
    getTables(store.id)
  ])

  const tables = (tablesRes as any).tables || []

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <FeatureGate feature="reservations" storeId={store.id}>
        <ReservationsClient 
          initialReservations={reservations} 
          tables={tables} 
          storeId={store.id} 
        />
      </FeatureGate>
    </div>
  )
}
