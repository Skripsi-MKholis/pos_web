"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { setActiveStoreId } from "@/lib/store-actions"

export function SelectStoreButton({ 
  storeId, 
  children 
}: { 
  storeId: string; 
  children: React.ReactNode 
}) {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)

  const handleSelect = async () => {
    setIsPending(true)
    try {
      await setActiveStoreId(storeId)
      // Force reload to ensure all server components use the new store ID
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Failed to set active store:", error)
      setIsPending(false)
    }
  }

  return (
    <button 
      onClick={handleSelect} 
      className="w-full text-left bg-transparent border-none p-0 m-0 cursor-pointer relative block disabled:cursor-not-allowed"
      disabled={isPending}
    >
      {isPending && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {children}
    </button>
  )
}
