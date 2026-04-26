"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Line, ComposedChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function ProfitChartClient({ data }: { data: any[] }) {
  // Format dates for display
  const chartData = data.map(d => ({
    ...d,
    formattedDate: format(new Date(d.date), "dd MMM", { locale: id })
  }))

  return (
    <Card className="col-span-4 shadow-xl border-none bg-gradient-to-br from-background to-muted/20">
      <CardHeader>
        <CardTitle>Analisis Pendapatan vs Laba</CardTitle>
        <CardDescription>
          Perbandingan pendapatan kotor dan laba kotor selama 30 hari terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] pl-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              minTickGap={30}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `Rp ${value / 1000}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-muted-foreground">Pendapatan</span>
                          <span className="font-bold text-primary">Rp {payload[0].value?.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-muted-foreground">Laba Kotor</span>
                          <span className="font-bold text-emerald-600">Rp {payload[1].value?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Bar 
              dataKey="revenue" 
              name="Pendapatan" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
              opacity={0.3}
            />
            <Bar 
              dataKey="profit" 
              name="Laba Kotor" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
