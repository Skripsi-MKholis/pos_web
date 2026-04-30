import * as React from "react"
import { 
  IconSettings, 
  IconBell, 
  IconShieldLock, 
  IconMessage2,
  IconPlus,
  IconTrash
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/server"

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  
  // Fetch app configs
  const { data: configs } = await supabase
    .from('app_configs')
    .select('*')

  const isGatingEnabled = configs?.find(c => c.key === 'subscription_gating_enabled')?.value === 'true'
  const announcements = configs?.filter(c => c.key.startsWith('announcement_')) || []

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">System Control</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Konfigurasi global dan manajemen komunikasi sistem</p>
      </div>

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
                 <Switch checked={isGatingEnabled} />
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
                 <Switch checked={false} />
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
                   />
                 </div>
                 <Button className="w-full rounded-2xl h-12 shadow-lg shadow-primary/20">
                   <IconMessage2 size={18} className="mr-2" />
                   Kirim Pengumuman Global
                 </Button>
               </div>

               <div className="pt-6 space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Riwayat Pengumuman</h4>
                 <div className="space-y-3">
                   {announcements.length > 0 ? announcements.map((ann, i) => {
                     const data = JSON.parse(ann.value)
                     return (
                       <div key={i} className="p-4 rounded-2xl bg-muted/20 border flex items-start justify-between group">
                         <div className="space-y-1">
                           <p className="text-xs font-medium leading-relaxed">{data.message}</p>
                           <p className="text-[10px] text-muted-foreground font-mono">{new Date(data.created_at).toLocaleString()}</p>
                         </div>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
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
    </div>
  )
}
