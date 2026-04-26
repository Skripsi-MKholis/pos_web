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
  IconCalendar,
  IconUserCircle,
  IconShieldCheck,
  IconCrown,
  IconHistory,
  IconTrendingUp,
  IconSpeakerphone,
  IconArmchair,
  IconToolsKitchen2
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
    {
      title: "Pelanggan",
      url: "/dashboard/customers",
      icon: <IconUserCircle className="size-4" />,
    },
    {
      title: "Promosi",
      url: "/dashboard/promotions",
      icon: <IconTag className="size-4" />,
    },
    {
      title: "Monitoring Meja",
      url: "/dashboard/tables",
      icon: <IconArmchair className="size-4" />,
    },
    {
      title: "Reservasi",
      url: "/dashboard/reservations",
      icon: <IconCalendar className="size-4" />,
    },
    {
      title: "Dapur (KDS)",
      url: "/dashboard/kds",
      icon: <IconToolsKitchen2 className="size-4" />,
    },
  ],
  communication: [
    {
      title: "Broadcast",
      url: "/dashboard/broadcast",
      icon: <IconSpeakerphone className="size-4" />,
    },
    {
      title: "Notifikasi",
      url: "/dashboard/notifications",
      icon: <IconHistory className="size-4" />,
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
    {
      title: "Stok Global",
      url: "/dashboard/inventory/global",
      icon: <IconPackage className="size-4" />,
    },
  ],
  reports: [
    {
      title: "Riwayat Transaksi",
      url: "/dashboard/transactions",
      icon: <IconHistory className="size-4" />,
    },
    {
      title: "Laporan Laba Rugi",
      url: "/dashboard/reports/profit",
      icon: <IconTrendingUp className="size-4" />,
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
      title: "Struk & Printer",
      url: "/dashboard/settings/receipt",
      icon: <IconReceipt className="size-4" />,
    },
    {
      title: "Manajemen Meja",
      url: "/dashboard/settings/tables",
      icon: <IconArmchair className="size-4" />,
    },
    {
      title: "Manajemen Staf",
      url: "/dashboard/settings/staff",
      icon: <IconShieldCheck className="size-4" />,
    },
    {
      title: "Billing & Langganan",
      url: "/dashboard/settings/billing",
      icon: <IconCrown className="size-4" />,
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
  stores,
  activeStoreId,
  userRole = "Owner",
  ...props 
}: { 
  user: { name: string; email: string; avatar: string } 
  stores: any[]
  activeStoreId?: string
  userRole?: string
} & React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false)
  const isOwner = userRole === "Owner"

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Filter settings for Karyawan
  const filteredSettings = data.settings.filter(item => {
    if (isOwner) return true
    // Karyawan only see Profile and Help
    return ["Profil Saya", "Bantuan"].includes(item.title)
  })

  // Filter reports for Karyawan
  const filteredReports = data.reports.filter(item => {
    if (isOwner) return true
    // Karyawan only see History
    return ["Riwayat Transaksi"].includes(item.title)
  })

  if (!mounted) return (
    <Sidebar collapsible="offcanvas" {...props}>
      <div className="flex-1 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    </Sidebar>
  )

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <StoreSwitcher stores={stores} activeStoreId={activeStoreId} />
      </SidebarHeader>
      <SidebarContent>
        {/* Utama Section */}
        <div className="px-2 pt-4">
           <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
             Utama
           </SidebarGroupLabel>
           <NavMain items={
             data.navMain.filter(item => {
               if (isOwner) return true
               return ["Dashboard", "Kasir", "Pelanggan", "Monitoring Meja", "Reservasi", "Dapur (KDS)"].includes(item.title)
             })
           } />
        </div>

        {/* Komunikasi Section */}
        <div className="px-2 pt-2">
           <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
             Komunikasi
           </SidebarGroupLabel>
           <NavMain items={
             data.communication.filter(item => {
               if (isOwner) return true
               return item.title === "Notifikasi"
             })
           } />
        </div>

        {/* Inventory Section - ONLY FOR OWNER */}
        {isOwner && (
          <div className="px-2 pt-2">
             <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
               Inventaris
             </SidebarGroupLabel>
             <NavMain items={data.inventory} />
          </div>
        )}

        {/* Laporan Section */}
        <div className="px-2 pt-2">
           <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
             Laporan
           </SidebarGroupLabel>
           <NavMain items={filteredReports} />
        </div>

        {/* Pengaturan Section */}
        <NavSecondary items={filteredSettings} className="mt-auto border-t bg-muted/20" />
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
