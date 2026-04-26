"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function getStoreStaff(storeId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("store_members")
    .select(`
      id,
      role,
      created_at,
      users:user_id (
        id,
        full_name,
        email
      )
    `)
    .eq("store_id", storeId)

  if (error) {
    console.error("Error fetching staff:", error)
    return []
  }

  return data
}

export async function addStaffByEmail(storeId: string, email: string, role: "Owner" | "Karyawan") {
  const supabase = await createClient()

  // 1. Find user by email in public.users
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single()

  if (userError || !user) {
    return { error: "Pengguna dengan email tersebut tidak ditemukan. Pastikan pengguna sudah mendaftar." }
  }

  // 2. Check if already a member
  const { data: existingMember } = await supabase
    .from("store_members")
    .select("id")
    .eq("store_id", storeId)
    .eq("user_id", user.id)
    .single()

  if (existingMember) {
    return { error: "Pengguna sudah menjadi anggota toko ini." }
  }

  // 3. Add to store_members
  const { error: insertError } = await supabase
    .from("store_members")
    .insert([{ store_id: storeId, user_id: user.id, role }])

  if (insertError) return { error: insertError.message }

  revalidatePath("/dashboard/settings/staff")
  return { success: true }
}

export async function removeStaff(memberId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("store_members")
    .delete()
    .eq("id", memberId)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/settings/staff")
  return { success: true }
}
