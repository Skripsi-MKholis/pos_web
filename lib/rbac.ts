import { redirect } from "next/navigation"
import { getActiveStoreId, getUserRole } from "./store-actions"

export async function enforceOwner() {
  const activeStoreId = await getActiveStoreId()
  
  if (!activeStoreId) {
    redirect("/select-store")
  }

  const role = await getUserRole(activeStoreId)

  if (role !== "Owner") {
    redirect("/dashboard")
  }
}
