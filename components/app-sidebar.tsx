"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { StoreSwitcher } from "@/components/store-switcher"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { 
  IconDashboard, 
  IconCashRegister, 
  IconPackage, 
  IconReceipt, 
  IconSettings, 
  IconHelp, 
  IconBuildingStore,
  IconFlame,
  IconCoffee,
  IconTag,
  IconUserCircle
} from "@tabler/icons-react"

const data = {
  stores: [
    {
      name: "Toko Utama POS",
      logo: IconBuildingStore,
      plan: "Enterprise",
    },
    {
      name: "Cabang Bandung",
      logo: IconFlame,
      plan: "Professional",
    },
    {
      name: "Cabang Jakarta",
      logo: IconCoffee,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <IconDashboard className="size-4" />,
    },
    {
      title: "Kasir",
      url: "/dashboard/cashier",
      icon: <IconCashRegister className="size-4" />,
    },
  ],
  inventory: [
    {
      title: "Produk",
      url: "/dashboard/products",
      icon: <IconPackage className="size-4" />,
    },
    {
      title: "Kategori",
      url: "/dashboard/categories",
      icon: <IconTag className="size-4" />,
    },
  ],
  reports: [
    {
      title: "Riwayat Transaksi",
      url: "/dashboard/transactions",
      icon: <IconReceipt className="size-4" />,
    },
  ],
  settings: [
    {
      title: "Profil Saya",
      url: "/dashboard/settings/profile",
      icon: <IconUserCircle className="size-4" />,
    },
    {
      title: "Pengaturan Toko",
      url: "/dashboard/settings/store",
      icon: <IconBuildingStore className="size-4" />,
    },
    {
      title: "Bantuan",
      url: "#",
      icon: <IconHelp className="size-4" />,
    },
  ],
}

export function AppSidebar({ 
  user,
  ...props 
}: { 
  user: { name: string; email: string; avatar: string } 
} & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <StoreSwitcher stores={data.stores} />
      </SidebarHeader>
      <SidebarContent>
        {/* Utama Section */}
        <div className="px-2 pt-4">
           <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
             Utama
           </SidebarGroupLabel>
           <NavMain items={data.navMain} />
        </div>

        {/* Inventory Section */}
        <div className="px-2 pt-2">
           <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
             Inventaris
           </SidebarGroupLabel>
           <NavMain items={data.inventory} />
        </div>

        {/* Laporan Section */}
        <div className="px-2 pt-2">
           <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
             Laporan
           </SidebarGroupLabel>
           <NavMain items={data.reports} />
        </div>

        {/* Pengaturan Section */}
        <NavSecondary items={data.settings} className="mt-auto border-t bg-muted/20" />
      </SidebarContent>
      <SidebarFooter className="border-t bg-background">
        <div className="flex items-center justify-between p-2">
          <NavUser user={user} />
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
