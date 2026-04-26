import { getStores } from "@/lib/store-actions"
import { getStoreStaff } from "@/lib/staff-actions"
import { redirect } from "next/navigation"
import { StaffListClient } from "./staff-list-client"

export default async function StaffSettingsPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const store = stores[0]
  // Check if owner
  const isOwner = store.store_members[0].role === "Owner"

  if (!isOwner) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center h-[50vh]">
        <div className="space-y-2">
          <h2 className="text-xl font-bold italic">Akses Dibatasi</h2>
          <p className="text-muted-foreground">Hanya Owner yang dapat mengelola staf toko.</p>
        </div>
      </div>
    )
  }

  const staff = await getStoreStaff(store.id)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="space-y-0.5">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Staf</h1>
        <p className="text-muted-foreground">
          Kelola karyawan dan hak akses mereka untuk toko <strong>{store.name}</strong>.
        </p>
      </div>
      
      <StaffListClient initialData={staff} storeId={store.id} />
    </div>
  )
}
