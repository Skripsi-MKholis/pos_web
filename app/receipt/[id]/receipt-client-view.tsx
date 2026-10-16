"use client"

import * as React from "react"
import Link from "next/link"
import { 
  IconCheck, 
  IconCopy, 
  IconPrinter, 
  IconShare, 
  IconReceipt, 
  IconClock, 
  IconBuildingStore, 
  IconUser, 
  IconArmchair,
  IconCircleCheck,
  IconSparkles,
  IconArrowLeft,
  IconAlertCircle
} from "@tabler/icons-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"
import QRCode from "qrcode"
import { formatCurrency } from "@/lib/utils"

export function ReceiptClientView({ 
  initialData, 
  receiptId 
}: { 
  initialData: any
  receiptId: string 
}) {
  const [copied, setCopied] = React.useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string>("")
  const [currentUrl, setCurrentUrl] = React.useState<string>("")

  React.useEffect(() => {
    const url = typeof window !== "undefined" ? window.location.href : `https://parzello-pos.vercel.app/receipt/${receiptId}`
    setCurrentUrl(url)

    QRCode.toDataURL(url, {
      width: 240,
      margin: 1,
      color: {
        dark: "#1e293b",
        light: "#ffffff"
      }
    }).then(setQrCodeDataUrl).catch(console.error)
  }, [receiptId])

  const tx = initialData
  const store = Array.isArray(tx?.stores) ? tx?.stores[0] : tx?.stores
  const settingsReceipt = store?.settings?.receipt || {}

  // Parse custom store settings or fallback to standard properties
  const storeName = settingsReceipt.store_name || store?.name || "Toko Parzello"
  const storeAddress = settingsReceipt.address || store?.address
  const storePhone = settingsReceipt.phone || store?.phone
  const headerText = settingsReceipt.header_message || store?.receipt_header
  const footerText = settingsReceipt.footer_message || store?.receipt_footer
  const showLogo = settingsReceipt.show_logo ?? true
  const showQr = settingsReceipt.show_qr_code ?? true

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(currentUrl || window.location.href)
      setCopied(true)
      toast.success("Link struk online berhasil disalin!")
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Struk Pembelian - ${storeName}`,
          text: `Struk transaksi #${tx?.id ? tx.id.slice(0, 8).toUpperCase() : receiptId.slice(0, 8).toUpperCase()} dari ${storeName}`,
          url: currentUrl,
        })
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (!tx) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 shadow-sm border border-amber-500/20">
          <IconAlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase mb-2">
          Struk Tidak Ditemukan
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mb-6 font-medium">
          Transaksi dengan ID <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">#{receiptId.slice(0, 8)}</span> tidak ditemukan atau telah dihapus.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-all"
        >
          <IconArrowLeft size={16} /> Ke Beranda
        </Link>
      </div>
    )
  }

  const formattedDate = tx.created_at ? format(new Date(tx.created_at), "dd MMMM yyyy, HH:mm", { locale: id }) : "-"
  const totalAmount = Number(tx.total_amount || 0)
  const discountTotal = Number(tx.discount_total || 0)
  const subtotal = totalAmount + discountTotal
  const cashPaid = Number(tx.cash_paid || totalAmount)
  const changeAmount = Number(tx.change_amount || 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-8 px-4 sm:px-6 selection:bg-emerald-500/20">
      {/* Top action bar - Hidden during print */}
      <div className="max-w-md mx-auto mb-6 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            <IconReceipt size={18} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block leading-tight">
              E-Receipt Online
            </span>
            <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white">
              Parzello POS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95 transition-all"
            title="Salin Link Struk"
          >
            {copied ? <IconCheck size={14} className="text-emerald-500" /> : <IconCopy size={14} />}
            <span>{copied ? "Tersalin" : "Salin Link"}</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95 transition-all"
            title="Bagikan Struk"
          >
            <IconShare size={14} />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm hover:opacity-90 active:scale-95 transition-all"
            title="Cetak Struk"
          >
            <IconPrinter size={14} />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* Main Thermal Receipt Container */}
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-white text-slate-950 rounded-3xl shadow-xl shadow-slate-300/40 dark:shadow-none border border-slate-200/80 overflow-hidden relative print:shadow-none print:border-none print:rounded-none">
          {/* Decorative colored top header indicator */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-primary print:hidden" />

          {/* Success Banner */}
          <div className="px-6 pt-6 pb-4 text-center border-b border-dashed border-slate-200 flex flex-col items-center">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-3">
              <IconCircleCheck size={12} strokeWidth={3} /> Pembayaran Sukses
            </div>

            {showLogo && store?.logo_url && (
              <img 
                src={store.logo_url} 
                alt={storeName} 
                className="w-16 h-16 object-contain mb-2 rounded-2xl" 
              />
            )}

            <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
              {storeName}
            </h1>

            {headerText && (
              <p className="text-[11px] text-slate-500 mt-1 italic whitespace-pre-line leading-relaxed max-w-xs">
                {headerText}
              </p>
            )}

            {(storeAddress || storePhone) && (
              <div className="text-[11px] text-slate-500 space-y-0.5 mt-2">
                {storeAddress && <p>{storeAddress}</p>}
                {storePhone && <p className="font-semibold">Telp: {storePhone}</p>}
              </div>
            )}
          </div>

          {/* Receipt Info (Time, No, Cashier) */}
          <div className="px-6 py-4 bg-slate-50/70 border-b border-dashed border-slate-200 text-[11px] font-mono space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Tanggal:</span>
              <span className="font-bold">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">No. Struk:</span>
              <span className="font-black text-slate-900">#{tx.id.slice(-8).toUpperCase()}</span>
            </div>
            {tx.tables?.name && (
              <div className="flex justify-between items-center bg-white px-2 py-1 rounded-lg border border-slate-200 font-sans font-black text-xs text-slate-900">
                <span className="flex items-center gap-1 uppercase tracking-wider text-[10px] text-slate-500">
                  <IconArmchair size={13} /> Meja
                </span>
                <span>{tx.tables.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Kasir:</span>
              <span className="font-bold">{tx.cashier?.full_name || "Kasir"}</span>
            </div>
            {tx.customers?.name && (
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-bold text-slate-900">{tx.customers.name}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="px-6 py-4 space-y-3 font-mono">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-200 font-sans">
              <span>Item Menu</span>
              <span>Subtotal</span>
            </div>

            <div className="space-y-3">
              {tx.transaction_items?.map((item: any, idx: number) => (
                <div key={item.id || idx} className="text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-black uppercase tracking-tight text-slate-900 flex-1 leading-snug">
                      {item.product_name}
                    </span>
                    <span className="font-black text-slate-900 tracking-tight whitespace-nowrap">
                      Rp {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
                    <span>
                      {item.quantity} x {formatCurrency(item.unit_price)}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded mt-1 font-sans italic">
                      * {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="px-6 py-4 bg-slate-50/70 border-t border-dashed border-slate-200 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>Rp {formatCurrency(subtotal)}</span>
            </div>

            {discountTotal > 0 && (
              <div className="flex justify-between text-rose-600 font-bold">
                <span>Diskon {tx.voucher_info?.code ? `(${tx.voucher_info.code})` : ""}</span>
                <span>- Rp {formatCurrency(discountTotal)}</span>
              </div>
            )}

            <div className="border-t border-slate-300 pt-2 flex justify-between items-baseline font-sans">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Total Tagihan
              </span>
              <span className="text-xl font-black tracking-tight text-slate-950 font-mono">
                Rp {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="border-t border-slate-200/80 pt-2 space-y-1 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>Metode Bayar</span>
                <span className="font-bold uppercase text-slate-900">{tx.payment_method || "Tunai"}</span>
              </div>
              <div className="flex justify-between">
                <span>Uang Diterima</span>
                <span>Rp {formatCurrency(cashPaid)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900">
                <span>Kembalian</span>
                <span>Rp {formatCurrency(changeAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer & QR Code Section */}
          <div className="px-6 pt-5 pb-8 text-center space-y-4 border-t border-dashed border-slate-200 flex flex-col items-center">
            {showQr && qrCodeDataUrl && (
              <div className="flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Verifikasi Struk" 
                  className="w-28 h-28 object-contain" 
                />
                <span className="text-[9px] font-mono uppercase text-slate-400 mt-1 tracking-wider">
                  Scan untuk verifikasi online
                </span>
              </div>
            )}

            <div className="space-y-1">
              <p className="font-black uppercase tracking-[0.2em] text-xs text-slate-800">
                Terima Kasih
              </p>
              {footerText ? (
                <p className="text-[11px] text-slate-500 italic whitespace-pre-line leading-relaxed max-w-xs">
                  {footerText}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  Silakan datang kembali!
                </p>
              )}
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 font-sans">
                <IconSparkles size={11} className="text-emerald-500" /> Powered by Parzello POS
              </div>
            </div>
          </div>

          {/* Receipt bottom zigzag tooth decoration effect (CSS/SVG) */}
          <div className="h-2 w-full bg-[radial-gradient(circle,_transparent_4px,_#ffffff_4px)] [background-size:12px_12px] [background-position:-6px_-6px] print:hidden" />
        </div>

        {/* Bottom copyright / quick link */}
        <div className="text-center mt-6 text-xs text-slate-400 dark:text-zinc-600 print:hidden flex items-center justify-center gap-3">
          <Link href="/" className="hover:text-primary transition-colors font-medium">
            Parzello POS System
          </Link>
          <span>•</span>
          <button onClick={handlePrint} className="hover:text-primary transition-colors font-medium">
            Cetak Ulang
          </button>
        </div>
      </div>
    </div>
  )
}
