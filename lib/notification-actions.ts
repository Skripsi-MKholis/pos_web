"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getNotifications(storeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .or(`user_id.eq.${user.id},and(user_id.is.null,store_id.eq.${storeId})`)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data
}

export async function createNotification(data: {
  store_id: string;
  user_id?: string | null;
  type: string;
  title: string;
  message: string;
}) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("notifications")
    .insert([data])

  if (error) {
    console.error("Error creating notification:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard", "layout")
  return { success: true }
}

export async function markAsRead(notificationId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)

  if (error) return { error: error.message }

  revalidatePath("/dashboard", "layout")
  return { success: true }
}

export async function markAllAsRead(storeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("store_id", storeId)
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .eq("is_read", false)

  if (error) return { error: error.message }

  revalidatePath("/dashboard", "layout")
  return { success: true }
}

export async function deleteNotification(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/dashboard", "layout")
  return { success: true }
}

export async function clearNotifications(storeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("store_id", storeId)
    .or(`user_id.eq.${user.id},user_id.is.null`)

  if (error) return { error: error.message }

  revalidatePath("/dashboard", "layout")
  return { success: true }
}
