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
    .or(`user_id.eq.${user.id},store_id.is.null,and(user_id.is.null,store_id.eq.${storeId})`)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data
}

export async function createNotification(data: {
  store_id?: string | null;
  user_id?: string | null;
  type: string;
  title: string;
  message: string;
  image_url?: string | null;
  metadata?: any;
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

export async function sendBroadcast(data: {
  storeId: string;
  type: string;
  title: string;
  message: string;
  targetType: "all" | "role" | "specific";
  targetRole?: string;
  targetUserId?: string;
}) {
  const supabase = await createClient()

  if (data.targetType === "all") {
    // Single notification for all in store
    return await createNotification({
      store_id: data.storeId,
      user_id: null,
      type: data.type,
      title: data.title,
      message: data.message,
    })
  }

  if (data.targetType === "role") {
    // Find users with that role
    const { data: members, error } = await supabase
      .from("store_members")
      .select("user_id")
      .eq("store_id", data.storeId)
      .eq("role", data.targetRole)

    if (error) return { error: error.message }

    const inserts = members.map(m => ({
      store_id: data.storeId,
      user_id: m.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
    }))

    const { error: insertError } = await supabase
      .from("notifications")
      .insert(inserts)

    if (insertError) return { error: insertError.message }
  }

  if (data.targetType === "specific") {
    return await createNotification({
      store_id: data.storeId,
      user_id: data.targetUserId,
      type: data.type,
      title: data.title,
      message: data.message,
    })
  }

  revalidatePath("/dashboard", "layout")
  return { success: true }
}
