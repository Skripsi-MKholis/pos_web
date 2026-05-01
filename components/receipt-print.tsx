"use client"

import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { formatCurrency } from "@/lib/utils"

type ReceiptPrintProps = {
  storeName: string
  address?: string
  phone?: string
  logoUrl?: string | null
  header?: string | null
  footer?: string | null
  showLogo?: boolean
  paperSize?: string
  transactionId: string
  cashierName: string
  items: any[]
  total: number
  paymentMethod: string
  cashPaid?: number
  changeAmount?: number
  tableName?: string
  mode?: "invoice" | "kitchen"
}

export function ReceiptPrint({
  storeName,
  address,
  phone,
  logoUrl,
  header,
  footer,
  showLogo,
  paperSize = "58mm",
  transactionId,
  cashierName,
  items,
  total,
  paymentMethod,
  cashPaid,
  changeAmount,
  tableName,
  mode = "invoice"
}: ReceiptPrintProps) {
  const isKitchen = mode === "kitchen"
  const widthClass = paperSize === "80mm" ? "w-[80mm]" : paperSize === "a4" ? "w-full max-w-[210mm]" : "w-[58mm]"

  return (
    <div id="receipt-content" className={`hidden print:block font-mono text-[10px] ${widthClass} bg-white text-black p-4 mx-auto leading-tight transition-all duration-300`}>
      <div className="text-center space-y-1 mb-4 flex flex-col items-center">
        {isKitchen ? (
          <div className="border-2 border-black p-2 mb-2 w-full">
            <h1 className="text-lg font-black uppercase">TIKET DAPUR</h1>
            <p className="text-xs font-bold font-sans">KITCHEN ORDER TICKET (KOT)</p>
          </div>
        ) : (
          <>
            {showLogo && logoUrl && (
              <img src={logoUrl} alt="Store Logo" className="w-16 h-16 object-contain mb-2 grayscale" />
            )}
            <h1 className="text-sm font-black uppercase text-center">{storeName}</h1>
            {header && <p className="text-[9px] italic whitespace-pre-line">{header}</p>}
          </>
        )}
        
        <div className="border-b border-black w-full my-1 opacity-20"></div>
        {!isKitchen && (
          <>
            {address && <p>{address}</p>}
            {phone && <p>Telp: {phone}</p>}
          </>
        )}
      </div>

      <div className="border-b border-dashed border-black my-3"></div>

      <div className="space-y-0.5 mb-2">
        <div className="flex justify-between">
          <span>Tgl:</span>
          <span>{format(new Date(), "dd/MM/yy HH:mm", { locale: id })}</span>
        </div>
        {tableName && (
          <div className="flex justify-between text-base font-black border-y border-black py-1 my-1">
            <span>MEJA:</span>
            <span>{tableName}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>No:</span>
          <span>#{transactionId.slice(-6).toUpperCase()}</span>
        </div>
        <div className="flex justify-between border-t border-black/5 pt-1 mt-1">
          <span>Kasir:</span>
          <span className="font-bold">{cashierName}</span>
        </div>
      </div>

      <div className="border-b border-dashed border-black my-3"></div>

      <div className="space-y-3 mb-6">
        {items.map((item, i) => (
          <div key={i} className="group">
            <div className="flex justify-between mb-0.5">
              <span className={`font-black uppercase tracking-tight ${isKitchen ? 'text-sm' : ''}`}>
                {isKitchen && <span className="mr-2 inline-block border-[1.5px] border-black px-1 font-bold">{item.quantity}</span>}
                {item.name}
              </span>
              {!isKitchen && <span className="font-bold">{item.quantity}</span>}
            </div>
            {!isKitchen && (
              <div className="flex justify-between text-[9px] opacity-80">
                <span className="italic">{item.quantity} x {formatCurrency(item.price)}</span>
                <span className="font-bold">{formatCurrency(item.quantity * item.price)}</span>
              </div>
            )}
            {item.notes && (
              <p className="text-[9px] italic bg-black/5 p-1 mt-1 font-sans">** {item.notes}</p>
            )}
          </div>
        ))}
      </div>

      {!isKitchen && (
        <>
          <div className="border-b border-dashed border-black my-3"></div>
          <div className="space-y-1.5 py-1">
            <div className="flex justify-between font-black text-xs border-b border-black pb-1 mb-1">
              <span>TOTAL TAGIHAN</span>
              <span>Rp {formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between opacity-80">
              <span>Bayar ({paymentMethod})</span>
              <span>{cashPaid ? formatCurrency(cashPaid) : "-"}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Kembalian</span>
              <span>{changeAmount ? formatCurrency(changeAmount) : "0"}</span>
            </div>
          </div>
        </>
      )}

      <div className="border-b border-dashed border-black my-5"></div>

      <div className="text-center mt-6 space-y-2">
        <p className="font-black uppercase tracking-[0.2em] text-[11px]">
          {isKitchen ? "--- PESANAN SIAP ---" : "Terima Kasih"}
        </p>
        {!isKitchen && (
          footer ? (
             <p className="text-[9px] whitespace-pre-line leading-normal italic opacity-80">
               {footer}
             </p>
          ) : (
             <p className="text-[9px] italic opacity-80">Silakan Datang Kembali</p>
          )
        )}
      </div>

      <div className="h-10"></div>
      <div className="text-center text-[7px] opacity-30 mt-4 font-sans uppercase tracking-widest">
        Powered by Parzello POS System
      </div>
    </div>
  )
}
