import { redirect } from "next/navigation"
import { getStores } from "@/lib/store-actions"
import { getProducts, getCategories } from "@/lib/product-actions"
import { CashierClient } from "./cashier-client"
import { createClient } from "@/lib/supabase/server"

export default async function CashierPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const activeStore = stores[0]
  const [products, categories] = await Promise.all([
    getProducts(activeStore.id),
    getCategories(activeStore.id)
  ])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userName = user?.user_metadata?.full_name || user?.email || "Kasir"

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <CashierClient 
        store={activeStore}
        userName={userName}
        initialProducts={products}
        categories={categories}
      />
    </div>
  )
}
