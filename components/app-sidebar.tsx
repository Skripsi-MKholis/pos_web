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
  IconToolsKitchen2,
  IconTicket,
  IconLayoutGrid
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
  overview: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <IconDashboard className="size-4" />,
    }
  ],
  pos: [
    {
      title: "Kasir (POS)",
      url: "/dashboard/cashier",
      icon: <IconCashRegister className="size-4" />,
    },
    {
      title: "Manajemen Meja",
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
  inventory: [
    {
      title: "Produk",
      url: "/dashboard/products",
      icon: <IconPackage className="size-4" />,
    },
    {
      title: "Kategori",
      url: "/dashboard/categories",
      icon: <IconLayoutGrid className="size-4" />,
    },
    {
      title: "Program Diskon",
      url: "/dashboard/promotions",
      icon: <IconTag className="size-4" />,
    },
  ],
  marketing: [
    {
      title: "Pelanggan",
      url: "/dashboard/customers",
      icon: <IconUserCircle className="size-4" />,
    },
    {
      title: "Voucher Belanja",
      url: "/dashboard/promotions?tab=vouchers", // Assuming tab support or split view
      icon: <IconTicket className="size-4" />,
    },
    {
      title: "Broadcast Area",
      url: "/dashboard/broadcast",
      icon: <IconSpeakerphone className="size-4" />,
    },
    {
      title: "Notifikasi",
      url: "/dashboard/notifications",
      icon: <IconHistory className="size-4" />,
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
      title: "Informasi Toko",
      url: "/dashboard/settings/store",
      icon: <IconBuildingStore className="size-4" />,
    },
    {
      title: "Cetak & Struk",
      url: "/dashboard/settings/receipt",
      icon: <IconReceipt className="size-4" />,
    },
    {
      title: "Konfigurasi Meja",
      url: "/dashboard/settings/tables",
      icon: <IconArmchair className="size-4" />,
    },
    {
      title: "Akses Staf",
      url: "/dashboard/settings/staff",
      icon: <IconShieldCheck className="size-4" />,
    },
    {
      title: "Langganan",
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

  // Navigation filtering based on Role
  const filteredOverview = data.overview
  const filteredPos = data.pos
  const filteredReports = data.reports.filter(it => isOwner || it.title === "Riwayat Transaksi")
  const filteredSettings = data.settings.filter(it => isOwner || ["Profil Saya", "Bantuan"].includes(it.title))
  const filteredMarketing = data.marketing.filter(it => isOwner || it.title === "Notifikasi")

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
        {/* OVERVIEW SECTION */}
        <div className="px-2 pt-4">
           <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
             Analytics
           </SidebarGroupLabel>
           <NavMain items={filteredOverview} />
        </div>

        {/* OPERATIONS SECTION */}
        <div className="px-2 pt-4">
           <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
             Operasional Kasir
           </SidebarGroupLabel>
           <NavMain items={filteredPos} />
        </div>

        {/* INVENTORY SECTION (Owner Only) */}
        {isOwner && (
          <div className="px-2 pt-4">
             <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
               Katalog & Stok
             </SidebarGroupLabel>
             <NavMain items={data.inventory} />
          </div>
        )}

        {/* MARKETING & CRM SECTION */}
        <div className="px-2 pt-4">
           <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
             Pelanggan & Promo
           </SidebarGroupLabel>
           <NavMain items={filteredMarketing} />
        </div>

        {/* FINANCE SECTION */}
        <div className="px-2 pt-4">
           <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
             Laporan & Audit
           </SidebarGroupLabel>
           <NavMain items={filteredReports} />
        </div>

        {/* SETTINGS SECTION */}
        <div className="mt-8 pb-4">
          <NavSecondary items={filteredSettings} className="border-t bg-muted/20" />
        </div>
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
