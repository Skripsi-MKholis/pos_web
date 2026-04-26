import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[250px] rounded-2xl" />
          <Skeleton className="h-4 w-[150px] rounded-lg" />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-[2rem]" />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px] rounded-[3rem]" />
        <Skeleton className="col-span-3 h-[400px] rounded-[3rem]" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px] rounded-xl" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
