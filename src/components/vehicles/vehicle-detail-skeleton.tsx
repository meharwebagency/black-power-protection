import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/common/skeletons";

export function VehicleDetailSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        {/* Breadcrumbs skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Gallery skeleton */}
          <div className="lg:col-span-3 space-y-3">
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-24 shrink-0 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Info + Contact skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            {/* Title */}
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            {/* Location */}
            <Skeleton className="h-4 w-24 rounded-md" />
            {/* Price */}
            <Skeleton className="h-10 w-1/2 rounded-lg" />
            {/* Actions */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-px w-full" />
            {/* Contact card */}
            <div className="space-y-3 rounded-2xl border border-border p-5">
              <Skeleton className="text-center h-4 w-16 mx-auto rounded-md" />
              <Skeleton className="text-center h-8 w-32 mx-auto rounded-lg" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Specs skeleton */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </Container>
    </div>
  );
}
