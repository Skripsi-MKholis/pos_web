"use client"

import * as React from "react"
import { IconLoader2, IconCamera, IconUser } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile } from "@/lib/auth-actions"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ProfileForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [fullName, setFullName] = React.useState(initialData?.full_name || "")
  const [avatarUrl, setAvatarUrl] = React.useState(initialData?.avatar_url || "")
  const [uploading, setUploading] = React.useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `avatars/${initialData.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images') // Reusing the same bucket for simplicity or use a new one
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
      
      // Auto-save the new avatar URL
      await updateProfile({ avatar_url: publicUrl })
      toast.success("Foto profil diperbarui")
      router.refresh()
    } catch (error: any) {
      toast.error("Gagal mengupload foto: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Profil diperbarui")
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
      <CardContent className="pt-6 space-y-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <IconUser className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <label 
              htmlFor="avatar-upload" 
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-[2px]"
            >
              {uploading ? (
                <IconLoader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <IconCamera className="h-6 w-6 text-white" />
              )}
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-bold text-lg">Foto Profil</h3>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Klik foto untuk mengubah. Format JPG, PNG atau WebP (Maks 2MB).
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={initialData?.email} 
                disabled 
                className="bg-muted/50 border-dashed"
              />
              <p className="text-[10px] text-muted-foreground italic">
                * Email tidak dapat diubah
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input 
                id="name" 
                placeholder="Nama Anda" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto px-8 font-bold" disabled={isLoading}>
            {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
