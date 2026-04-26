import { redirect } from "next/navigation"
import { getActiveStoreId, getStores } from "@/lib/store-actions"
import { getStoreStaff } from "@/lib/staff-actions"
import { BroadcastClient } from "./broadcast-client"

export default async function BroadcastPage() {
  const activeStoreId = await getActiveStoreId()
  const stores = await getStores()
  
  if (!activeStoreId) {
    redirect("/select-store")
  }

  const activeStore = stores.find(s => s.id === activeStoreId)
  const userRole = (activeStore as any)?.store_members?.[0]?.role

  // Security: Only Owner can access broadcast
  if (userRole !== "Owner") {
    redirect("/dashboard")
  }

  const staff = await getStoreStaff(activeStoreId)

  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Broadcast Center</h1>
        <p className="text-muted-foreground">Kirim pengumuman atau instruksi ke seluruh staf toko Anda.</p>
      </div>
      
      <BroadcastClient storeId={activeStoreId} staff={staff} />
    </main>
  )
}
