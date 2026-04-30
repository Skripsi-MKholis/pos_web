import { Badge } from "@/components/ui/badge"
import { IconInfoCircle } from "@tabler/icons-react"
import { enforceOwner } from "@/lib/rbac"
import BillingClient from "./billing-client"
import { getActiveStoreId } from "@/lib/store-actions"
import { getStoreSubscription, getSubscriptionPlans, isSubscriptionGatingEnabled } from "@/lib/subscription-actions"

export default async function BillingPage() {
  await enforceOwner()
  const storeId = await getActiveStoreId()
  
  if (!storeId) return null

  const subscription = await getStoreSubscription(storeId)
  const plans = await getSubscriptionPlans()
  const gatingEnabled = await isSubscriptionGatingEnabled()
  
  return (
    <div className="flex-1 space-y-12 p-4 md:p-8 pt-6 max-w-6xl mx-auto">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Pilih Paket <span className="text-primary italic">Langganan</span></h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Pilih paket yang sesuai dengan skala bisnis anda saat ini.
        </p>
      </div>

      {/* Development Phase Note */}
      {!gatingEnabled && (
        <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary max-w-3xl mx-auto">
          <IconInfoCircle size={24} className="shrink-0" />
          <p className="text-sm font-bold">
            Informasi: Semua fitur untuk saat ini bisa diakses secara gratis oleh Admin.
          </p>
        </div>
      )}

      <BillingClient 
        storeId={storeId} 
        initialSubscription={subscription} 
        initialPlans={plans} 
        initialGatingEnabled={gatingEnabled}
      />
    </div>
  )
}
