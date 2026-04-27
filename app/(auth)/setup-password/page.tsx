"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { IconLock, IconLoader2, IconSparkles } from "@tabler/icons-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const passwordSchema = z.object({
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

export default function SetupPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: PasswordFormValues) {
    setIsLoading(true)
    
    const { error } = await supabase.auth.updateUser({
      password: data.password,
      data: { password_set: true } // Mark that password has been set
    })
    
    if (error) {
      toast.error(error.message)
      setIsLoading(false)
    } else {
      toast.success("Password berhasil diperbarui!")
      // We don't set loading to false here because we're redirecting, 
      // but if the middleware forces us back, we'd be stuck. 
      // So we refresh first or just redirect.
      router.push("/select-store")
      router.refresh()
    }
  }

  const handleSkip = () => {
    router.push("/select-store")
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <IconLock size={32} strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter">
            Keamanan Akun
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Atur kata sandi Anda untuk akses lebih mudah di masa depan.
          </p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-emerald-400" />
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="space-y-1 pt-8">
              <CardTitle className="text-xl font-black uppercase tracking-tight">Atur Kata Sandi</CardTitle>
              <CardDescription>
                Gunakan minimal 6 karakter kombinasi huruf dan angka.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="password">Password Baru</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                  disabled={isLoading}
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive font-bold">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                  disabled={isLoading}
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive font-bold">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pb-8">
              <Button className="mt-5 w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <IconSparkles className="mr-2 h-4 w-4" />
                )}
                Simpan & Lanjutkan
              </Button>
              <Button 
                variant="ghost" 
                type="button" 
                className="w-full h-12 rounded-xl font-bold text-muted-foreground" 
                onClick={handleSkip}
                disabled={isLoading}
              >
                Lewati, Saya sudah punya
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="px-8 text-center text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-40">
          Parzello Enterprise Security System
        </p>
      </div>
    </div>
  )
}
