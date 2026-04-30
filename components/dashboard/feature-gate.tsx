"use client"

import React, { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { IconLock } from "@tabler/icons-react"
import { checkFeatureAccess } from "@/lib/subscription-actions"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FeatureGateProps {
  feature: string
  storeId: string
  children: React.ReactNode
  fallback?: React.ReactNode
  showBadge?: boolean
}

export function FeatureGate({ 
  feature, 
  storeId, 
  children, 
  fallback,
  showBadge = false 
}: FeatureGateProps) {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function check() {
      if (!storeId) return
      setIsLoading(true)
      const result = await checkFeatureAccess(storeId, feature)
      setIsAllowed(result.allowed)
      setIsLoading(false)
    }
    check()
  }, [feature, storeId])

  if (isLoading) {
    return <div className="animate-pulse bg-muted rounded-md h-10 w-full" />
  }

  if (isAllowed) {
    return (
      <div className="relative group">
        {children}
        {showBadge && (
          <Badge className="absolute -top-2 -right-2 bg-primary text-[8px] h-4 px-1 pointer-events-none">PRO</Badge>
        )}
      </div>
    )
  }

  if (fallback) return <>{fallback}</>

  return (
    <div className="relative border-2 border-dashed border-muted rounded-[2rem] p-8 flex flex-col items-center justify-center text-center gap-4 bg-muted/5">
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
        <IconLock size={32} />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-lg">Fitur Terbatas</h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Fitur ini tidak tersedia di paket anda saat ini. Silahkan upgrade paket untuk membuka akses.
        </p>
      </div>
      <Button asChild variant="default" className="rounded-xl px-8 h-12 shadow-lg shadow-primary/20">
        <Link href="/dashboard/settings/billing">Upgrade Paket Sekarang</Link>
      </Button>
    </div>
  )
}

export function FeatureBadge({ feature, storeId }: { feature: string, storeId: string }) {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    async function check() {
      if (!storeId) return
      const result = await checkFeatureAccess(storeId, feature)
      setIsAllowed(result.allowed)
    }
    check()
  }, [feature, storeId])

  if (isAllowed === null || isAllowed) return null

  return (
    <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 h-5">
      <IconLock size={10} strokeWidth={3} /> PRO
    </Badge>
  )
}
