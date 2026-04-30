"use server"

import { createClient } from "@/lib/supabase/server"

export type Plan = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  max_outlets: number
  max_transactions: number
  features: Record<string, boolean>
}

export type Subscription = {
  id: string
  store_id: string
  plan_id: string
  status: 'active' | 'expired' | 'trial'
  start_date: string
  end_date: string | null
  plan: Plan
}

export async function getSubscriptionPlans(): Promise<Plan[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("price", { ascending: true })

  if (error) {
    console.error("Error fetching plans:", error)
    return []
  }

  return data as Plan[]
}

export async function getStoreSubscription(storeId: string): Promise<Subscription | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, plan:subscription_plans(*)")
    .eq("store_id", storeId)
    .maybeSingle()

  if (error) {
    console.error("Error fetching subscription:", error)
    return null
  }

  return data as Subscription
}

export async function isSubscriptionGatingEnabled(): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("app_configs")
    .select("value")
    .eq("key", "subscription_gating_enabled")
    .single()

  if (error) {
    // Default to true if config not found
    return true
  }

  return data.value === 'true'
}

export async function getMonthlyTransactionCount(storeId: string): Promise<number> {
  const supabase = await createClient()
  
  // Get start of current month
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  
  const { count, error } = await supabase
    .from("transactions")
    .select("*", { count: 'exact', head: true })
    .eq("store_id", storeId)
    .gte("created_at", startOfMonth)

  if (error) {
    console.error("Error fetching transaction count:", error)
    return 0
  }

  return count || 0
}

export async function checkFeatureAccess(storeId: string, featureKey: string): Promise<{
  allowed: boolean
  reason?: 'PLAN_RESTRICTED' | 'LIMIT_REACHED' | 'CONFIG_DISABLED'
}> {
  // 1. Check if gating is enabled globally
  const gatingEnabled = await isSubscriptionGatingEnabled()
  if (!gatingEnabled) {
    return { allowed: true, reason: 'CONFIG_DISABLED' }
  }

  // 2. Get active subscription
  const subscription = await getStoreSubscription(storeId)
  if (!subscription) {
    // If no subscription found, default to restricted or lite?
    // Based on our trigger, there should always be a subscription.
    return { allowed: false, reason: 'PLAN_RESTRICTED' }
  }

  // 3. Check feature list in plan
  const plan = subscription.plan
  if (plan.features[featureKey] === true) {
    return { allowed: true }
  }

  // Special cases for generic features that are always allowed or have limits
  if (featureKey === 'basic_reports') return { allowed: true }
  if (featureKey === 'tables') return { allowed: true } // Lite has tables

  return { allowed: false, reason: 'PLAN_RESTRICTED' }
}

export async function updateStorePlan(storeId: string, planSlug: string) {
  const supabase = await createClient()
  
  // 1. Get plan ID
  const { data: plan, error: planError } = await supabase
    .from("subscription_plans")
    .select("id, price")
    .eq("slug", planSlug)
    .single()
    
  if (planError) return { error: "Plan not found" }

  // 2. Update subscription
  const { error: subError } = await supabase
    .from("subscriptions")
    .update({ 
      plan_id: plan.id,
      updated_at: new Date().toISOString()
    })
    .eq("store_id", storeId)

  if (subError) return { error: subError.message }

  // 3. Log history
  await supabase
    .from("subscription_history")
    .insert([{
      store_id: storeId,
      plan_id: plan.id,
      amount: plan.price,
      status: 'success',
      payload: { action: 'upgrade', plan_slug: planSlug }
    }])

  return { success: true }
}

export async function toggleSubscriptionGating(value: 'true' | 'false') {
  const supabase = await createClient()
  const { error } = await supabase
    .from("app_configs")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", "subscription_gating_enabled")

  if (error) return { error: error.message }
  return { success: true }
}
