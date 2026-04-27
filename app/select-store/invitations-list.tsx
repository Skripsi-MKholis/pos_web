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
      router.refresh()
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
        <Card key={invite.id} className="border-none bg-primary/5 rounded-3xl overflow-hidden shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
               <IconBuildingStore size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">{invite.stores.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic leading-tight">
                Undangan sebagai <span className="text-primary">{invite.role}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10"
                onClick={() => onDecline(invite.id)}
                disabled={!!loadingId}
              >
                <IconX size={20} />
              </Button>
              <Button 
                size="icon" 
                className="h-10 w-10 rounded-xl shadow-lg shadow-primary/20"
                onClick={() => onAccept(invite.id)}
                disabled={!!loadingId}
              >
                {loadingId === invite.id ? <IconLoader2 size={18} className="animate-spin" /> : <IconCheck size={20} />}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
