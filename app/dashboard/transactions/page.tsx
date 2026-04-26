import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { getTransactions } from "@/lib/transaction-actions"
import { redirect } from "next/navigation"
import { TransactionTableClient } from "@/app/dashboard/transactions/transaction-table-client"

export default async function TransactionsPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const activeId = await getActiveStoreId()
  const activeStoreId = activeId || stores[0].id
  const transactions = await getTransactions(activeStoreId)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Riwayat Transaksi</h2>
      </div>
      
      <TransactionTableClient initialData={transactions} />
    </div>
  )
}
