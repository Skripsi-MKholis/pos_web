"use client"

import * as React from "react"
import { IconCheck, IconChevronDown, IconPlus, IconBuildingStore, IconLayoutGrid } from "@tabler/icons-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { setActiveStoreId } from "@/lib/store-actions"

export function StoreSwitcher({
  stores,
  activeStoreId,
}: {
  stores: any[]
  activeStoreId?: string
}) {
  const { isMobile } = useSidebar()
  
  const currentStore = stores.find(s => s.id === activeStoreId) || stores[0] || {
    name: "Pilih Toko",
    plan: "Free",
    logo: IconBuildingStore
  }

  const handleSwitchStore = async (storeId: string) => {
    await setActiveStoreId(storeId)
    window.location.reload()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary overflow-hidden border">
                {currentStore.logo_url ? (
                  <img src={currentStore.logo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <IconBuildingStore className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-primary">
                  {currentStore.name}
                </span>
                <span className="truncate text-xs opacity-50">Outlet Active</span>
              </div>
              <IconChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Stores
            </DropdownMenuLabel>
            {stores.map((store, index) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => handleSwitchStore(store.id)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <IconBuildingStore className="size-4 shrink-0" />
                  )}
                </div>
                {store.name}
                {currentStore.id === store.id && (
                  <IconCheck className="ml-auto size-4" />
                )}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Link href="/select-store" className="cursor-pointer">
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <IconLayoutGrid className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Lihat Semua Toko</div>
              </DropdownMenuItem>
            </Link>
            <Link href="/setup" className="cursor-pointer">
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <IconPlus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Tambah Toko / Outlet</div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
