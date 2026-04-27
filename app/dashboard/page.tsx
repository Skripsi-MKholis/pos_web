import { getStores, getActiveStoreId } from "@/lib/store-actions"
import { getDashboardMetrics, getSalesChartData } from "@/lib/transaction-actions"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { Button } from "@/components/ui/button"
import { 
  IconSettings, 
  IconCashRegister, 
  IconPackage, 
  IconArrowRight,
  IconArmchair 
} from "@tabler/icons-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const stores = await getStores()
  
  if (stores.length === 0) {
    redirect("/dashboard")
  }

  const activeStoreIdFromCookie = await getActiveStoreId()
  const activeStoreId = activeStoreIdFromCookie || stores[0].id
  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0]

  const [metrics, chartData] = await Promise.all([
    getDashboardMetrics(activeStoreId),
    getSalesChartData(activeStoreId, 30)
  ])

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          
          {/* Quick Access Section - Moved to Top */}
          <div className="px-4 lg:px-6">
            <div className="mb-4">
               <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground/50 flex items-center gap-2">
                 Konfigurasi & Akses Cepat
               </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/dashboard/settings/modules" className="group">
                <div className="p-4 rounded-3xl border bg-card hover:bg-primary hover:border-primary transition-all duration-300 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center text-primary group-hover:text-white transition-colors">
                         <IconSettings size={24} />
                      </div>
                      <div>
                         <p className="font-bold group-hover:text-white transition-colors">Modul & Fitur</p>
                         <p className="text-[10px] text-muted-foreground group-hover:text-white/70 transition-colors">Sesuaikan alat POS</p>
                      </div>
                   </div>
                   <IconArrowRight size={20} className="text-muted-foreground group-hover:text-white transition-all group-hover:translate-x-1" />
                </div>
              </Link>

              <Link href="/dashboard/cashier" className="group">
                <div className="p-4 rounded-3xl border bg-card hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-500/10 group-hover:bg-white/20 flex items-center justify-center text-blue-500 group-hover:text-white transition-colors">
                         <IconCashRegister size={24} />
                      </div>
                      <div>
                         <p className="font-bold group-hover:text-white transition-colors">Buka Kasir</p>
                         <p className="text-[10px] text-muted-foreground group-hover:text-white/70 transition-colors">Transaksi baru</p>
                      </div>
                   </div>
                   <IconArrowRight size={20} className="text-muted-foreground group-hover:text-white transition-all group-hover:translate-x-1" />
                </div>
              </Link>

              <Link href="/dashboard/products" className="group">
                <div className="p-4 rounded-3xl border bg-card hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-orange-500/10 group-hover:bg-white/20 flex items-center justify-center text-orange-500 group-hover:text-white transition-colors">
                         <IconPackage size={24} />
                      </div>
                      <div>
                         <p className="font-bold group-hover:text-white transition-colors">Kelola Stok</p>
                         <p className="text-[10px] text-muted-foreground group-hover:text-white/70 transition-colors">Input produk baru</p>
                      </div>
                   </div>
                   <IconArrowRight size={20} className="text-muted-foreground group-hover:text-white transition-all group-hover:translate-x-1" />
                </div>
              </Link>

              {activeStore.settings?.features?.tables !== false && (
                <Link href="/dashboard/tables" className="group">
                  <div className="p-4 rounded-3xl border bg-card hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 flex items-center justify-between shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 group-hover:bg-white/20 flex items-center justify-center text-emerald-500 group-hover:text-white transition-colors">
                           <IconArmchair size={24} />
                        </div>
                        <div>
                           <p className="font-bold group-hover:text-white transition-colors">Monitoring Meja</p>
                           <p className="text-[10px] text-muted-foreground group-hover:text-white/70 transition-colors">Lihat status okupansi</p>
                        </div>
                     </div>
                     <IconArrowRight size={20} className="text-muted-foreground group-hover:text-white transition-all group-hover:translate-x-1" />
                  </div>
                </Link>
              )}
            </div>
          </div>

          <SectionCards metrics={metrics} />
          
          <div className="px-4 lg:px-6">
            <div className="p-1 rounded-3xl border bg-card/50 overflow-hidden shadow-sm">
               <ChartAreaInteractive data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
