import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { getSalesAndProfitData } from "@/lib/transaction-actions"
import { redirect } from "next/navigation"
import { ProfitChartClient } from "./profit-chart-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCash, IconTrendingUp, IconPercentage } from "@tabler/icons-react"

export default async function ProfitReportPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const activeId = await getActiveStoreId()
  const activeStoreId = activeId || stores[0].id
  
  const profitData = await getSalesAndProfitData(activeStoreId, 30)
  
  const totalRevenue = profitData.reduce((sum, d) => sum + d.revenue, 0)
  const totalProfit = profitData.reduce((sum, d) => sum + d.profit, 0)
  const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Laporan Laba Kotor</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan (30hr)</CardTitle>
            <IconCash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Laba Kotor (30hr)</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Rp {totalProfit.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Margin</CardTitle>
            <IconPercentage className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{averageMargin.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <ProfitChartClient data={profitData} />
    </div>
  )
}
