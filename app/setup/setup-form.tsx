"use client"

import * as React from "react"
import { IconLoader2, IconArrowRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { createStore } from "@/lib/store-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function SetupForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const address = formData.get("address") as string

    try {
      const result = await createStore(name, address)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Toko berhasil dibuat! Menyiapkan dashboard...")
        
        // Use the newly created store ID
        if (result.data?.id) {
          await setActiveStoreId(result.data.id)
          window.location.href = "/dashboard"
        }
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-xl bg-background/80 backdrop-blur-md">
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Toko / Outlet</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Contoh: Kopi Kenangan Jaya" 
                required 
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat (Opsional)</Label>
              <Input 
                id="address" 
                name="address" 
                placeholder="Jl. Merdeka No. 123" 
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full h-11 font-bold text-lg rounded-xl" disabled={isLoading}>
            {isLoading ? (
              <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>
                Konfirmasi & Mulai
                <IconArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
