"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { 
  IconPrinter, 
  IconReceipt, 
  IconDeviceFloppy, 
  IconInfoCircle,
  IconEye
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { updateStore } from "@/lib/store-actions"
import { ReceiptPrint } from "@/components/receipt-print"
import { formatCurrency, cn } from "@/lib/utils"

export function ReceiptForm({ initialData }: { initialData: any }) {
  const [mounted, setMounted] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showLogo, setShowLogo] = React.useState(initialData?.receipt_show_logo ?? true)
  const [paperSize, setPaperSize] = React.useState(initialData?.preferred_paper_size || "58mm")
  const [header, setHeader] = React.useState(initialData?.receipt_header || "")
  const [footer, setFooter] = React.useState(initialData?.receipt_footer || "")
  
  const router = useRouter()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleTestPrint = () => {
    window.print()
  }

  async function handleSave() {
    setIsLoading(true)
    try {
      const data = {
        receipt_header: header,
        receipt_footer: footer,
        receipt_show_logo: showLogo,
        preferred_paper_size: paperSize,
      }

      const result = await updateStore(initialData.id, data)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Pengaturan struk berhasil disimpan")
        router.refresh()
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Settings Form */}
      <div className="xl:col-span-7 space-y-6">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <IconReceipt className="text-primary" />
              Konten Struk
            </CardTitle>
            <CardDescription>Atur informasi yang ingin ditampilkan pada struk belanja.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2 bg-primary/5 p-4 rounded-xl border border-primary/20 border-dashed">
              <Checkbox 
                id="show-logo" 
                checked={showLogo}
                onCheckedChange={(v) => setShowLogo(!!v)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="show-logo" className="text-sm font-bold leading-none cursor-pointer">
                  Tampilkan Logo Toko
                </label>
                <p className="text-[10px] text-muted-foreground">
                  Gunakan logo yang sudah Anda unggah di Profil Toko.
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="header">Header Struk (Pesan Pembuka)</Label>
              <Textarea 
                id="header" 
                placeholder="Contoh: Selamat Datang di Toko Kami!" 
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="footer">Footer Struk (Pesan Penutup)</Label>
              <Textarea 
                id="footer" 
                placeholder="Contoh: Barang yang sudah dibeli tidak dapat ditukar." 
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <IconPrinter className="text-primary" />
              Konfigurasi Printer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="paper-size">Ukuran Kertas</Label>
              <Select value={paperSize} onValueChange={setPaperSize}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="58mm">Thermal 58mm (Kecil)</SelectItem>
                  <SelectItem value="80mm">Thermal 80mm (Besar)</SelectItem>
                  <SelectItem value="a4">Kertas A4 / Inkjet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <IconInfoCircle size={14} />
                Tips Printer
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sistem ini menggunakan **Browser Print**. Pastikan printer Anda sudah terpasang driver-nya dan terdeteksi oleh sistem operasi (Windows/Mac/Android).
              </p>
              <Button variant="outline" className="w-full h-11 rounded-xl font-bold gap-2" onClick={handleTestPrint}>
                <IconPrinter size={18} />
                Uji Coba Cetak (Test Print)
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button className="h-12 px-10 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2" onClick={handleSave} disabled={isLoading}>
            <IconDeviceFloppy size={20} />
            Simpan Pengaturan
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="xl:col-span-5">
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center gap-2 px-2">
            <IconEye size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Preview</span>
          </div>
          
          <div className="p-8 rounded-3xl border bg-white/50 backdrop-blur-sm shadow-inner flex justify-center overflow-hidden">
            <div className="scale-110 origin-top transform-gpu">
                <ReceiptPrint 
                  storeName={initialData.name}
                  address={initialData.address}
                  phone={initialData.phone}
                  logoUrl={initialData.logo_url}
                  header={header}
                  footer={footer}
                  showLogo={showLogo}
                  paperSize={paperSize}
                  cashierName="Sample User"
                  transactionId="TRX-SAMPLE-001"
                  items={[
                    { name: "Contoh Produk A", price: 25000, quantity: 2 },
                    { name: "Item Premium B", price: 150000, quantity: 1 }
                  ]}
                  total={200000}
                  paymentMethod="Tunai"
                  cashPaid={200000}
                  changeAmount={0}
                />
                
                {/* Mock version for screen display since ReceiptPrint is print-only by default */}
                <div className="font-mono text-[10px] w-[58mm] bg-white text-black p-4 shadow-xl border border-black/5 leading-tight pointer-events-none">
                  <div className="text-center space-y-1 mb-4 flex flex-col items-center">
                    {showLogo && initialData.logo_url && (
                        <img src={initialData.logo_url} alt="" className="w-10 h-10 object-contain mb-1 grayscale opacity-50" />
                    )}
                    <h1 className="text-sm font-black uppercase">{initialData.name}</h1>
                    {header && <p className="text-[8px] italic">{header}</p>}
                    <div className="border-b border-black w-full my-1 opacity-10"></div>
                    <p className="opacity-60">{initialData.address || "Alamat Toko..."}</p>
                  </div>
                  <div className="border-b border-dashed border-black/20 my-2"></div>
                  <div className="space-y-0.5 text-[8px] opacity-60">
                    <div className="flex justify-between"><span>Tgl:</span><span>26/04/26 19:00</span></div>
                    <div className="flex justify-between"><span>Struk:</span><span>#SAMPLE</span></div>
                  </div>
                  <div className="border-b border-dashed border-black/20 my-2"></div>
                  <div className="space-y-1.5 py-1">
                    <div className="flex justify-between font-bold text-[8px]">
                      <span>Contoh Item</span>
                      <span>{formatCurrency(50000)}</span>
                    </div>
                    <div className="flex justify-between font-black text-[9px] border-t border-black/10 pt-1 mt-1 uppercase">
                        <span>TOTAL</span>
                        <span>{formatCurrency(50000)}</span>
                    </div>
                  </div>
                  <div className="border-b border-dashed border-black/20 my-4"></div>
                  <div className="text-center space-y-1">
                    <p className="font-bold uppercase tracking-widest">Terima Kasih</p>
                    {footer && <p className="text-[8px] italic opacity-60">{footer}</p>}
                  </div>
                  <div className="h-4"></div>
                </div>
            </div>
          </div>
          <p className="text-center text-[10px] text-muted-foreground italic px-8">
            *Tampilan di atas adalah simulasi. Hasil cetak asli akan menyesuaikan dengan driver printer Anda.
          </p>
        </div>
      </div>
    </div>
  )
}
