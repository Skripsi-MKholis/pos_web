"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconTrash, IconLoader2 } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/lib/product-actions"
import { createClient } from "@/lib/supabase/client"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export function DeleteProductButton({ 
  id, 
  imageUrl 
}: { 
  id: string; 
  imageUrl?: string | null 
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function onConfirm() {
    setIsLoading(true)
    try {
      // 1. Delete image from storage if exists
      if (imageUrl) {
        try {
          // Extract path from URL: .../public/product-images/{path}
          const urlParts = imageUrl.split('product-images/')
          if (urlParts.length > 1) {
            const filePath = urlParts[1]
            await supabase.storage
              .from('product-images')
              .remove([filePath])
          }
        } catch (storageError) {
          console.error("Gagal menghapus gambar dari storage:", storageError)
          // We continue to delete the product even if image deletion fails
        }
      }

      // 2. Delete product from DB
      const result = await deleteProduct(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Produk berhasil dihapus")
        router.refresh()
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-destructive hover:bg-destructive/10" 
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <IconLoader2 className="h-4 w-4 animate-spin" />
        ) : (
          <IconTrash className="h-4 w-4" />
        )}
      </Button>
      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Hapus Produk"
        description="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan dan gambar produk (jika ada) juga akan dihapus."
        onConfirm={onConfirm}
        isLoading={isLoading}
      />
    </>
  )
}
