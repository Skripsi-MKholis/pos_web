"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconTrendingUp, IconShoppingCart, IconCash, IconPackage, IconArrowUpRight } from "@tabler/icons-react"

export function SectionCards({ metrics }: { metrics: any }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 pt-4">
      <Card className="@container/card bg-gradient-to-br from-primary/10 to-background border-primary/20 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium">Total Pendapatan Hari Ini</CardDescription>
            <IconCash className="h-5 w-5 text-primary opacity-60" />
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-primary">
            Rp {metrics.todayRevenue.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs text-muted-foreground pt-0">
          <div className="flex items-center gap-1.5">
            <IconTrendingUp className="h-3 w-3 text-emerald-500" />
            <span className="text-emerald-500 font-bold">100%</span>
            <span>Real-time data</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card shadow-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium">Transaksi Selesai</CardDescription>
            <IconShoppingCart className="h-5 w-5 text-muted-foreground opacity-60" />
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
            {metrics.todaySalesCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs text-muted-foreground pt-0">
          <p>Total transaksi yang berhasil diproses hari ini</p>
        </CardFooter>
      </Card>

      <Card className="@container/card shadow-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium">Stok Rendah</CardDescription>
            <IconPackage className="h-5 w-5 text-orange-500 opacity-60" />
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-orange-600">
            0
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs text-muted-foreground pt-0">
          <p>Produk yang mendekati batas stok minimum</p>
        </CardFooter>
      </Card>

      <Card className="@container/card shadow-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="font-medium">Metode Favorit</CardDescription>
            <IconArrowUpRight className="h-5 w-5 text-muted-foreground opacity-60" />
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
            Tunai
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-xs text-muted-foreground pt-0">
          <p>Metode pembayaran paling sering digunakan</p>
        </CardFooter>
      </Card>
    </div>
  )
}
