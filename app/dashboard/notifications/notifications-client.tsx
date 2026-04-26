"use client"

import * as React from "react"
import { 
  IconBell, 
  IconCheck, 
  IconTrash, 
  IconInfoCircle, 
  IconAlertTriangle, 
  IconChecks,
  IconSearch,
  IconFilter
} from "@tabler/icons-react"
import { createClient } from "@/lib/supabase/client"
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearNotifications } from "@/lib/notification-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { useRouter } from "next/navigation"

export function NotificationsClient({ storeId, initialData }: { storeId: string, initialData: any[] }) {
  const [notifications, setNotifications] = React.useState<any[]>(initialData)
  const [filter, setFilter] = React.useState("all")
  const supabase = createClient()
  const router = useRouter()

  const fetchLatest = React.useCallback(async () => {
    const data = await getNotifications(storeId)
    setNotifications(data)
  }, [storeId])

  React.useEffect(() => {
    const channel = supabase
      .channel("page-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `store_id=eq.${storeId}`,
        },
        () => {
          fetchLatest()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [storeId, supabase, fetchLatest])

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read
    if (filter === "read") return n.is_read
    return true
  })

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const handleDelete = async (id: string) => {
    await deleteNotification(id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success("Notifikasi dihapus")
  }

  const handleClearAll = async () => {
    if (confirm("Hapus semua riwayat notifikasi?")) {
      await clearNotifications(storeId)
      setNotifications([])
      toast.success("Semua notifikasi dibersihkan")
    }
  }

  const handleNotifyClick = async (n: any) => {
    if (!n.is_read) {
      await handleMarkAsRead(n.id)
    }
    
    // Redirect based on type
    if (n.type === 'low_stock') {
      router.push("/dashboard/products")
    } else if (n.type === 'transaction') {
      router.push("/dashboard/transactions")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Tabs value={filter} onValueChange={setFilter} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Belum Dibaca
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Dibaca</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => markAllAsRead(storeId)}
            disabled={notifications.filter(n => !n.is_read).length === 0}
          >
            <IconChecks className="mr-2 h-4 w-4" />
            Tandai semua dibaca
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Bersihkan semua
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredNotifications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <IconBell size={48} className="mb-4" />
              <p className="font-medium text-lg">Tidak ada notifikasi</p>
              <p className="text-sm">Riwayat pemberitahuan Anda akan muncul di sini.</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              onClick={() => handleNotifyClick(notification)}
              className={`group overflow-hidden transition-all hover:shadow-md cursor-pointer ${!notification.is_read ? 'border-primary/20 bg-primary/5' : ''}`}
            >
              <CardContent className="p-0">
                <div className="flex gap-4 p-5 items-start">
                   <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${notification.is_read ? 'bg-transparent' : 'bg-primary'}`} />
                   
                   {notification.image_url ? (
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted border-2 shadow-sm">
                      <img 
                        src={notification.image_url} 
                        alt="" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-xl bg-background border-2 text-primary shadow-sm">
                       {notification.type === 'low_stock' ? <IconAlertTriangle size={28} className="text-destructive" /> : <IconInfoCircle size={28} />}
                    </div>
                  )}

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                       <h3 className="font-bold text-sm md:text-base">{notification.title}</h3>
                       <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                         {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: id })}
                       </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <IconCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ))
      }
      </div>
    </div>
  )
}
