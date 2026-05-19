import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null
  const email = body?.email?.trim().toLowerCase()

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ message: "Masukkan email yang valid." }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from("download_waitlist").insert({
    email,
    source: "download_page",
  })

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ message: "Email sudah terdaftar. Lanjutkan ke langkah berikutnya." })
    }

    return NextResponse.json(
      { message: error.message || "Email gagal disimpan." },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: "Email berhasil disimpan. Lanjutkan ke langkah berikutnya." })
}
