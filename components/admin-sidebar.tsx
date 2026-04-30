"use client"

// Sidebar component for Super Admin Dashboard

import * as React from "react"
import {
  IconLayoutDashboard,
  IconBuildingStore,
  IconUsers,
  IconSettings,
  IconShieldCheck,
  IconLogout,
  IconHelpCircle,
  IconCreditCard,
  IconChartBar
} from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const adminNav = [
  {
    title: "Overview",
    url: "/admin",
    icon: <IconLayoutDashboard size={20} />,
  },
  {
    title: "Manajemen Toko",
    url: "/admin/stores",
    icon: <IconBuildingStore size={20} />,
  },
  {
    title: "Manajemen User",
    url: "/admin/users",
    icon: <IconUsers size={20} />,
  },
  {
    title: "Paket Langganan",
    url: "/admin/plans",
    icon: <IconCreditCard size={20} />,
  },
  {
    title: "Analitik Global",
    url: "/admin/analytics",
    icon: <IconChartBar size={20} />,
  },
]

const systemNav = [
  {
    title: "System Settings",
    url: "/admin/settings",
    icon: <IconSettings size={20} />,
  },
  {
    title: "Audit Logs",
    url: "/admin/audit",
    icon: <IconShieldCheck size={20} />,
  },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  React.useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        setUser({ ...user, ...profile })
      }
    }
    getUser()
  }, [])

  const userData = user ? {
    name: user.full_name || user.email?.split('@')[0],
    email: user.email,
    avatar: "/avatars/admin.png",
  } : null

  return (
    <Sidebar collapsible="icon" className="border-none bg-background shadow-xl" {...props}>
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-muted/50">
        <div className="flex items-center gap-3 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <IconShieldCheck size={24} />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-black text-xl tracking-tighter uppercase italic">POS<span className="text-primary">ADMIN</span></span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest -mt-1">Super Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <div className="px-2">
           <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
             Management
           </SidebarGroupLabel>
           <NavMain items={adminNav} />
        </div>

        <div className="px-2 pt-6">
           <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
             System
           </SidebarGroupLabel>
           <NavMain items={systemNav} />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-muted/50 bg-muted/20">
        {userData && <NavUser user={userData} />}
        <SidebarMenu className="mt-2">
           <SidebarMenuItem>
             <SidebarMenuButton 
               onClick={() => router.push('/dashboard')}
               className="text-muted-foreground hover:text-primary transition-colors"
             >
               <IconLogout size={18} />
               <span>Back to Store</span>
             </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
