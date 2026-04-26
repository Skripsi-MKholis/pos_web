"use client"

import * as React from "react"
import { 
  IconSpeakerphone, 
  IconUsers, 
  IconUser, 
  IconShieldCheck,
  IconAlertCircle,
  IconSend,
  IconHistory,
  IconTemplate,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconTicket,
  IconTool
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { sendBroadcast } from "@/lib/notification-actions"
import { motion, AnimatePresence } from "framer-motion"

const TEMPLATES = [
  {
    id: "meeting",
    name: "Rapat Toko",
    title: "📢 Rapat Rutin",
    message: "Diberitahukan kepada seluruh staf untuk berkumpul di area meja kasir pada jam 08:00 WIB untuk briefing rutin. Harap hadir tepat waktu.",
    type: "announcement"
  },
  {
    id: "restock",
    name: "Info Stok Baru",
    title: "📦 Produk Baru Datang!",
    message: "Stok produk baru saja tiba. Mohon bantuan untuk melakukan pengecekan dan memajang produk di rak yang sesuai.",
    type: "info"
  },
  {
    id: "promo",
    name: "Promo Berjalan",
    title: "🏷️ Promo Beli 1 Gratis 1",
    message: "Ingatkan pelanggan bahwa mulai hari ini kita ada promo khusus untuk kategori minuman. Pastikan banner promo terlihat jelas.",
    type: "promo"
  },
  {
    id: "system",
    name: "Maintenance",
    title: "⚠️ Pemeliharaan Sistem",
    message: "Akan ada pemeliharaan sistem malam ini. Pastikan seluruh transaksi sudah tersimpan sebelum jam tutup toko.",
    type: "maintenance"
  }
]

export function BroadcastClient({ storeId, staff }: { storeId: string, staff: any[] }) {
  const [isSending, setIsSending] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: "",
    message: "",
    type: "announcement",
    targetType: "all" as "all" | "role" | "specific",
    targetRole: "Karyawan",
    targetUserId: ""
  })

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.message) {
      toast.error("Harap isi judul dan pesan")
      return
    }

    setIsSending(true)
    try {
      const res = await sendBroadcast({
        storeId,
        ...formData
      })

      if (res.success) {
        toast.success("Broadcast berhasil dikirim!")
        setFormData(prev => ({ ...prev, title: "", message: "" }))
      } else {
        toast.error(res.error || "Gagal mengirim broadcast")
      }
    } catch (err) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsSending(false)
    }
  }

  const applyTemplate = (tpl: any) => {
    setFormData(prev => ({
      ...prev,
      title: tpl.title,
      message: tpl.message,
      type: tpl.type
    }))
    toast.info(`Template "${tpl.name}" diterapkan`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Composer Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="shadow-lg border-2 border-primary/5">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-inner">
                <IconSend size={22} />
              </div>
              <div>
                <CardTitle>Broadcast Composer</CardTitle>
                <CardDescription>Buat pesan baru untuk tim Anda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSend} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipe Pesan</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}
                  >
                    <SelectTrigger className="bg-muted/50 border-0 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">
                        <div className="flex items-center gap-2">
                          <IconSpeakerphone size={16} className="text-blue-500" />
                          <span>Pengumuman</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="info">
                        <div className="flex items-center gap-2">
                          <IconInfoCircle size={16} className="text-primary" />
                          <span>Info Umum</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="promo">
                        <div className="flex items-center gap-2">
                          <IconTicket size={16} className="text-indigo-500" />
                          <span>Promo</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="maintenance">
                        <div className="flex items-center gap-2">
                          <IconTool size={16} className="text-orange-500" />
                          <span>Teknis</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kategori Tujuan</Label>
                  <Select 
                    value={formData.targetType} 
                    onValueChange={(v: any) => setFormData(prev => ({ ...prev, targetType: v }))}
                  >
                    <SelectTrigger className="bg-muted/50 border-0 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                         <div className="flex items-center gap-2">
                          <IconUsers size={16} />
                          <span>Semua Staf</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="role">
                        <div className="flex items-center gap-2">
                          <IconShieldCheck size={16} />
                          <span>Berdasarkan Jabatan</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="specific">
                         <div className="flex items-center gap-2">
                          <IconUser size={16} />
                          <span>Staf Spesifik</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {formData.targetType === "role" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label>Pilih Jabatan</Label>
                    <Select 
                      value={formData.targetRole} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, targetRole: v }))}
                    >
                      <SelectTrigger className="bg-primary/5 border-primary/20 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Karyawan">Kasir / Karyawan</SelectItem>
                        <SelectItem value="Owner">Pemilik (Owner)</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}

                {formData.targetType === "specific" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label>Pilih Staf</Label>
                    <Select 
                      value={formData.targetUserId} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, targetUserId: v }))}
                    >
                      <SelectTrigger className="bg-primary/5 border-primary/20 h-11">
                        <SelectValue placeholder="Pilih anggota tim..." />
                      </SelectTrigger>
                      <SelectContent>
                        {staff.map((m) => (
                          <SelectItem key={m.users.id} value={m.users.id}>
                            {m.users.full_name || m.users.email} ({m.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label>Judul Pesan</Label>
                <Input 
                  placeholder="Misal: Info Rapat Hari Ini"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-muted/50 border-0 h-11 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label>Isi Pesan</Label>
                <Textarea 
                  placeholder="Tulis pesan atau instruksi Anda di sini..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-muted/50 border-0 focus-visible:ring-primary resize-none p-4"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 gap-2 text-base font-bold shadow-lg shadow-primary/20"
                disabled={isSending}
              >
                {isSending ? "Mengirim..." : (
                  <>
                    <IconSend size={18} />
                    Kirim Broadcast Sekarang
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Templates & Preview Section */}
      <div className="space-y-6">
        {/* Preview Card */}
        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-10">
             <IconSpeakerphone size={120} />
           </div>
           <CardHeader>
             <div className="flex items-center gap-2">
               <IconAlertCircle size={20} />
               <span className="text-xs uppercase font-bold tracking-widest opacity-80">Real-time Preview</span>
             </div>
             <CardTitle className="text-3xl mt-4 font-black">
               {formData.title || "Judul Pesan"}
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-6 relative z-10 pb-12">
             <p className="text-lg opacity-90 leading-relaxed font-medium italic">
                "{formData.message || "Isi pesan Anda akan muncul di sini sebagai pratinjau..."}"
             </p>
             <div className="flex items-center gap-4 pt-4">
                <div className="h-1 bg-primary-foreground/30 flex-1 rounded-full overflow-hidden">
                   <div className="h-full bg-primary-foreground w-1/3" />
                </div>
                <span className="text-[10px] font-bold uppercase opacity-60">
                   Akan muncul di lonceng staf
                </span>
             </div>
           </CardContent>
        </Card>

        {/* Templates Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconTemplate className="text-primary" />
              <CardTitle className="text-lg">Template Pesan</CardTitle>
            </div>
            <CardDescription>Gunakan template untuk kirim info umum dengan cepat</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <div className="flex flex-col border-t">
               {TEMPLATES.map((tpl) => (
                 <button
                    key={tpl.id}
                    onClick={() => applyTemplate(tpl)}
                    className="flex flex-col gap-1 p-4 text-left transition-colors hover:bg-muted/50 border-b last:border-0 group"
                 >
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-bold group-hover:text-primary transition-colors">
                       {tpl.name}
                     </span>
                     <IconTemplate size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                   </div>
                   <p className="text-xs text-muted-foreground line-clamp-1">
                     {tpl.message}
                   </p>
                 </button>
               ))}
             </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="bg-muted p-6 rounded-2xl border flex gap-4 items-start">
           <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-background border shadow-sm">
              <IconInfoCircle className="text-primary" />
           </div>
           <div>
              <h4 className="text-sm font-bold mb-1">Tips Komunikasi</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gunakan broadcast untuk instruksi yang segera. Pesan akan muncul secara real-time di header dashboard staf Anda tanpa perlu memuat ulang halaman.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
