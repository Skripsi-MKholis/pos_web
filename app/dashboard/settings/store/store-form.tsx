"use client"

import * as React from "react"
import { IconBuildingStore, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { updateStore } from "@/lib/store-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function StoreForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
    }

    try {
      const result = await updateStore(initialData.id, data)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Informasi Toko diperbarui")
        router.refresh()
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Toko</Label>
              <div className="relative">
                <IconBuildingStore className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Nama Toko Anda" 
                  defaultValue={initialData?.name}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Bisnis</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                placeholder="email@toko.com" 
                defaultValue={initialData?.email}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input 
                id="phone" 
                name="phone"
                placeholder="0812..." 
                defaultValue={initialData?.phone}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea 
                id="address" 
                name="address"
                placeholder="Jl. Merdeka No. 1..." 
                defaultValue={initialData?.address}
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="font-bold px-8" disabled={isLoading}>
              {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Pengaturan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
