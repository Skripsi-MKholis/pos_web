"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { FeatureBadge } from "./dashboard/feature-gate"

export function NavMain({
  items,
  storeId,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    feature?: string
  }[]
  storeId?: string
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  isActive={isActive}
                  className={cn(
                    "transition-all duration-200",
                    isActive && "!bg-primary !text-primary-foreground font-black shadow-lg shadow-primary/20 hover:!bg-primary hover:!text-primary-foreground"
                  )}
                >
                  <Link href={item.url} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.feature && storeId && (
                      <FeatureBadge feature={item.feature} storeId={storeId} />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
