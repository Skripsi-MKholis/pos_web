"use client"

import * as React from "react"
import { 
  IconSettings, 
  IconBell, 
  IconShieldLock, 
  IconMessage2,
  IconTrash
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateAppConfig, createAnnouncement, deleteAnnouncement } from "@/lib/admin-actions"

interface SettingsClientProps {
  initialConfigs: any[]
}

export function SettingsClient({ initialConfigs }: SettingsClientProps) {
  const [isGatingEnabled, setIsGatingEnabled] = React.useState(
    initialConfigs.find(c => c.key === 'subscription_gating_enabled')?.value === 'true'
  )
  const [isMaintenanceMode, setIsMaintenanceMode] = React.useState(
    initialConfigs.find(c => c.key === 'maintenance_mode')?.value === 'true'
  )
  const [announcementMessage, setAnnouncementMessage] = React.useState("")
  const [isSubmittingAnnouncement, setIsSubmittingAnnouncement] = React.useState(false)

  const announcements = initialConfigs.filter(c => c.key.startsWith('announcement_')) || []

  const handleGatingToggle = async (checked: boolean) => {
    setIsGatingEnabled(checked)
    const result = await updateAppConfig('subscription_gating_enabled', String(checked))
    if (!result.success) {
      toast.error("Gagal memperbarui gating: " + result.error)
      setIsGatingEnabled(!checked)
    } else {
      toast.success(`Subscription gating ${checked ? 'diaktifkan' : 'dimatikan'}`)
    }
  }

  const handleMaintenanceToggle = async (checked: boolean) => {
    setIsMaintenanceMode(checked)
    const result = await updateAppConfig('maintenance_mode', String(checked))
    if (!result.success) {
      toast.error("Gagal memperbarui maintenance mode: " + result.error)
      setIsMaintenanceMode(!checked)
    } else {
      toast.success(`Maintenance mode ${checked ? 'diaktifkan' : 'dimatikan'}`)
    }
  }

  const handleCreateAnnouncement = async () => {
    if (!announcementMessage.trim()) {
      toast.error("Pesan pengumuman tidak boleh kosong")
      return
    }

    setIsSubmittingAnnouncement(true)
    const result = await createAnnouncement(announcementMessage)
    setIsSubmittingAnnouncement(false)

    if (result.success) {
      toast.success("Pengumuman berhasil dikirim")
      setAnnouncementMessage("")
    } else {
      toast.error("Gagal mengirim pengumuman: " + result.error)
    }
  }

  const handleDeleteAnnouncement = async (key: string) => {
    const result = await deleteAnnouncement(key)
    if (result.success) {
      toast.success("Pengumuman dihapus")
    } else {
      toast.error("Gagal menghapus pengumuman: " + result.error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* System Configs */}
      <div className="space-y-6">
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <IconShieldLock size={20} />
              </div>
              <CardTitle className="text-xl font-black">Fitur & Pembatasan</CardTitle>
            </div>
            <CardDescription>Aktifkan atau nonaktifkan pembatasan fitur berdasarkan paket secara global.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/30 border-2 border-dashed border-muted">
               <div className="space-y-1">
                 <Label className="text-base font-black italic uppercase">Subscription Gating</Label>
                 <p className="text-xs text-muted-foreground">Jika dimatikan, semua toko bisa mengakses fitur PRO secara gratis.</p>
               </div>
               <Switch 
                checked={isGatingEnabled} 
                onCheckedChange={handleGatingToggle}
              />
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                <IconSettings size={20} />
              </div>
              <CardTitle className="text-xl font-black">Maintenance Mode</CardTitle>
            </div>
            <CardDescription>Gunakan ini hanya saat melakukan migrasi database besar.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             <div className="flex items-center justify-between p-6 rounded-3xl bg-orange-500/5 border-2 border-dashed border-orange-500/20">
               <div className="space-y-1">
                 <Label className="text-base font-black italic uppercase text-orange-600">Maintenance Mode</Label>
                 <p className="text-xs text-muted-foreground opacity-70">Aplikasi tidak akan bisa diakses oleh user umum.</p>
               </div>
               <Switch 
                checked={isMaintenanceMode} 
                onCheckedChange={handleMaintenanceToggle}
              />
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Management */}
      <div className="space-y-6">
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden flex flex-col h-full">
          <CardHeader className="p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <IconBell size={20} />
              </div>
              <CardTitle className="text-xl font-black">System Announcements</CardTitle>
            </div>
            <CardDescription>Pesan yang dikirim akan muncul di dashboard seluruh pengguna.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6 flex-1">
             <div className="space-y-4">
               <div className="grid gap-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Isi Pengumuman</Label>
                 <Textarea 
                  placeholder="Contoh: Pemeliharaan sistem akan dilakukan pada jam 24:00 WIB..." 
                  className="rounded-2xl bg-muted/50 border-none min-h-[100px] resize-none focus-visible:ring-primary"
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                 />
               </div>
               <Button 
                className="w-full rounded-2xl h-12 shadow-lg shadow-primary/20"
                onClick={handleCreateAnnouncement}
                disabled={isSubmittingAnnouncement}
               >
                 <IconMessage2 size={18} className="mr-2" />
                 {isSubmittingAnnouncement ? "Mengirim..." : "Kirim Pengumuman Global"}
               </Button>
             </div>

             <div className="pt-6 space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Riwayat Pengumuman</h4>
               <div className="space-y-3">
                 {announcements.length > 0 ? announcements.sort((a,b) => b.key.localeCompare(a.key)).map((ann, i) => {
                   let data = { message: "Error parsing announcement", created_at: new Date().toISOString() };
                   try {
                     data = JSON.parse(ann.value)
                   } catch(e) {}
                   return (
                     <div key={ann.key} className="p-4 rounded-2xl bg-muted/20 border flex items-start justify-between group">
                       <div className="space-y-1">
                         <p className="text-xs font-medium leading-relaxed">{data.message}</p>
                         <p className="text-[10px] text-muted-foreground font-mono">{new Date(data.created_at).toLocaleString()}</p>
                       </div>
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        onClick={() => handleDeleteAnnouncement(ann.key)}
                       >
                         <IconTrash size={14} />
                       </Button>
                     </div>
                   )
                 }) : (
                   <p className="text-center py-8 text-xs text-muted-foreground italic">Belum ada pengumuman aktif.</p>
                 )}
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
