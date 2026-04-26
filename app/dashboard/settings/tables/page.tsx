import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { redirect } from "next/navigation"
import { TablesClient } from "./tables-client"
import { getTables } from "@/lib/table-actions"

export default async function TablesSettingsPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const activeStoreIdFromCookie = await getActiveStoreId()
  const activeStore = stores.find(s => s.id === activeStoreIdFromCookie) || stores[0]
  
  const { tables, error } = await getTables(activeStore.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Meja</h2>
          <p className="text-muted-foreground">
            Kelola denah dan daftar meja untuk operasional restoran/kafe Anda.
          </p>
        </div>
      </div>
      <TablesClient 
        storeId={activeStore.id} 
        initialTables={tables || []} 
      />
    </div>
  )
}
