"use client"

import * as React from "react"
import Link from "next/link"
import { IconArrowRight, IconCheck, IconDownload, IconLoader2, IconMail } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type SubmitState = "idle" | "loading" | "success" | "error"

const googleGroupUrl = "https://groups.google.com/g/parzello-tester"
const googlePlayTestingUrl = "https://play.google.com/apps/testing/com.parzello.pos_mobile"

async function readApiMessage(response: Response) {
  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as { message?: string }
    return payload.message
  }

  const text = await response.text()
  return text.trim().startsWith("<")
    ? "Server mengembalikan halaman HTML, bukan JSON. Cek route API dan konfigurasi server."
    : text || undefined
}

export function DownloadEmailModal() {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [state, setState] = React.useState<SubmitState>("idle")
  const [message, setMessage] = React.useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState("loading")
    setMessage("")

    try {
      const response = await fetch("/api/download-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
      const apiMessage = await readApiMessage(response)

      if (!response.ok) {
        throw new Error(apiMessage || "Email gagal disimpan.")
      }

      setState("success")
      setMessage(apiMessage || "Email berhasil disimpan.")
    } catch (error) {
      setState("error")
      setMessage(error instanceof Error ? error.message : "Email gagal didaftarkan.")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setState("idle")
          setMessage("")
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="h-13 rounded-2xl px-6 text-xs font-black uppercase tracking-widest sm:h-14">
          <IconDownload size={18} />
          Download Aplikasi
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Download Beta App</DialogTitle>
            <DialogDescription>
              Ikuti 3 langkah berikut untuk mendapatkan akses testing Parzello POS Mobile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <StepCard
              number="1"
              title="Isi Email"
              description="Email disimpan ke waitlist Supabase untuk pendataan tester."
              active={state !== "success"}
              done={state === "success"}
            >
              <div className="space-y-2">
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@email.com"
                  className="h-12 rounded-2xl bg-background"
                  disabled={state === "loading" || state === "success"}
                />
                {message ? (
                  <p className={`text-sm font-bold ${state === "success" ? "text-primary" : "text-destructive"}`}>
                    {message}
                  </p>
                ) : null}
              </div>
            </StepCard>

            <StepCard
              number="2"
              title="Join Google Group"
              description="Gunakan email yang sama agar akses testing Play Store dikenali."
              active={state === "success"}
            >
              <Button
                asChild
                type="button"
                variant="outline"
                className="h-11 w-full rounded-2xl text-xs font-black uppercase tracking-widest"
                disabled={state !== "success"}
              >
                <Link href={googleGroupUrl} target="_blank" rel="noreferrer">
                  <IconMail size={17} />
                  Buka Google Group
                </Link>
              </Button>
            </StepCard>

            <StepCard
              number="3"
              title="Buka Google Play Testing"
              description="Setelah join group, buka link testing untuk install aplikasi."
              active={state === "success"}
            >
              <Button
                asChild
                type="button"
                variant="outline"
                className="h-11 w-full rounded-2xl text-xs font-black uppercase tracking-widest"
                disabled={state !== "success"}
              >
                <Link href={googlePlayTestingUrl} target="_blank" rel="noreferrer">
                  <IconArrowRight size={17} />
                  Buka Link Testing
                </Link>
              </Button>
            </StepCard>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="h-12 w-full rounded-2xl text-xs font-black uppercase tracking-widest"
              disabled={state === "loading" || state === "success"}
            >
              {state === "loading" ? <IconLoader2 className="animate-spin" size={18} /> : <IconDownload size={18} />}
              {state === "success" ? "Email Tersimpan" : "Simpan Email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function StepCard({
  number,
  title,
  description,
  active,
  done,
  children,
}: {
  number: string
  title: string
  description: string
  active?: boolean
  done?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`rounded-2xl border p-4 ${active ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"}`}>
      <div className="mb-3 flex gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">
          {done ? <IconCheck size={16} strokeWidth={3} /> : number}
        </span>
        <div>
          <h3 className="font-black tracking-tight">{title}</h3>
          <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
