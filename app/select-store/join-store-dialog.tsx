"use client"

import * as React from "react"
import { 
  IconTicket, 
  IconLoader2 
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { joinStoreByCode } from "@/lib/staff-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function JoinStoreDialog() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [code, setCode] = React.useState("")
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code) return

    setIsLoading(true)
    const res = await joinStoreByCode(code.toUpperCase())
    setIsLoading(false)

    if (res.success) {
      toast.success(`Berhasil mengirim permintaan bergabung ke ${res.storeName}!`)
      setIsOpen(false)
      setCode("")
      router.refresh()
    } else {
      toast.error(res.error || "Gagal bergabung")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-2xl w-full h-12 font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 border-2 border-dashed">
          <IconTicket className="mr-2" size={20} />
          Punya Kode Undangan?
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader className="space-y-4">
             <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <IconTicket size={36} />
             </div>
            <DialogTitle className="text-2xl font-black text-center tracking-tight">Gabung ke Toko</DialogTitle>
            <DialogDescription className="text-center px-4">
              Masukkan 8 karakter kode undangan yang diberikan oleh pemilik toko Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="code" className="px-1 text-xs font-bold text-muted-foreground uppercase tracking-widest">Kode Undangan</Label>
            <Input 
              id="code" 
              placeholder="CONTOH: X7H2K9A1" 
              className="h-16 rounded-2xl text-center text-2xl font-black tracking-[0.2em] uppercase placeholder:tracking-normal placeholder:text-sm placeholder:font-normal"
              value={code}
              onChange={(e) => setCode(e.target.value.substring(0, 8))}
              maxLength={8}
              autoFocus
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20" disabled={isLoading || code.length < 4}>
              {isLoading ? <IconLoader2 className="animate-spin" /> : "Minta Bergabung"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
