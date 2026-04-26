"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// --- DISCOUNTS ---

export async function getDiscounts(storeId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("discounts")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })

  if (error) return []
  return data
}

export async function createDiscount(data: {
  store_id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  start_date?: string;
  end_date?: string;
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("discounts")
    .insert([data])

  if (error) return { error: error.message }
  revalidatePath("/dashboard/promotions")
  return { success: true }
}

// --- VOUCHERS ---

export async function getVouchers(storeId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })

  if (error) return []
  return data
}

export async function validateVoucher(storeId: string, code: string, currentTotal: number) {
  const supabase = await createClient()
  const now = new Date().toISOString()
  
  const { data: voucher, error } = await supabase
    .from("vouchers")
    .select("*")
    .eq("store_id", storeId)
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .lte("starts_at", now)
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .single()

  if (error || !voucher) {
    return { error: "Voucher tidak valid atau sudah kadaluarsa" }
  }

  if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
    return { error: "Voucher sudah mencapai batas penggunaan" }
  }

  if (currentTotal < voucher.min_purchase) {
    return { error: `Minimal pembelian untuk voucher ini adalah Rp ${voucher.min_purchase.toLocaleString()}` }
  }

  return { success: true, voucher }
}

export async function createVoucher(data: {
  store_id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_purchase?: number;
  max_discount?: number;
  usage_limit?: number;
  expires_at?: string;
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("vouchers")
    .insert([{ ...data, code: data.code.toUpperCase() }])

  if (error) return { error: error.message }
  revalidatePath("/dashboard/promotions")
  return { success: true }
}
