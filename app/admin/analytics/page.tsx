import * as React from "react"
import { 
  IconChartBar, 
  IconTrendingUp, 
  IconUsers, 
  IconBuildingStore,
  IconCalendar
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()
  
  // Fetch some aggregate data for charts (mock logic for now)
  const { data: revenueData } = await supabase
    .from('transactions')
    .select('total_amount, created_at')
    .order('created_at', { ascending: true })

  // Group by month
  const monthlyRevenue = revenueData?.reduce((acc: any, curr) => {
    const month = new Date(curr.created_at).toLocaleString('default', { month: 'short' })
    acc[month] = (acc[month] || 0) + Number(curr.total_amount)
    return acc
  }, {})

  const chartData = Object.entries(monthlyRevenue || {}).map(([month, total]) => ({
    month,
    revenue: total
  }))

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight">Analitik Global</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Data pertumbuhan dan performa bisnis secara menyeluruh</p>
        </div>
        <Button variant="outline" className="rounded-xl border-dashed">
          <IconCalendar size={18} className="mr-2" />
          Jan 2026 - Des 2026
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-background">
          <CardHeader className="p-8 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black">Tren Pendapatan Global</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Total pendapatan dari seluruh toko yang aktif</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black italic">Rp 42.5M</div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase">+18.2% vs bln lalu</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 h-[350px] flex items-end gap-4">
             {/* Mock Chart Visualization with CSS Bars */}
             {chartData.map((data: any, idx) => (
               <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="relative w-full flex flex-col justify-end h-[200px]">
                    <div 
                      className="w-full bg-primary/20 rounded-t-2xl group-hover:bg-primary transition-all cursor-pointer relative"
                      style={{ height: `${(data.revenue / 1000000) * 20}%`, minHeight: '10%' }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Rp {(data.revenue / 1000).toLocaleString()}k
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">{data.month}</span>
               </div>
             ))}
             {chartData.length === 0 && (
               <div className="w-full h-full flex items-center justify-center italic text-muted-foreground">
                 Data tidak mencukupi untuk menampilkan grafik.
               </div>
             )}
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm bg-primary text-primary-foreground overflow-hidden">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black">Top Stores</CardTitle>
            <p className="text-xs opacity-70">Toko dengan performa terbaik bulan ini</p>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
             {[
               { name: "Kopi Kenangan", rev: "12.5M", grow: "+5%" },
               { name: "Bakmi GM", rev: "9.2M", grow: "+12%" },
               { name: "Warung Leko", rev: "7.8M", grow: "-2%" }
             ].map((store, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center font-black">
                     {i + 1}
                   </div>
                   <div>
                     <div className="font-bold text-sm">{store.name}</div>
                     <div className="text-[10px] opacity-70 uppercase font-bold tracking-widest">{store.grow} growth</div>
                   </div>
                 </div>
                 <div className="font-black italic text-lg">Rp {store.rev}</div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="p-8 rounded-[2.5rem] bg-emerald-500/10 text-emerald-600 space-y-2">
            <IconTrendingUp size={32} />
            <h4 className="text-xs font-black uppercase tracking-widest opacity-60 pt-2">Conversion Rate</h4>
            <p className="text-3xl font-black italic">68.4%</p>
         </div>
         <div className="p-8 rounded-[2.5rem] bg-blue-500/10 text-blue-600 space-y-2">
            <IconUsers size={32} />
            <h4 className="text-xs font-black uppercase tracking-widest opacity-60 pt-2">New Users</h4>
            <p className="text-3xl font-black italic">+124</p>
         </div>
         <div className="p-8 rounded-[2.5rem] bg-purple-500/10 text-purple-600 space-y-2">
            <IconBuildingStore size={32} />
            <h4 className="text-xs font-black uppercase tracking-widest opacity-60 pt-2">Active Stores</h4>
            <p className="text-3xl font-black italic">42</p>
         </div>
         <div className="p-8 rounded-[2.5rem] bg-orange-500/10 text-orange-600 space-y-2">
            <IconChartBar size={32} />
            <h4 className="text-xs font-black uppercase tracking-widest opacity-60 pt-2">Avg. Ticket</h4>
            <p className="text-3xl font-black italic">Rp 45k</p>
         </div>
      </div>
    </div>
  )
}
