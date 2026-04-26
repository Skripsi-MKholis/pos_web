import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { redirect } from "next/navigation"
import { ReceiptForm } from "./receipt-form"

export default async function ReceiptSettingsPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const activeStoreIdFromCookie = await getActiveStoreId()
  const activeStore = stores.find(s => s.id === activeStoreIdFromCookie) || stores[0]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Struk & Printer</h2>
          <p className="text-muted-foreground">
            Kelola tampilan struk belanja dan konfigurasi printer thermal.
          </p>
        </div>
      </div>
      <ReceiptForm initialData={activeStore} />
    </div>
  )
}
