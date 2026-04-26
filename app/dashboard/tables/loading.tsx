import { Skeleton } from "@/components/ui/skeleton"

export default function TablesLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[200px] rounded-2xl" />
          <Skeleton className="h-4 w-[150px] rounded-lg" />
        </div>
        <Skeleton className="h-12 w-[180px] rounded-xl" />
      </div>

      <div className="flex gap-6 p-4 bg-muted/20 rounded-2xl border border-dashed">
         {[...Array(2)].map((_, i) => (
           <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-lg" />
           </div>
         ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-[2rem]" />
        ))}
      </div>
    </div>
  )
}
