"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconEdit, IconLoader2, IconPackage, IconPlus, IconUpload, IconX } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateProduct } from "@/lib/product-actions"
import { createClient } from "@/lib/supabase/client"

export function EditProductDialog({ 
  product, 
  categories 
}: { 
  product: any; 
  categories: any[] 
}) {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(product.image_url)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = React.useState({
    name: product.name,
    price: product.price.toString(),
    sku: product.sku || "",
    category_id: product.category_id || "none",
    stock_quantity: product.stock_quantity.toString(),
    min_stock_level: product.min_stock_level.toString()
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name || !formData.price) return

    setIsLoading(true)
    try {
      let imageUrl = product.image_url

      // 1. Upload new image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${product.store_id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile)

        if (uploadError) throw new Error("Gagal mengupload gambar")

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        
        imageUrl = publicUrl
      }

      // 2. Update product
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        sku: formData.sku || null,
        category_id: formData.category_id === "none" ? null : formData.category_id,
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock_level: parseInt(formData.min_stock_level),
        image_url: imageUrl
      }

      const result = await updateProduct(product.id, payload)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Produk berhasil diperbarui")
        setOpen(false)
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
          <IconEdit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>
              Ubah detail produk Anda di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Image Upload Area */}
            <div className="flex flex-col items-center gap-4">
              <Label htmlFor={`edit-image-${product.id}`} className="cursor-pointer w-full">
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 hover:bg-accent/50 transition-colors flex flex-col items-center justify-center min-h-[150px] relative overflow-hidden group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <IconUpload className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <IconPlus className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Klik untuk ganti foto</span>
                    </>
                  )}
                  <input 
                    id={`edit-image-${product.id}`} 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                </div>
              </Label>
              {imagePreview && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="h-8"
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Hapus Foto
                </Button>
              )}
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nama Produk*</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama produk"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Harga (Rp)*</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-sku">SKU / Kode</Label>
                  <Input
                    id="edit-sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Kategori</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa Kategori</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Stok</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-min-stock">Stok Minimum</Label>
                  <Input
                    id="edit-min-stock"
                    type="number"
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Produk
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
