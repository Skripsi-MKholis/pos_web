import { redirect } from "next/navigation"
import { getStores } from "@/lib/store-actions"
import { getProducts, getCategories } from "@/lib/product-actions"
import { CashierClient } from "./cashier-client"

export default async function CashierPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const activeStoreId = stores[0].id
  const products = await getProducts(activeStoreId)
  const categories = await getCategories(activeStoreId)

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <CashierClient 
        storeId={activeStoreId}
        initialProducts={products}
        categories={categories}
      />
    </div>
  )
}
