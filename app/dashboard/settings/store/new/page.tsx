import { createStore } from "@/lib/store-actions"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconBuildingStore, IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

export default function NewStorePage() {
  async function action(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const address = formData.get("address") as string
    
    const result = await createStore(name, address)
    if (!result.error) {
      redirect("/dashboard")
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
      <div className="mb-6">
        <Link href="/dashboard/settings/store" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
          <IconArrowLeft size={16} />
          Kembali ke Pengaturan
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="border-none shadow-xl">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <IconBuildingStore size={28} />
            </div>
            <CardTitle className="text-2xl">Tambah Outlet Baru</CardTitle>
            <CardDescription>
              Buat cabang atau outlet baru untuk memperluas bisnis Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Outlet</Label>
                  <Input id="name" name="name" placeholder="Contoh: Cabang Bandung 1" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input id="address" name="address" placeholder="Jl. Raya No. 123" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Link href="/dashboard">
                  <Button variant="outline">Batal</Button>
                </Link>
                <Button type="submit" className="rounded-xl px-8 shadow-lg shadow-primary/20">
                  Buat Outlet
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
