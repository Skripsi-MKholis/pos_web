import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconBuildingStore, IconChevronRight } from "@tabler/icons-react"
import { SelectStoreButton } from "./select-store-button"

export default async function SelectStorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch stores via store_members to handle both Owner and Karyawan roles
  const { data: memberships, error } = await supabase
    .from("store_members")
    .select(`
      role,
      stores (
        id,
        name,
        business_type,
        address
      )
    `)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching memberships:", error)
  }

  const stores = memberships?.map(m => ({
    ...(m.stores as any),
    role: m.role
  })) || []

  // If no stores, redirect to setup
  if (stores.length === 0) {
    redirect("/setup")
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <IconBuildingStore size={32} />
          </div>
          <h1 className="text-2xl font-bold">Pilih Toko</h1>
          <p className="text-muted-foreground">Silakan pilih toko untuk mulai mengelola operasional.</p>
        </div>

        <div className="grid gap-3">
          {stores.map((store) => (
            <Card key={store.id} className="group hover:border-primary transition-all cursor-pointer overflow-hidden relative border-border/50">
              <SelectStoreButton storeId={store.id}>
                <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <IconBuildingStore size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <CardTitle className="text-base font-bold">{store.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {store.role} • {store.business_type || "Toko"}
                    </CardDescription>
                  </div>
                  <IconChevronRight size={20} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardHeader>
              </SelectStoreButton>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Ingin mengelola toko baru?</p>
          <Button variant="outline" className="rounded-xl w-full" asChild>
            <a href="/setup">+ Daftarkan Toko Baru</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
