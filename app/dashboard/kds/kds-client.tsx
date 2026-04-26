"use client"

import * as React from "react"
import { 
  IconClock, 
  IconToolsKitchen2, 
  IconCheck, 
  IconArmchair,
  IconAlertTriangle,
  IconChevronRight,
  IconFilter
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { updateItemStatus } from "@/lib/kds-actions"
import { cn } from "@/lib/utils"

type OrderItem = {
  id: string
  product_name: string
  quantity: number
  status: 'Pending' | 'Cooking' | 'Ready' | 'Served'
  notes: string
  selected_variants: any
}

type Order = {
  id: string
  created_at: string
  table_id: string
  tables?: { name: string } | null
  transaction_items: OrderItem[]
}

export function KDSClient({ 
  initialOrders, 
  storeId 
}: { 
  initialOrders: any[]
  storeId: string
}) {
  const [orders, setOrders] = React.useState<Order[]>(initialOrders)
  const [filterArea, setFilterArea] = React.useState<string>("all")
  const supabase = createClient()

  // Realtime subscription
  React.useEffect(() => {
    const channel = supabase
      .channel('kds_updates')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'transaction_items' }, 
        () => {
           // For simplicity, we could re-fetch perfectly, 
           // but for a true agentic experience we just notify or optimistic update
           // Here we refresh to get latest linked data
           window.location.reload() 
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions', filter: `store_id=eq.${storeId}` },
        () => {
           window.location.reload()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, storeId])

  async function handleUpdateStatus(itemId: string, status: any) {
    try {
      const res = await updateItemStatus(itemId, status)
      if (res.error) {
        toast.error(res.error)
      } else {
        // Optimistic update
        setOrders(prev => prev.map(order => ({
            ...order,
            transaction_items: order.transaction_items.map(item => 
                item.id === itemId ? { ...item, status } : item
            )
        })))
        toast.success(`Status item diperbarui`)
      }
    } catch (error) {
      toast.error("Gagal memperbarui status")
    }
  }

  const getTimeElapsed = (dateString: string) => {
    const start = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - start.getTime()) / 60000) // minutes
    return diff
  }

  const [currentTime, setCurrentTime] = React.useState(new Date())
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  // Filter out orders that are fully "Ready" or "Served"
  const activeOrders = orders.filter(order => 
    order.transaction_items.some(item => ['Pending', 'Cooking'].includes(item.status))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/10 rounded-xl">
               <IconToolsKitchen2 className="text-primary" size={28} />
            </div>
            Kitchen Display (KDS)
          </h1>
          <p className="text-muted-foreground font-medium">Manajemen produksi pesanan real-time</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="h-10 px-4 rounded-xl flex items-center gap-2 bg-background border-none shadow-sm ring-1 ring-foreground/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs">Sistem Aktif</span>
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {activeOrders.map((order) => {
            const minutes = getTimeElapsed(order.created_at)
            const isUrgent = minutes > 15

            return (
              <motion.div 
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "bg-card rounded-[2rem] border-none shadow-xl ring-1 ring-foreground/5 overflow-hidden flex flex-col transition-all duration-300",
                  isUrgent && "ring-rose-500"
                )}
              >
                {/* Order Header */}
                <div className={cn(
                  "p-5 flex justify-between items-center text-white",
                  isUrgent ? "bg-rose-600" : "bg-slate-900"
                )}>
                   <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                         <IconArmchair size={16} className="opacity-70" />
                         <span className="font-black text-xl leading-none uppercase tracking-tight">
                            {order.tables?.name || "TA"}
                         </span>
                      </div>
                      <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                         #{order.id.substring(0, 8)}
                      </p>
                   </div>
                   <div className="text-right">
                      <div className="flex items-center gap-1 font-black text-lg justify-end">
                         <IconClock size={16} />
                         {minutes}m
                      </div>
                      {isUrgent && (
                         <div className="flex items-center gap-1 text-[10px] font-black uppercase text-white animate-bounce">
                            <IconAlertTriangle size={10} /> Terlambat
                         </div>
                      )}
                   </div>
                </div>

                {/* Items List */}
                <div className="flex-1 p-5 space-y-4 no-scrollbar overflow-y-auto max-h-[400px]">
                   {order.transaction_items.filter(item => ['Pending', 'Cooking'].includes(item.status)).map((item) => (
                      <div key={item.id} className="group space-y-2 pb-4 border-b border-dashed last:border-0 last:pb-0">
                         <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                               <div className="flex items-start gap-2">
                                  <span className="shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-black text-lg">
                                     {item.quantity}
                                  </span>
                                  <div>
                                     <h4 className="font-black text-lg leading-tight uppercase">{item.product_name}</h4>
                                     {item.notes && (
                                        <p className="text-xs font-bold text-rose-500 italic mt-1 bg-rose-50 px-2 py-0.5 rounded-md inline-block">
                                           ! {item.notes}
                                        </p>
                                     )}
                                     {item.selected_variants && Array.isArray(item.selected_variants) && item.selected_variants.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                           {item.selected_variants.map((v: any, i: number) => (
                                              <span key={i} className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded uppercase tracking-wider">
                                                 {v.option}
                                              </span>
                                           ))}
                                        </div>
                                     )}
                                  </div>
                               </div>
                            </div>
                            <div>
                               <Badge className={cn(
                                 "text-[10px] font-black uppercase border-none",
                                 item.status === 'Pending' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                               )}>
                                  {item.status === 'Pending' ? 'Menunggu' : 'Proses'}
                               </Badge>
                            </div>
                         </div>
                         
                         <div className="flex gap-2">
                            {item.status === 'Pending' ? (
                               <Button 
                                 size="sm" 
                                 className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold uppercase text-[10px] tracking-tight gap-1"
                                 onClick={() => handleUpdateStatus(item.id, 'Cooking')}
                               >
                                  <IconToolsKitchen2 size={14} /> Masak
                               </Button>
                            ) : (
                               <Button 
                                 size="sm" 
                                 className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold uppercase text-[10px] tracking-tight gap-1"
                                 onClick={() => handleUpdateStatus(item.id, 'Ready')}
                               >
                                  <IconCheck size={14} /> Selesai
                               </Button>
                            )}
                         </div>
                      </div>
                   ))}
                </div>

                {/* Footer Info */}
                <div className="p-4 bg-muted/5 text-[10px] font-bold text-muted-foreground flex justify-between items-center border-t border-dashed">
                   <span>MASUK: {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                   <div className="flex items-center gap-1 text-emerald-600">
                      <IconCheck size={12} />
                      ONLINE
                   </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {activeOrders.length === 0 && (
          <div className="col-span-full py-32 text-center bg-card rounded-[3rem] border-2 border-dashed border-muted shadow-sm">
             <div className="mx-auto w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <IconCheck size={40} />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tight">Semua Pesanan Selesai!</h3>
             <p className="text-muted-foreground font-medium">Dapur sedang istirahat. Menunggu pesanan baru...</p>
          </div>
        )}
      </div>
    </div>
  )
}
