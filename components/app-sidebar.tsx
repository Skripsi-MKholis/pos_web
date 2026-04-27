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
  IconLayoutGrid,
  IconSettings
} from "@tabler/icons-react"

const data = {
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
      feature: "tables"
    },
    {
      title: "Konfigurasi Meja",
      url: "/dashboard/settings/tables",
      icon: <IconSettings className="size-4" />,
      feature: "tables"
    },
    {
      title: "Reservasi",
      url: "/dashboard/reservations",
      icon: <IconCalendar className="size-4" />,
      feature: "reservations"
    },
    {
      title: "Dapur (KDS)",
      url: "/dashboard/kds",
      icon: <IconToolsKitchen2 className="size-4" />,
      feature: "kds"
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
      feature: "promotions"
    },
  ],
  marketing: [
    {
      title: "Pelanggan",
      url: "/dashboard/customers",
      icon: <IconUserCircle className="size-4" />,
      feature: "customers"
    },
    {
      title: "Voucher Belanja",
      url: "/dashboard/promotions?tab=vouchers",
      icon: <IconTicket className="size-4" />,
      feature: "promotions"
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
      title: "Modul & Fitur",
      url: "/dashboard/settings/modules",
      icon: <IconSettings className="size-4" />,
      ownerOnly: true
    },
    {
      title: "Cetak & Struk",
      url: "/dashboard/settings/receipt",
      icon: <IconReceipt className="size-4" />,
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

const defaultSettings = {
  features: {
    tables: true,
    reservations: true,
    kds: true,
    promotions: true,
    customers: true
  }
}

export function AppSidebar({ 
  user,
  stores,
  activeStoreId,
  userRole = "Owner",
  storeSettings,
  ...props 
}: { 
  user: { name: string; email: string; avatar: string } 
  stores: any[]
  activeStoreId?: string
  userRole?: string
  storeSettings?: any
} & React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false)
  const isOwner = userRole === "Owner"
  const settings = storeSettings || defaultSettings

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Navigation filtering logic
  const filterByFeature = (items: any[]) => {
    return items.filter(item => {
      // Role gate
      if (item.ownerOnly && !isOwner) return false
      
      // Feature toggle gate
      if (item.feature) {
        const featureStatus = settings.features?.[item.feature]
        return featureStatus !== false // If undefined or true, show it
      }
      return true
    })
  }

  const filteredOverview = filterByFeature(data.overview)
  const filteredPos = filterByFeature(data.pos)
  const filteredInventory = filterByFeature(data.inventory)
  const filteredMarketing = filterByFeature(data.marketing)
  const filteredReports = filterByFeature(data.reports).filter(it => isOwner || it.title === "Riwayat Transaksi")
  const filteredSettings = filterByFeature(data.settings).filter(it => isOwner || ["Profil Saya", "Bantuan"].includes(it.title))

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
        {isOwner && filteredInventory.length > 0 && (
          <div className="px-2 pt-4">
             <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
               Katalog & Stok
             </SidebarGroupLabel>
             <NavMain items={filteredInventory} />
          </div>
        )}

        {/* MARKETING & CRM SECTION */}
        {filteredMarketing.length > 0 && (
          <div className="px-2 pt-4">
             <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
               Pelanggan & Promo
             </SidebarGroupLabel>
             <NavMain items={filteredMarketing} />
          </div>
        )}

        {/* FINANCE SECTION */}
        {filteredReports.length > 0 && (
          <div className="px-2 pt-4">
             <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
               Laporan & Audit
             </SidebarGroupLabel>
             <NavMain items={filteredReports} />
          </div>
        )}

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
