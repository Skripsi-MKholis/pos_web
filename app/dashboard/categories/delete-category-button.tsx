"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconTrash, IconLoader2 } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { deleteCategory } from "@/lib/product-actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export function DeleteCategoryButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  async function onConfirm() {
    setIsLoading(true)
    try {
      const result = await deleteCategory(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Kategori berhasil dihapus")
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
        title="Hapus Kategori"
        description="Apakah Anda yakin ingin menghapus kategori ini? Produk dengan kategori ini akan secara otomatis menjadi 'Tanpa Kategori'."
        onConfirm={onConfirm}
        isLoading={isLoading}
      />
    </>
  )
}
