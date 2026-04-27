"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconBuildingStore, IconCheck, IconX, IconLoader2 } from "@tabler/icons-react"
import { acceptInvitation, declineInvitation } from "@/lib/staff-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function InvitationsList({ invitations }: { invitations: any[] }) {
  const [loadingId, setLoadingId] = React.useState<string | null>(null)
  const router = useRouter()

  async function onAccept(id: string) {
    setLoadingId(id)
    const res = await acceptInvitation(id)
    if (res.success) {
      toast.success("Berhasil bergabung dengan toko!")
      router.push(`/dashboard?storeId=${res.storeId}`)
    } else {
      toast.error(res.error || "Gagal menerima undangan")
    }
    setLoadingId(null)
  }

  async function onDecline(id: string) {
    if (!confirm("Tolak undangan ini?")) return
    setLoadingId(id)
    const res = await declineInvitation(id)
    if (res.success) {
      toast.info("Undangan ditolak")
      router.refresh()
    } else {
      toast.error(res.error || "Gagal menolak undangan")
    }
    setLoadingId(null)
  }

  return (
    <div className="grid gap-3">
      {invitations.map((invite) => (
        <Card key={invite.id} className="border-none bg-primary/5 rounded-2xl overflow-hidden shadow-sm">
          <CardContent className="p-3.5 flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden border border-primary/10 shadow-inner">
               {invite.stores.logo_url ? (
                 <img src={invite.stores.logo_url} alt={invite.stores.name} className="h-full w-full object-cover" />
               ) : (
                 <IconBuildingStore size={20} />
               )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate leading-tight">{invite.stores.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter truncate opacity-80">
                <span className="text-primary">{invite.role}</span>
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                onClick={() => onDecline(invite.id)}
                disabled={!!loadingId}
              >
                <IconX size={16} />
              </Button>
              <Button 
                size="icon" 
                className="h-8 w-8 rounded-lg shadow-md shadow-primary/20"
                onClick={() => onAccept(invite.id)}
                disabled={!!loadingId}
              >
                {loadingId === invite.id ? <IconLoader2 size={14} className="animate-spin" /> : <IconCheck size={16} />}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
