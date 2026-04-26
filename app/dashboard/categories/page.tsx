import { getCategories } from "@/lib/product-actions"
import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { AddCategoryDialog } from "./add-category-dialog"
import { CategoryTableClient } from "./category-table-client"

export default async function CategoriesPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Toko belum dibuat</h2>
          <p className="text-muted-foreground">Silakan buat toko terlebih dahulu di pengaturan.</p>
        </div>
      </div>
    )
  }

  const activeId = await getActiveStoreId()
  const activeStoreId = activeId || stores[0].id
  const categories = await getCategories(activeStoreId)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kategori Produk</h1>
          <p className="text-muted-foreground">
            Kelola pengelompokan produk untuk mempermudah penjualan.
          </p>
        </div>
        <AddCategoryDialog storeId={activeStoreId} />
      </div>

      <CategoryTableClient categories={categories} />
    </div>
  )
}
