"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'

export type ReservationPayload = {
  storeId: string
  tableId?: string | null
  customerName: string
  customerPhone?: string
  reservationDate: string
  reservationTime: string
  numberOfGuests: number
  notes?: string
  status?: ReservationStatus
}

export async function getReservations(storeId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("reservations")
    .select(`
      *,
      tables (name)
    `)
    .eq("store_id", storeId)
    .order("reservation_date", { ascending: true })
    .order("reservation_time", { ascending: true })

  if (error) {
    console.error("Error fetching reservations:", error)
    return []
  }

  return data
}

export async function createReservation(payload: ReservationPayload) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("reservations")
    .insert([{
      store_id: payload.storeId,
      table_id: payload.tableId || null,
      customer_name: payload.customerName,
      customer_phone: payload.customerPhone,
      reservation_date: payload.reservationDate,
      reservation_time: payload.reservationTime,
      number_of_guests: payload.numberOfGuests,
      notes: payload.notes,
      status: payload.status || 'Pending'
    }])
    .select()

  if (error) {
    console.error("Error creating reservation:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard/reservations")
  return { success: true, data }
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id)

  if (error) {
    console.error("Error updating reservation status:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard/reservations")
  return { success: true }
}

export async function deleteReservation(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting reservation:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard/reservations")
  return { success: true }
}
