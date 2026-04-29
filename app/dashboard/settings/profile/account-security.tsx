"use client"

import * as React from "react"
import { 
  IconShieldLock, 
  IconBrandGoogle, 
  IconMail, 
  IconDeviceLaptop, 
  IconLoader2,
  IconAlertCircle,
  IconCircleCheck,
  IconLock
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { updateUserPassword } from "@/lib/auth-actions"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { User } from "@supabase/supabase-js"

interface AccountSecurityProps {
  user: User
}

export function AccountSecurity({ user }: AccountSecurityProps) {
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false)
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [sessions, setSessions] = React.useState<any[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = React.useState(true)
  
  const supabase = createClient()
  const providers = user.app_metadata?.providers || []
  const hasGoogle = providers.includes('google')
  const hasEmail = providers.includes('email')
  const hasPassword = user.user_metadata?.password_set === true || hasEmail

  React.useEffect(() => {
    async function fetchSessions() {
      try {
        const { data, error } = await supabase.auth.getUserIdentities()
        // Supabase doesn't directly expose "active sessions" to the client easily without a server-side admin client
        // But we can show identities and current session info
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setSessions([session])
        }
      } catch (error) {
        console.error("Error fetching sessions:", error)
      } finally {
        setIsLoadingSessions(false)
      }
    }
    fetchSessions()
  }, [])

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }

    setIsUpdatingPassword(true)
    try {
      const result = await updateUserPassword(newPassword)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Password berhasil diperbarui")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch (error) {
      toast.error("Gagal memperbarui password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  async function handleLinkGoogle() {
    try {
      const { data, error } = await supabase.auth.linkIdentity({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })
      if (error) throw error
    } catch (error: any) {
      toast.error("Gagal menautkan Google: " + error.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Account Linking Section */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <IconShieldLock className="h-5 w-5 text-primary" />
            Tautan Akun
          </CardTitle>
          <CardDescription>
            Hubungkan akun Anda dengan penyedia pihak ketiga.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                <IconBrandGoogle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Google</p>
                <p className="text-xs text-muted-foreground">
                  {hasGoogle ? "Sudah terhubung" : "Belum terhubung"}
                </p>
              </div>
            </div>
            {hasGoogle ? (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none">
                <IconCircleCheck className="h-3 w-3 mr-1" />
                Terhubung
              </Badge>
            ) : (
              <Button variant="outline" size="sm" onClick={handleLinkGoogle}>
                Hubungkan
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <IconMail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Email & Password</p>
                <p className="text-xs text-muted-foreground">
                  {hasPassword ? "Aktif" : "Password belum diatur"}
                </p>
              </div>
            </div>
            {hasPassword ? (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none">
                <IconCircleCheck className="h-3 w-3 mr-1" />
                Aktif
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-none">
                <IconAlertCircle className="h-3 w-3 mr-1" />
                Perlu Setup
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Password Management Section */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <IconLock className="h-5 w-5 text-primary" />
            {hasPassword ? "Ubah Kata Sandi" : "Atur Kata Sandi"}
          </CardTitle>
          <CardDescription>
            {hasPassword 
              ? "Pastikan password Anda kuat dan sulit ditebak."
              : "Atur password agar Anda bisa login menggunakan email."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="font-bold" 
              disabled={isUpdatingPassword || !newPassword}
            >
              {isUpdatingPassword && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
              {hasPassword ? "Update Password" : "Atur Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sessions Section */}
      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <IconDeviceLaptop className="h-5 w-5 text-primary" />
            Sesi Aktif
          </CardTitle>
          <CardDescription>
            Perangkat yang saat ini masuk ke akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSessions ? (
            <div className="flex items-center justify-center py-4">
              <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <IconDeviceLaptop className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        {session.user.user_metadata.full_name || "Perangkat Saat Ini"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Terakhir aktif: {new Date().toLocaleDateString()} (Sesi Sekarang)
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                    Aktif
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
