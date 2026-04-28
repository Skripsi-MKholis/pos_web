import { getStores } from "@/lib/store-actions"
import { getStoreStaff } from "@/lib/staff-actions"
import { redirect } from "next/navigation"
import { StaffListClient } from "./staff-list-client"
import { enforceOwner } from "@/lib/rbac"
import { createClient } from "@/lib/supabase/server"

export default async function StaffSettingsPage() {
  await enforceOwner()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const store = stores[0]

  const staff = await getStoreStaff(store.id)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="space-y-0.5">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Staf</h1>
        <p className="text-muted-foreground">
          Kelola karyawan dan hak akses mereka untuk toko <strong>{store.name}</strong>.
        </p>
      </div>
      
      <StaffListClient 
        initialData={staff} 
        storeId={store.id} 
        inviteCode={store.invite_code} 
        currentUserId={user?.id}
      />
    </div>
  )
}
