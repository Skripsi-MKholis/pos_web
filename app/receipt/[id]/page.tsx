import type { Metadata } from "next"
import { getPublicReceipt } from "@/lib/transaction-actions"
import { ReceiptClientView } from "./receipt-client-view"

type ReceiptPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ReceiptPageProps): Promise<Metadata> {
  const { id } = await params
  const { data: tx } = await getPublicReceipt(id)

  const storeData: any = Array.isArray(tx?.stores) ? tx?.stores[0] : tx?.stores
  const storeName = storeData?.name || "Parzello POS"
  const shortId = id.slice(0, 8).toUpperCase()

  return {
    title: `Struk Transaksi #${shortId} - ${storeName}`,
    description: `Lihat dan simpan e-receipt resmi pembelian dari ${storeName}. Transaksi #${shortId}.`,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function PublicReceiptPage({ params }: ReceiptPageProps) {
  const { id } = await params
  const { data: tx } = await getPublicReceipt(id)

  return <ReceiptClientView initialData={tx} receiptId={id} />
}
