import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SetupForm } from "@/app/setup/setup-form"
import { IconBuildingStore } from "@tabler/icons-react"

export default async function SetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // No longer redirect if they have a store, because they might be adding a NEW one.

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <IconBuildingStore size={36} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-6">Selamat Datang!</h1>
          <p className="text-muted-foreground">
            Satu langkah lagi untuk memulai bisnis Anda. Mari buat toko pertama Anda.
          </p>
        </div>
        
        <SetupForm />
      </div>
    </div>
  )
}
