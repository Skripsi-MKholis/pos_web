import { Metadata } from "next"
import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { getTablesMonitoring } from "@/lib/table-actions"
import { TablesMonitoringClient } from "./monitoring-client"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Monitoring Meja | Kholis POS",
  description: "Monitor status meja dan pesanan aktif.",
}

export default async function TablesMonitoringPage() {
  const stores = await getStores()
  const activeStoreIdFromCookie = await getActiveStoreId()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const activeStore = stores.find(s => s.id === activeStoreIdFromCookie) || stores[0]
  const { tables, error } = await getTablesMonitoring(activeStore.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black tracking-tight uppercase">Monitoring Meja</h2>
      </div>
      
      <TablesMonitoringClient 
        initialTables={tables || []} 
        storeId={activeStore.id}
      />
    </div>
  )
}
