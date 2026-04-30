import { redirect } from "next/navigation"
import { getActiveStoreId } from "@/lib/store-actions"
import { getDiscounts, getVouchers } from "@/lib/promotion-actions"
import { createClient } from "@/lib/supabase/server"
import { PromotionsClient } from "./promotions-client"
import { FeatureGate } from "@/components/dashboard/feature-gate"

export default async function PromotionsPage() {
  const activeStoreId = await getActiveStoreId()
  if (!activeStoreId) redirect("/select-store")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: member } = await supabase
    .from("store_members")
    .select("role")
    .eq("store_id", activeStoreId)
    .eq("user_id", user?.id)
    .maybeSingle()

  // Security
  if (member?.role !== "Owner") {
    redirect("/dashboard")
  }

  const discounts = await getDiscounts(activeStoreId)
  const vouchers = await getVouchers(activeStoreId)

  return (
    <main className="flex-1 p-6 space-y-6">
      <FeatureGate feature="promotions" storeId={activeStoreId}>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Promosi & Voucher</h1>
          <p className="text-muted-foreground">Kelola diskon toko dan kode voucher pelanggan di sini.</p>
        </div>

        <PromotionsClient 
          storeId={activeStoreId} 
          initialDiscounts={discounts} 
          initialVouchers={vouchers} 
        />
      </FeatureGate>
    </main>
  )
}
