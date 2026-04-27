import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { getStores, getActiveStoreId } from "@/lib/store-actions"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch profile to get full name
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  const userData = {
    name: profile?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    avatar: profile?.avatar_url || "",
  }

  const stores = await getStores()
  const activeStoreId = await getActiveStoreId()
  
  if (!activeStoreId && stores.length > 0) {
    redirect("/select-store")
  }

  if (stores.length === 0) {
    redirect("/setup")
  }

  // Get role for active store
  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0]
  const userRole = (activeStore as any)?.store_members?.[0]?.role || "Owner"

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar 
        user={userData} 
        stores={stores} 
        activeStoreId={activeStoreId} 
        userRole={userRole}
        storeSettings={activeStore?.settings}
        variant="inset" 
      />
      <SidebarInset>
        <SiteHeader storeId={activeStoreId} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
