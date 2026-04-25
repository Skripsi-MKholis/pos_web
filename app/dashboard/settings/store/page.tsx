import { getStores } from "@/lib/store-actions"
import { redirect } from "next/navigation"
import { StoreForm } from "./store-form"


export default async function StoreSettingsPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  // Assuming active store is the first one for now
  const store = stores[0]
  const isOwner = store.store_members[0].role === "Owner"

  if (!isOwner) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Akses Dibatasi</h2>
          <p className="text-muted-foreground">Hanya Owner yang dapat mengubah pengaturan toko.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="space-y-0.5">
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan Toko</h2>
        <p className="text-muted-foreground">
          Kelola informasi bisnis dan detail operasional toko Anda.
        </p>
      </div>
      <div className="max-w-2xl">
        <StoreForm initialData={store} />
      </div>
    </div>
  )
}
