"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function getCategories(storeId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createCategory(name: string, storeId: string) {
  const supabase = await createClient()
  console.log("Creating category:", { name, storeId })
  
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name, store_id: storeId }])
    .select()

  if (error) {
    console.error("Error creating category:", error)
    return { error: error.message }
  }
  
  console.log("Category created successfully:", data)
  revalidatePath("/dashboard/categories")
  return { success: true, data }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }
  
  revalidatePath("/dashboard/categories")
  return { success: true }
}

export async function getProducts(storeId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, categories:category_id(name)")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createProduct(payload: any) {
  const supabase = await createClient()
  console.log("Creating product with payload:", payload)
  
  const { data, error } = await supabase
    .from("products")
    .insert([payload])
    .select()

  if (error) {
    console.error("Error creating product:", error)
    return { error: error.message }
  }
  
  console.log("Product created successfully:", data)
  revalidatePath("/dashboard/products")
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }
  
  revalidatePath("/dashboard/products")
  return { success: true }
}

export async function updateStock(id: string, quantity: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("products")
    .update({ stock_quantity: quantity })
    .eq("id", id)

  if (error) return { error: error.message }
  
  revalidatePath("/dashboard/products")
  return { success: true }
}

export async function updateProduct(id: string, payload: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()

  if (error) return { error: error.message }
  
  revalidatePath("/dashboard/products")
  return { success: true, data }
}
