import * as React from "react"
import { 
  IconSettings, 
  IconBell, 
  IconShieldLock, 
  IconMessage2,
  IconPlus,
  IconTrash
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/server"

import { SettingsClient } from "./settings-client"

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  
  // Fetch app configs
  const { data: configs } = await supabase
    .from('app_configs')
    .select('*')

  return (
    <div className="flex flex-1 flex-col py-4 md:py-6 px-4 lg:px-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">System Control</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Konfigurasi global dan manajemen komunikasi sistem</p>
      </div>

      <SettingsClient initialConfigs={configs || []} />
    </div>
  )
}
