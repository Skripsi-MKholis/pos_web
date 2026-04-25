import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "./profile-form"


export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="space-y-0.5">
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan Profil</h2>
        <p className="text-muted-foreground">
          Kelola informasi pribadi dan identitas akun Anda.
        </p>
      </div>
      <div className="max-w-2xl">
        <ProfileForm initialData={profile} />
      </div>
    </div>
  )
}
