import { getNotifications } from "@/lib/notification-actions"
import { getActiveStoreId } from "@/lib/store-actions"
import { NotificationsClient } from "./notifications-client"
import { redirect } from "next/navigation"

export default async function NotificationsPage() {
  const storeId = await getActiveStoreId()
  
  if (!storeId) {
    redirect("/select-store")
  }

  const notifications = await getNotifications(storeId)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Riwayat Notifikasi</h2>
          <p className="text-muted-foreground">
            Kelola semua pemberitahuan dan aktivitas operasional toko Anda.
          </p>
        </div>
      </div>
      
      <NotificationsClient storeId={storeId} initialData={notifications} />
    </div>
  )
}
