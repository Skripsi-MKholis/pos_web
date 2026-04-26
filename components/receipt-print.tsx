"use client"

import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

type ReceiptPrintProps = {
  storeName: string
  address?: string
  phone?: string
  transactionId: string
  cashierName: string
  items: any[]
  total: number
  paymentMethod: string
  cashPaid?: number
  changeAmount?: number
}

export function ReceiptPrint({
  storeName,
  address,
  phone,
  transactionId,
  cashierName,
  items,
  total,
  paymentMethod,
  cashPaid,
  changeAmount
}: ReceiptPrintProps) {
  return (
    <div id="receipt-content" className="hidden print:block font-mono text-[10px] w-[58mm] bg-white text-black p-2 mx-auto leading-tight">
      <div className="text-center space-y-1 mb-4">
        <h1 className="text-sm font-bold uppercase">{storeName}</h1>
        {address && <p>{address}</p>}
        {phone && <p>Telp: {phone}</p>}
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      <div className="space-y-0.5 mb-4">
        <div className="flex justify-between">
          <span>Tgl:</span>
          <span>{format(new Date(), "dd/MM/yy HH:mm", { locale: id })}</span>
        </div>
        <div className="flex justify-between">
          <span>Struk:</span>
          <span>#{transactionId.slice(-6).toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span>Kasir:</span>
          <span>{cashierName}</span>
        </div>
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      <div className="space-y-2 mb-4">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between">
              <span className="font-bold">{item.name}</span>
            </div>
            <div className="flex justify-between">
              <span>{item.quantity} x {item.price.toLocaleString()}</span>
              <span>{(item.quantity * item.price).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      <div className="space-y-1">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Bayar ({paymentMethod})</span>
          <span>{cashPaid ? cashPaid.toLocaleString() : "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Kembalian</span>
          <span>{changeAmount ? changeAmount.toLocaleString() : "0"}</span>
        </div>
      </div>

      <div className="border-b border-dashed border-black my-2"></div>

      <div className="text-center mt-6">
        <p className="font-bold uppercase">Terima Kasih</p>
        <p>Silakan Datang Kembali</p>
      </div>

      <div className="h-8"></div> {/* Padding for tear off */}
    </div>
  )
}
