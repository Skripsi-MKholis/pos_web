import { getStores } from "@/lib/store-actions"
import { getDashboardMetrics } from "@/lib/transaction-actions"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const activeStoreId = stores[0].id
  const metrics = await getDashboardMetrics(activeStoreId)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards metrics={metrics} />
          
          <div className="px-4 lg:px-6">
            <div className="p-1 rounded-3xl border bg-card/50 overflow-hidden">
               <ChartAreaInteractive />
            </div>
          </div>
          
          {/* Recent Activity or Quick Links could go here */}
        </div>
      </div>
    </div>
  )
}
