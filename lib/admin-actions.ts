"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Check if the current user is a super admin
 */
export async function ensureAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) throw new Error("Forbidden: Super Admin only")
  return user
}

/**
 * Update store active status (Suspend/Activate)
 */
export async function updateStoreStatus(storeId: string, isActive: boolean) {
  await ensureAdmin()
  const supabase = await createClient()

  // For now, we use a metadata or settings field to represent "active" status
  // or we could add a 'status' column to the stores table.
  // Let's assume we use the 'settings' JSONB for now or add a column if needed.
  // I will add a 'status' column via migration next if it doesn't exist.
  const { error } = await supabase
    .from('stores')
    .update({ 
      settings: { 
        is_suspended: !isActive,
        suspended_at: isActive ? null : new Date().toISOString()
      } 
    })
    .eq('id', storeId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/stores')
  return { success: true }
}

/**
 * Assign or Revoke Admin status
 */
export async function updateUserAdminStatus(userId: string, isAdmin: boolean) {
  await ensureAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('users')
    .update({ is_admin: isAdmin })
    .eq('id', userId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}

/**
 * Update Subscription Plan configuration
 */
export async function updateSubscriptionPlan(planId: string, data: any) {
  await ensureAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('subscription_plans')
    .update(data)
    .eq('id', planId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/plans')
  revalidatePath('/dashboard/settings/billing')
  return { success: true }
}

/**
 * Create a system announcement
 */
export async function createAnnouncement(message: string, type: 'info' | 'warning' | 'error' = 'info') {
  await ensureAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('app_configs')
    .insert([{ 
      key: `announcement_${Date.now()}`, 
      value: JSON.stringify({ message, type, created_at: new Date().toISOString() }) 
    }])

  if (error) return { error: error.message }
  
  revalidatePath('/admin/settings')
  return { success: true }
}

/**
 * Delete a system announcement
 */
export async function deleteAnnouncement(key: string) {
  await ensureAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('app_configs')
    .delete()
    .eq('key', key)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/settings')
  return { success: true }
}

/**
 * Update app configuration
 */
export async function updateAppConfig(key: string, value: string) {
  await ensureAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('app_configs')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/settings')
  return { success: true }
}
