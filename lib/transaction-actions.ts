"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type TransactionItem = {
  product_id: string
  product_name: string
  unit_price: number
  quantity: number
  subtotal: number
}

export type TransactionPayload = {
  storeId: string
  totalAmount: number
  paymentMethod: string
  items: TransactionItem[]
  discountTotal?: number
  voucherInfo?: any
  tableId?: string
  status?: "Berhasil" | "Pending" | "Dibatalkan"
  cashPaid?: number
  changeAmount?: number
}

import { getStoreSubscription, isSubscriptionGatingEnabled, getMonthlyTransactionCount } from "./subscription-actions"

export async function createTransaction(payload: TransactionPayload) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "Unauthorized" }

  // 1. Check subscription limits
  const gatingEnabled = await isSubscriptionGatingEnabled()
  if (gatingEnabled) {
    const sub = await getStoreSubscription(payload.storeId)
    const limit = sub?.plan?.max_transactions || 500
    
    if (limit > 0) {
      const count = await getMonthlyTransactionCount(payload.storeId)
      if (count >= limit) {
        return { 
          error: `Batas transaksi bulanan tercapai (${limit}). Silahkan upgrade paket anda untuk melanjutkan.` 
        }
      }
    }
  }

  const { data, error } = await supabase.rpc("create_transaction_v3", {
    p_store_id: payload.storeId,
    p_cashier_id: user.id,
    p_total_amount: payload.totalAmount,
    p_payment_method: payload.paymentMethod,
    p_items: payload.items,
    p_discount_total: payload.discountTotal || 0,
    p_voucher_info: payload.voucherInfo || {},
    p_table_id: payload.tableId || null,
    p_status: payload.status || "Berhasil",
    p_cash_paid: payload.cashPaid || 0,
    p_change_amount: payload.changeAmount || 0
  })

  if (error) {
    console.error("RPC Error:", error)
    return { error: error.message }
  }

  if (data?.success === false) {
    return { error: data.error || "Gagal membuat transaksi" }
  }

  revalidatePath("/dashboard/products")
  revalidatePath("/dashboard/cashier")
  revalidatePath("/dashboard/transactions")
  revalidatePath("/dashboard")
  
  return { success: true, transactionId: data?.transaction_id }
}

export async function splitTransaction(payload: {
  originalTransactionId: string
  paidItems: any[]
  paymentMethod: string
  storeId: string
  cashPaid?: number
  changeAmount?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }
  
  // 1. Create a new PAID transaction for the selected items
  const { data, error } = await supabase.rpc("split_transaction_v1", {
    p_original_tx_id: payload.originalTransactionId,
    p_paid_items: payload.paidItems,
    p_payment_method: payload.paymentMethod,
    p_store_id: payload.storeId,
    p_cashier_id: user.id,
    p_cash_paid: payload.cashPaid || 0,
    p_change_amount: payload.changeAmount || 0
  })

  if (error) {
    console.error("Split Error:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard/tables")
  revalidatePath("/dashboard/transactions")
  
  return { success: true, transactionId: data?.new_transaction_id }
}

export async function getTransactions(storeId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      cashier:users (full_name),
      customers (name),
      tables (*),
      transaction_items (
        *,
        products (image_url)
      )
    `)
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    return []
  }

  return data
}

export async function getDashboardMetrics(storeId: string) {
  const supabase = await createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayItems, error: itemsError } = await supabase
    .from("transaction_items")
    .select("subtotal, cost_price, quantity, transactions!inner(created_at, store_id, status)")
    .eq("transactions.store_id", storeId)
    .gte("transactions.created_at", today.toISOString())
    .eq("transactions.status", "Berhasil")

  if (itemsError) console.error("Metrics Items Error:", itemsError)

  const revenue = todayItems?.reduce((sum, item) => sum + Number(item.subtotal), 0) || 0
  const totalCost = todayItems?.reduce((sum, item) => sum + (Number(item.cost_price || 0) * item.quantity), 0) || 0
  const profit = revenue - totalCost

  // Unique transactions count
  const distinctTransactions = new Set(todayItems?.map(i => (i as any).transactions.id))
  const count = distinctTransactions.size

  return {
    todayRevenue: revenue,
    todaySalesCount: count,
    todayProfit: profit
  }
}

export async function getSalesChartData(storeId: string, days: number = 30) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from("transactions")
    .select("created_at, total_amount")
    .eq("store_id", storeId)
    .eq("status", "Berhasil")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Chart Data Error:", error)
    return []
  }

  // Group by date
  const groupedData: Record<string, { revenue: number; orders: number }> = {}
  
  // Initialize with all dates in range
  for (let i = 0; i <= days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    groupedData[d.toISOString().split("T")[0]] = { revenue: 0, orders: 0 }
  }

  data.forEach((t) => {
    const date = t.created_at.split("T")[0]
    if (groupedData[date]) {
      groupedData[date].revenue += Number(t.total_amount)
      groupedData[date].orders += 1
    }
  })

  return Object.entries(groupedData).map(([date, stats]) => ({
    date,
    revenue: stats.revenue,
    orders: stats.orders,
  }))
}

export async function getSalesAndProfitData(storeId: string, days: number = 30) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from("transaction_items")
    .select(`
      subtotal, 
      cost_price, 
      quantity, 
      transactions!inner(created_at, store_id, status)
    `)
    .eq("transactions.store_id", storeId)
    .eq("transactions.status", "Berhasil")
    .gte("transactions.created_at", startDate.toISOString())

  if (error) {
    console.error("Profit Data Error:", error)
    return []
  }

  const groupedData: Record<string, { revenue: number; cost: number; profit: number }> = {}
  
  // Initialize range
  for (let i = 0; i <= days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    groupedData[d.toISOString().split("T")[0]] = { revenue: 0, cost: 0, profit: 0 }
  }

  data.forEach((item) => {
    const date = (item as any).transactions.created_at.split("T")[0]
    if (groupedData[date]) {
      const rev = Number(item.subtotal)
      const cost = Number(item.cost_price || 0) * item.quantity
      groupedData[date].revenue += rev
      groupedData[date].cost += cost
      groupedData[date].profit += (rev - cost)
    }
  })

  return Object.entries(groupedData).map(([date, stats]) => ({
    date,
    revenue: stats.revenue,
    profit: stats.profit,
    margin: stats.revenue > 0 ? (stats.profit / stats.revenue) * 100 : 0
  }))
}

export async function moveTransactionTable(transactionId: string, fromTableId: string, toTableId: string) {
  const supabase = await createClient()

  // 1. Update the transaction to point to the new table
  const { error: txError } = await supabase
    .from("transactions")
    .update({ table_id: toTableId })
    .eq("id", transactionId)

  if (txError) return { error: txError.message }

  // 2. Update table statuses
  // Set old table to available ONLY IF NO OTHER PENDING TRANSACTIONS REMAIN
  const { data: remainingPending } = await supabase
    .from("transactions")
    .select("id")
    .eq("table_id", fromTableId)
    .eq("status", "Pending")
    .limit(1)

  if (!remainingPending || remainingPending.length === 0) {
    await supabase
      .from("tables")
      .update({ status: 'available' })
      .eq("id", fromTableId)
  }

  // Set new table to occupied
  await supabase
    .from("tables")
    .update({ status: 'occupied' })
    .eq("id", toTableId)

  revalidatePath("/dashboard/tables")
  return { success: true }
}

export async function completeFullTransaction(
  transactionId: string, 
  paymentMethod: string,
  cashPaid?: number,
  changeAmount?: number
) {
  const supabase = await createClient()

  // 1. Update transaction status
  const { data: tx, error: txError } = await supabase
    .from("transactions")
    .update({ 
      status: 'Berhasil',
      payment_method: paymentMethod,
      cash_paid: cashPaid,
      change_amount: changeAmount
    })
    .eq("id", transactionId)
    .select()
    .single()

  if (txError) return { error: txError.message }

  // 2. Clear table if exists, ONLY IF NO OTHER PENDING TRANSACTIONS
  if (tx.table_id) {
    const { data: otherPending } = await supabase
      .from("transactions")
      .select("id")
      .eq("table_id", tx.table_id)
      .eq("status", "Pending")
      .limit(1)

    if (!otherPending || otherPending.length === 0) {
      await supabase
        .from("tables")
        .update({ status: 'available' })
        .eq("id", tx.table_id)
    }
  }

  revalidatePath("/dashboard/tables")
  revalidatePath("/dashboard/transactions")
  return { success: true, transactionId }
}

export async function clearTableOrders(tableId: string) {
  const supabase = await createClient()

  // 1. Delete all pending transactions for this table
  const { error: txError } = await supabase
    .from("transactions")
    .delete()
    .eq("table_id", tableId)
    .eq("status", "Pending")

  if (txError) return { error: txError.message }

  // 2. Set table status to available
  await supabase
    .from("tables")
    .update({ status: 'available' })
    .eq("id", tableId)

  revalidatePath("/dashboard/tables")
  return { success: true }
}
