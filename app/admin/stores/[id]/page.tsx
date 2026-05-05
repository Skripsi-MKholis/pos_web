import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ensureAdmin } from "@/lib/admin-actions"
import { StoreDetailClient } from "./store-detail-client"
import { IconChevronLeft } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AdminStoreDetailPage({ params }: PageProps) {
  // 1. Auth check
  await ensureAdmin()
  
  const { id } = await params
  const supabase = await createClient()

  // 2. Fetch Store Data
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select(`
      *,
      owner:users!stores_owner_id_public_users_fkey (
        id,
        full_name, 
        email
      ),
      subscriptions (
        plan:subscription_plans (*),
        status,
        end_date
      ),
      members:store_members (
        role,
        user:user_id (
          id,
          full_name,
          email
        )
      )
    `)
    .eq('id', id)
    .single()

  if (storeError || !store) {
    console.error("Error fetching store:", storeError)
    return notFound()
  }

  // 3. Fetch Products
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      category:categories (name)
    `)
    .eq('store_id', id)
    .order('created_at', { ascending: false })

  // 4. Fetch Transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select(`
      *,
      cashier:users (full_name),
      customers (name)
    `)
    .eq('store_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="flex flex-1 flex-col py-4 md:py-6 px-4 lg:px-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/stores">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
            <IconChevronLeft size={24} />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tight">{store.name}</h1>
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
            Detail & Monitoring Outlet
          </p>
        </div>
      </div>

      <StoreDetailClient 
        store={store} 
        products={products || []} 
        transactions={transactions || []} 
      />
    </div>
  )
}
