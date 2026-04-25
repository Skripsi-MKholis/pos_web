"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { IconBrandGoogle, IconBuildingStore, IconLoader2 } from "@tabler/icons-react"
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
import { signup, signInWithGoogle } from "@/lib/auth-actions"

const registerSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("fullName", data.fullName)
      formData.append("email", data.email)
      formData.append("password", data.password)
      
      const result = await signup(formData)
      
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat registrasi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <IconBuildingStore size={28} />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Buat Akun Baru
          </h1>
          <p className="text-sm text-muted-foreground">
            Mulai kelola bisnis Anda dengan sistem POS modern.
          </p>
        </div>

        <Card>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Daftar</CardTitle>
              <CardDescription>
                Lengkapi data di bawah untuk membuat akun.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  disabled={isLoading}
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>
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
                <Label htmlFor="password">Password</Label>
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
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  disabled={isLoading}
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && (
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Daftar Sekarang
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Atau daftar dengan
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                type="button" 
                className="w-full" 
                onClick={() => signInWithGoogle()}
                disabled={isLoading}
              >
                <IconBrandGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>

              <p className="px-8 text-center text-sm text-muted-foreground pt-2">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="hover:text-brand underline underline-offset-4"
                >
                  Login di sini
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
