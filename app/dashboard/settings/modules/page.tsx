import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { redirect } from "next/navigation"
import ModuleSettingsClient from "@/app/dashboard/settings/modules/modules-client"

export default async function ModuleSettingsPage() {
  const stores = await getStores()
  const activeStoreId = await getActiveStoreId()

  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0]

  if (!activeStore) {
    redirect("/dashboard")
  }

  // Ensure settings has a default structure if it's NULL in DB
  const defaultSettings = {
    features: {
      tables: true,
      reservations: true,
      kds: true,
      promotions: true,
      customers: true
    },
    financial: {
      tax_enabled: false,
      tax_rate: 10,
      service_charge_enabled: false,
      service_charge_rate: 5
    },
    operational: {
      auto_print: false,
      low_stock_threshold: 5,
      business_model: "custom"
    }
  }

  const initialSettings = activeStore.settings || defaultSettings

  return (
    <ModuleSettingsClient 
      storeId={activeStore.id} 
      initialSettings={initialSettings} 
    />
  )
}
