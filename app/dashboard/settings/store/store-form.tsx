"use client"

import * as React from "react"
import { IconBuildingStore, IconLoader2, IconCamera, IconX, IconUpload, IconInfoCircle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateStore } from "@/lib/store-actions"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconPrinter, IconReceipt, IconSettings } from "@tabler/icons-react"

export function StoreForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(initialData?.logo_url || null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          toast.error("Ukuran gambar maksimal 2MB")
          return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: any = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
    }

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${initialData.id}-${Date.now()}.${fileExt}`
        const filePath = `store-logos/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('store-assets')
          .upload(filePath, imageFile, { upsert: true })

        if (uploadError) {
          await supabase.storage.from('product-images').upload(filePath, imageFile, { upsert: true })
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath)
          data.logo_url = publicUrl
        } else {
          const { data: { publicUrl } } = supabase.storage.from('store-assets').getPublicUrl(filePath)
          data.logo_url = publicUrl
        }
      }

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Label htmlFor="logo-upload" className="relative group cursor-pointer">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarImage src={imagePreview || ""} className="object-cover" />
                <AvatarFallback className="bg-primary/5 text-primary">
                  <IconBuildingStore size={48} stroke={1.5} />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-[2px]">
                <IconCamera size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Ganti Logo</span>
              </div>
              <input 
                id="logo-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
              />
            </Label>
            <div className="mt-4 space-y-1">
              <h3 className="font-bold text-lg">{initialData?.name}</h3>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Store Identity</p>
            </div>
            
            <p className="mt-6 text-[11px] text-muted-foreground px-4 italic">
              Logo ini akan ditampilkan di dashboard dan profil toko. 
              Gunakan format PNG/JPG maksimal 2MB.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <IconInfoCircle className="text-primary" />
              Informasi Umum
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Toko</Label>
                <div className="relative">
                  <IconBuildingStore className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="Nama Toko Anda" 
                    defaultValue={initialData?.name}
                    className="pl-9 h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Bisnis</Label>
                  <Input id="email" name="email" type="email" placeholder="email@toko.com" defaultValue={initialData?.email} className="h-11" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" name="phone" placeholder="0812..." defaultValue={initialData?.phone} className="h-11" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Alamat Lengkap (Ditampilkan di Struk)</Label>
                <Textarea 
                  id="address" 
                  name="address"
                  placeholder="Jl. Merdeka No. 1..." 
                  defaultValue={initialData?.address}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" className="font-bold px-8 h-11 rounded-xl shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
