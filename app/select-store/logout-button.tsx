"use client"

import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth-actions"
import { IconLogout } from "@tabler/icons-react"
import * as React from "react"

export function LogoutButton() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await logout()
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 gap-2 font-black uppercase text-[10px] tracking-widest px-4"
    >
      <IconLogout size={14} strokeWidth={3} />
      {isLoading ? "Keluar..." : "Sign Out"}
    </Button>
  )
}
