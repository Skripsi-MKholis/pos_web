"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { IconBrandGoogle, IconBuildingStore, IconLoader2, IconArrowLeft } from "@tabler/icons-react"
import { toast } from "sonner"

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
import { login, signInWithGoogle } from "@/lib/auth-actions"
import posthog from "posthog-js"

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)
    
    const result = await login(formData)

    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
    } else {
      posthog.identify(data.email, { email: data.email })
      posthog.capture("user_logged_in", { method: "email" })
    }
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center lg:px-0">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <Button variant="ghost" className="rounded-full gap-2 text-muted-foreground hover:text-primary">
          <IconArrowLeft size={18} />
          Beranda
        </Button>
      </Link>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <IconBuildingStore size={28} />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan email dan password untuk masuk ke dashboard POS.
          </p>
        </div>

        <Card>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription>
                Gunakan akun yang sudah terdaftar.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  disabled={isLoading}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  disabled={isLoading}
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mt-5">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && (
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Masuk
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Atau lanjut dengan
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                type="button" 
                className="w-full" 
                onClick={() => { posthog.capture("user_logged_in_google", { method: "google" }); signInWithGoogle() }}
                disabled={isLoading}
              >
                <IconBrandGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>

              <p className="px-8 text-center text-sm text-muted-foreground pt-2">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="hover:text-brand underline underline-offset-4"
                >
                  Daftar di sini
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
