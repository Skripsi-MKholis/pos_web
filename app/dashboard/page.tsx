import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { getDashboardMetrics, getSalesChartData } from "@/lib/transaction-actions"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/setup")
  }

  const activeStoreIdFromCookie = await getActiveStoreId()
  const activeStoreId = activeStoreIdFromCookie || stores[0].id
  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0]

  const [metrics, chartData] = await Promise.all([
    getDashboardMetrics(activeStoreId),
    getSalesChartData(activeStoreId, 30)
  ])

  return (
    <DashboardClient 
      user={user}
      activeStore={activeStore}
      metrics={metrics}
      chartData={chartData}
    />
  )
}
