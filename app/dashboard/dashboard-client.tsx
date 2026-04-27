"use client"

import * as React from "react"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { 
  IconSettings, 
  IconCashRegister, 
  IconPackage, 
  IconArrowRight,
  IconArmchair,
  IconBulb
} from "@tabler/icons-react"
import Link from "next/link"
import { WelcomeOnboarding } from "@/components/welcome-onboarding"

export default function DashboardClient({ user, activeStore, metrics, chartData }: any) {
  const [isTutorialOpen, setIsTutorialOpen] = React.useState(false)

  return (
    <div className="flex flex-1 flex-col">
      <WelcomeOnboarding 
        userName={user.user_metadata?.full_name || user.email?.split('@')[0] || "User"} 
        storeName={activeStore.name} 
        storeId={activeStore.id}
        open={isTutorialOpen}
        onOpenChange={setIsTutorialOpen}
      />
      
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          
          {/* Quick Access Section */}
          <div className="px-4 lg:px-6" data-tour="quick-access">
            <div className="mb-4 flex items-center justify-between">
               <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground/50 flex items-center gap-2">
                 Konfigurasi & Akses Cepat
               </h2>
               <button 
                onClick={() => setIsTutorialOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
               >
                 <IconBulb size={14} strokeWidth={2.5} />
                 Pelajari Fitur
               </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/dashboard/settings/modules" className="group">
                <div className="p-4 rounded-3xl border bg-card hover:bg-primary hover:border-primary transition-all duration-300 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center text-primary group-hover:text-white transition-colors">
                         <IconSettings size={24} />
                      </div>
                      <div>
                         <p className="font-bold group-hover:text-white transition-colors text-sm">Modul & Fitur</p>
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
                         <p className="font-bold group-hover:text-white transition-colors text-sm">Buka Kasir</p>
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
                         <p className="font-bold group-hover:text-white transition-colors text-sm">Kelola Stok</p>
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
                           <p className="font-bold group-hover:text-white transition-colors text-sm">Monitoring Meja</p>
                           <p className="text-[10px] text-muted-foreground group-hover:text-white/70 transition-colors">Status okupansi</p>
                        </div>
                     </div>
                     <IconArrowRight size={20} className="text-muted-foreground group-hover:text-white transition-all group-hover:translate-x-1" />
                  </div>
                </Link>
              )}
            </div>
          </div>

          <div data-tour="metrics">
            <SectionCards metrics={metrics} />
          </div>
          
          <div className="px-4 lg:px-6" data-tour="charts">
            <div className="p-1 rounded-3xl border bg-card/50 overflow-hidden shadow-sm">
               <ChartAreaInteractive data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
