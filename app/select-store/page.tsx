import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconBuildingStore, IconChevronRight, IconMail } from "@tabler/icons-react"
import { SelectStoreButton } from "./select-store-button"
import { getPendingInvitations } from "@/lib/staff-actions"
import { InvitationsList } from "./invitations-list"
import { JoinStoreDialog } from "./join-store-dialog"
import { LogoutButton } from "./logout-button"
import Link from "next/link"

export default async function SelectStorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch only ACTIVE stores
  const { data: memberships, error } = await supabase
    .from("store_members")
    .select(`
      role,
      stores (
        id,
        name,
        business_type,
        address,
        logo_url
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "active")

  if (error) {
    console.error("Error fetching memberships:", error)
  }

  const stores = memberships?.map(m => ({
    ...(m.stores as any),
    role: m.role
  })) || []

  // Removed automatic redirect to setup to allow users to see join options first
  const invitations = await getPendingInvitations()

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <LogoutButton />
      </div>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border shadow-sm overflow-hidden">
            <IconBuildingStore size={36} />
          </div>
          <h1 className="text-3xl font-black tracking-tight tracking-tighter">Pilih Toko</h1>
          <p className="text-muted-foreground text-sm">
            {stores.length > 0 
              ? "Silakan pilih toko untuk mulai mengelola operasional."
              : "Anda belum memiliki toko aktif. Cek undangan atau buat baru."}
          </p>
        </div>

        {/* Invitations Section */}
        {invitations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <IconMail size={16} className="text-primary" />
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Undangan Baru ({invitations.length})</h2>
            </div>
            <InvitationsList invitations={invitations} />
          </div>
        )}

        {/* Stores Section */}
        {stores.length > 0 && (
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-1">
              <IconBuildingStore size={16} className="text-primary" />
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Outlet Anda</h2>
            </div>
            <div className="grid gap-2">
              {stores.map((store) => (
                <Card key={store.id} className=" p-1 group hover:border-primary transition-all cursor-pointer overflow-hidden relative border border-black/5 bg-background shadow-sm rounded-xl">
                  <SelectStoreButton storeId={store.id}>
                    <CardHeader className="p-2.5 flex flex-row items-center gap-4 space-y-0">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/5 transition-all duration-300 overflow-hidden shrink-0 border border-black/5 shadow-inner">
                        {store.logo_url ? (
                          <img src={store.logo_url} alt={store.name} className="h-full w-full object-cover" />
                        ) : (
                          <IconBuildingStore size={26} className="group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <CardTitle className="text-lg font-black tracking-tight truncate">{store.name}</CardTitle>
                        <CardDescription className="text-xs font-medium truncate">
                          <span className="text-primary uppercase tracking-tighter font-black">{store.role}</span> • {store.business_type || "Toko"}
                        </CardDescription>
                      </div>
                      <IconChevronRight size={22} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </CardHeader>
                  </SelectStoreButton>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pt-4 space-y-3">
          <JoinStoreDialog />
          <p className="text-[10px] text-muted-foreground italic mb-2">Ingin mengelola toko baru?</p>
          <Link href="/setup">
            <Button variant="outline" className="rounded-2xl w-full h-12 font-bold border-primary text-primary hover:bg-primary/5">
              + Daftarkan Toko / Outlet Baru
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
