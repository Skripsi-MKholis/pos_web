import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { getCustomers } from "@/lib/customer-actions"
import { CustomerTableClient } from "./customer-table-client"
import { redirect } from "next/navigation"

export default async function CustomersPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const activeId = await getActiveStoreId()
  const activeStoreId = activeId || stores[0].id
  const customers = await getCustomers(activeStoreId)

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Pelanggan</h1>
          <p className="text-muted-foreground">Kelola data pelanggan dan member untuk toko Anda.</p>
        </div>
      </div>
      
      <CustomerTableClient initialData={customers} storeId={activeStoreId} />
    </div>
  )
}
