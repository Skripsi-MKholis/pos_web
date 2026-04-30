"use client"

import * as React from "react"
import { 
  IconCreditCard, 
  IconEdit, 
  IconCheck, 
  IconX,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditPlanDialog } from "./edit-plan-dialog"

export function PlansListClient({ plans }: { plans: any[] }) {
  const [editingPlan, setEditingPlan] = React.useState<any>(null)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className="rounded-[2.5rem] border-none shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <IconCreditCard size={24} />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold uppercase text-[10px] tracking-widest">AKTIF</Badge>
              </div>
              <CardTitle className="text-2xl font-black">{plan.name}</CardTitle>
              <CardDescription className="text-xs line-clamp-2 mt-1">{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 pt-4 space-y-8 flex-1">
              <div className="space-y-1">
                <div className="text-3xl font-black">
                  {plan.price === 0 ? "Gratis" : `Rp ${(plan.price / 1000).toLocaleString()}rb`}
                  <span className="text-sm font-normal text-muted-foreground"> /bulan</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Limitasi & Fitur</h4>
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Max Outlets</span>
                      <span className="font-bold">{plan.max_outlets}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Max Transaksi</span>
                      <span className="font-bold">{plan.max_transactions === 0 ? "Unlimited" : plan.max_transactions}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Manajemen Meja</span>
                      {plan.features.tables ? <IconCheck size={18} className="text-emerald-500" /> : <IconX size={18} className="text-destructive/30" />}
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">KDS System</span>
                      {plan.features.kds ? <IconCheck size={18} className="text-emerald-500" /> : <IconX size={18} className="text-destructive/30" />}
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Multi-Store Staff</span>
                      {plan.features.multi_store_staff ? <IconCheck size={18} className="text-emerald-500" /> : <IconX size={18} className="text-destructive/30" />}
                   </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-8 pt-0">
               <Button 
                variant="outline" 
                onClick={() => setEditingPlan(plan)}
                className="w-full rounded-2xl h-12 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all"
              >
                  <IconEdit size={18} className="mr-2" />
                  Edit Konfigurasi
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {editingPlan && (
        <EditPlanDialog 
          plan={editingPlan} 
          open={!!editingPlan} 
          onOpenChange={(open) => !open && setEditingPlan(null)} 
        />
      )}
    </>
  )
}
