"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  IconDashboard, 
  IconCashRegister, 
  IconArmchair, 
  IconPackage, 
  IconReceipt, 
  IconCalendarStats, 
  IconTicket, 
  IconUsers,
  IconSettings, 
  IconHelp, 
  IconSearch, 
  IconDatabase, 
  IconReport, 
  IconFileWord, 
  IconInnerShadowTop,
  IconBuildingStore,
  IconFlame,
  IconCoffee,
  IconTag
} from "@tabler/icons-react"

const data = {
  user: {
    name: "Admin POS",
    email: "admin@pos.com",
    avatar: "/avatars/admin.jpg",
  },
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
      icon: <IconDashboard />,
    },
    {
      title: "Cashier",
      url: "/dashboard/cashier",
      icon: <IconCashRegister />,
    },
    {
      title: "Product",
      url: "/dashboard/products",
      icon: <IconPackage />,
    },
    {
      title: "Category",
      url: "/dashboard/categories",
      icon: <IconTag />,
    },
    {
      title: "Transaction",
      url: "#",
      icon: <IconReceipt />,
    },
    {
      title: "Reservation",
      url: "#",
      icon: <IconCalendarStats />,
    },
    {
      title: "Voucher",
      url: "#",
      icon: <IconTicket />,
    },
    {
      title: "Employee",
      url: "#",
      icon: <IconUsers />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <IconSettings />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <IconHelp />,
    },
    {
      title: "Search",
      url: "#",
      icon: <IconSearch />,
    },
  ],
  documents: [
    {
      name: "Inventory Report",
      url: "#",
      icon: <IconDatabase />,
    },
    {
      name: "Sales Report",
      url: "#",
      icon: <IconReport />,
    },
    {
      name: "Employee Log",
      url: "#",
      icon: <IconFileWord />,
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
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <NavUser user={user} />
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
