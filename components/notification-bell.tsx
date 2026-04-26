"use client"

import * as React from "react"
import { IconBell, IconCheck, IconChecks, IconInfoCircle, IconAlertTriangle, IconTrash, IconX } from "@tabler/icons-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearNotifications } from "@/lib/notification-actions"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"

import { useRouter } from "next/navigation"

export function NotificationBell({ storeId }: { storeId: string }) {
  const [notifications, setNotifications] = React.useState<any[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const supabase = createClient()
  const router = useRouter()

  const fetchNotifications = React.useCallback(async () => {
    console.log("Fetching notifications for store:", storeId)
    setIsLoading(true)
    try {
      const data = await getNotifications(storeId)
      console.log("Found notifications:", data.length)
      setNotifications(data)
      setUnreadCount(data.filter((n: any) => !n.is_read).length)
    } catch (err) {
      console.error("Error fetching notifications:", err)
    } finally {
      setIsLoading(false)
    }
  }, [storeId])

  React.useEffect(() => {
    fetchNotifications()

    // Subscribe to real-time changes
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `store_id=eq.${storeId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev])
          setUnreadCount((prev) => prev + 1)
          
          // Show toast for new notification
          toast(payload.new.title, {
            description: payload.new.message,
            icon: payload.new.type === 'low_stock' ? <IconAlertTriangle className="text-destructive" /> : <IconInfoCircle className="text-primary" />,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [storeId, supabase, fetchNotifications])

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
    setNotifications((prev) => 
      prev.map((n) => n.id === id ? { ...n, is_read: true } : n)
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(storeId)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  const handleDelete = async (id: string) => {
    await deleteNotification(id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    const wasUnread = notifications.find(n => n.id === id && !n.is_read)
    if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleClearAll = async () => {
    if (confirm("Hapus semua riwayat notifikasi?")) {
      await clearNotifications(storeId)
      setNotifications([])
      setUnreadCount(0)
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <IconBell className="h-5 w-5" />
          {!isLoading && unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold">Notifikasi</h4>
            {!isLoading && notifications.length > 0 && (
              <Badge variant="secondary" className="px-1.5 h-4 text-[10px]">
                {notifications.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                onClick={handleMarkAllAsRead}
              >
                Baca semua
              </Button>
            )}
            {!isLoading && notifications.length > 0 && (
               <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 text-xs text-destructive hover:bg-transparent"
                onClick={handleClearAll}
              >
                Hapus semua
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="text-xs text-muted-foreground animate-pulse">Memuat...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 p-4 text-center">
              <IconBell className="h-10 w-10 text-muted-foreground/20" />
              <p className="text-xs text-muted-foreground">Tidak ada notifikasi baru</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotifyClick(notification)}
                  className={`group relative flex gap-3 px-4 py-4 transition-colors hover:bg-muted/50 cursor-pointer ${
                    !notification.is_read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className={`mt-2 h-2 w-2 rounded-full shrink-0 ${
                    notification.is_read ? "bg-transparent" : "bg-primary"
                  }`} />
                  
                  {notification.image_url ? (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted border">
                      <img 
                        src={notification.image_url} 
                        alt="" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                       <IconInfoCircle size={20} />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 overflow-hidden flex-1">
                    <p className="text-xs font-bold leading-none">{notification.title}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                       <p className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-tight">
                        {formatDistanceToNow(new Date(notification.created_at), { 
                          addSuffix: true,
                          locale: id 
                        })}
                      </p>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Tandai dibaca"
                          >
                            <IconCheck className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(notification.id)}
                          title="Hapus"
                        >
                          <IconTrash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
           <Link href="/dashboard/notifications" className="block w-full">
            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
              Lihat Semua Notifikasi
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
