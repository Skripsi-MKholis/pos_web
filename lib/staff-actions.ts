"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { setActiveStoreId } from "./store-actions"

export async function getStoreStaff(storeId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("store_members")
    .select(`
      id,
      role,
      status,
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

  // 3. Add to store_members as 'pending'
  const { error: insertError } = await supabase
    .from("store_members")
    .insert([{ store_id: storeId, user_id: user.id, role, status: 'pending' }])

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

export async function acceptInvitation(memberId: string) {
  const supabase = await createClient()

  const { data: member, error: fetchError } = await supabase
    .from("store_members")
    .select("store_id")
    .eq("id", memberId)
    .single()

  if (fetchError || !member) return { error: "Undangan tidak ditemukan." }

  const { error } = await supabase
    .from("store_members")
    .update({ status: 'active' })
    .eq("id", memberId)

  if (error) return { error: error.message }

  // Set as active store immediately
  await setActiveStoreId(member.store_id)

  revalidatePath("/select-store")
  return { success: true, storeId: member.store_id }
}

export async function declineInvitation(memberId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("store_members")
    .delete()
    .eq("id", memberId)

  if (error) return { error: error.message }

  revalidatePath("/select-store")
  return { success: true }
}

export async function getPendingInvitations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("store_members")
    .select(`
      id,
      role,
      stores (
        id,
        name,
        address,
        logo_url
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "pending")

  if (error) {
    console.error("Error fetching invitations:", error)
    return []
  }

  return data
}

export async function joinStoreByCode(code: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // 1. Find store by code using RPC (to bypass RLS for lookup)
  const { data: store, error: storeError } = await supabase
    .rpc("get_store_by_invite_code", { code })
    .single() as { data: { id: string, name: string } | null, error: any }

  if (storeError || !store) {
    return { error: "Kode undangan tidak valid atau sudah kedaluwarsa." }
  }

  // 2. Check if already a member
  const { data: existingMember } = await supabase
    .from("store_members")
    .select("id")
    .eq("store_id", store.id)
    .eq("user_id", user.id)
    .single()

  if (existingMember) {
    return { error: "Anda sudah menjadi anggota toko ini." }
  }

  // 3. Join as active immediately (per user request)
  const { error: insertError } = await supabase
    .from("store_members")
    .insert([{ 
      store_id: store.id, 
      user_id: user.id, 
      role: "Karyawan",
      status: "active" 
    }])

  if (insertError) return { error: insertError.message }

  // Set as active store immediately
  await setActiveStoreId(store.id)

  revalidatePath("/select-store")
  return { success: true, storeName: store.name, storeId: store.id }
}

export async function refreshStoreInviteCode(storeId: string) {
  const supabase = await createClient()
  
  // Generate a random 8 char code
  const newCode = Math.random().toString(36).substring(2, 10).toUpperCase()

  const { error } = await supabase
    .from("stores")
    .update({ invite_code: newCode })
    .eq("id", storeId)

  if (error) return { error: error.message }

  revalidatePath("/dashboard/settings/staff")
  return { success: true, code: newCode }
}

export async function getStoreInviteCode(storeId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("stores")
    .select("invite_code")
    .eq("id", storeId)
    .single()

  if (error) return null
  return data?.invite_code
}
