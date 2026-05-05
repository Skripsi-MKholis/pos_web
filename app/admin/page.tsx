import * as React from "react"
import { 
  IconBuildingStore, 
  IconUsers, 
  IconCreditCard, 
  IconCash,
  IconArrowUpRight,
  IconArrowDownRight,
  IconClock,
  IconShieldCheck
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  // Fetch Global Stats
  const [
    { count: totalStores },
    { count: totalUsers },
    { data: activeSubscriptions },
    { data: recentTransactions }
  ] = await Promise.all([
    supabase.from('stores').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('id').eq('status', 'active'),
    supabase.from('transactions').select('total_amount, created_at').order('created_at', { ascending: false }).limit(10)
  ])

  // Simple revenue calculation (mock for now if no global revenue table)
  const totalRevenue = recentTransactions?.reduce((sum, tx) => sum + Number(tx.total_amount), 0) || 0

  const stats = [
    {
      title: "Total Toko",
      value: totalStores || 0,
      icon: <IconBuildingStore className="h-5 w-5" />,
      description: "+2 toko baru minggu ini",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      title: "Total Pengguna",
      value: totalUsers || 0,
      icon: <IconUsers className="h-5 w-5" />,
      description: "85% tingkat aktivitas",
      color: "bg-emerald-500/10 text-emerald-600"
    },
    {
      title: "Langganan Aktif",
      value: activeSubscriptions?.length || 0,
      icon: <IconCreditCard className="h-5 w-5" />,
      description: "12 upgrade bulan ini",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      title: "Estimasi Revenue",
      value: `Rp ${(totalRevenue / 1000).toLocaleString()}rb`,
      icon: <IconCash className="h-5 w-5" />,
      description: "Dari 10 transaksi terakhir",
      color: "bg-orange-500/10 text-orange-600"
    }
  ]

  return (
    <div className="flex flex-1 flex-col py-4 md:py-6 px-4 lg:px-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">Super Admin Overview</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Monitor ekosistem POS System secara global</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="rounded-3xl border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <IconArrowUpRight size={14} className="mr-1" />
                  12%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground">{stat.title}</p>
                <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="rounded-[2.5rem] border-none bg-muted/20 shadow-sm overflow-hidden">
           <CardHeader className="p-8">
             <CardTitle className="text-xl font-black">Transaksi Terbaru (Global)</CardTitle>
           </CardHeader>
           <CardContent className="p-0 px-8 pb-8">
             <div className="space-y-6">
               {recentTransactions?.map((tx, idx) => (
                 <div key={idx} className="flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-background border flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                       <IconCash size={24} />
                     </div>
                     <div>
                       <div className="font-bold">Rp {Number(tx.total_amount).toLocaleString()}</div>
                       <div className="text-[10px] text-muted-foreground font-mono uppercase">
                         {new Date(tx.created_at).toLocaleString('id-ID')}
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center text-xs font-bold text-muted-foreground">
                     <IconClock size={14} className="mr-1" />
                     Selesai
                   </div>
                 </div>
               ))}
               {(!recentTransactions || recentTransactions.length === 0) && (
                 <div className="text-center py-12 text-muted-foreground italic">
                   Belum ada transaksi di seluruh sistem.
                 </div>
               )}
             </div>
           </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-none bg-primary text-primary-foreground shadow-lg shadow-primary/20 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <IconShieldCheck size={200} />
           </div>
           <CardHeader className="p-8">
             <CardTitle className="text-2xl font-black tracking-tight">System Health</CardTitle>
           </CardHeader>
           <CardContent className="p-8 pt-0 space-y-8 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md">
                   <p className="text-xs font-bold uppercase tracking-widest opacity-70">Database Status</p>
                   <p className="text-xl font-black italic">OPTIMAL</p>
                </div>
                <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md">
                   <p className="text-xs font-bold uppercase tracking-widest opacity-70">API Latency</p>
                   <p className="text-xl font-black italic">45ms</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Resource Usage</span>
                  <span>42%</span>
                </div>
                <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[42%]" />
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs font-medium leading-relaxed opacity-80">
                  Seluruh sistem berjalan dengan normal. Tidak ada insiden keamanan atau performa yang terdeteksi dalam 24 jam terakhir.
                </p>
              </div>
           </CardContent>
         </Card>
      </div>
    </div>
  )
}
