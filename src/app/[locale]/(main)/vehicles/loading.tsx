import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/common/skeletons";

export default function VehiclesLoading() {
  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-8">
      <Container>
        <div className="py-8 md:py-12">
          {/* Search bar skeleton */}
          <div className="mb-6 h-11 w-full animate-pulse rounded-xl bg-secondary/60" />

          <div className="flex gap-8">
            {/* Sidebar skeleton - desktop */}
            <div className="hidden w-72 shrink-0 space-y-3 lg:block">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/60" />
              ))}
            </div>

            <div className="flex-1 min-w-0">
              {/* Grid skeleton */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="aspect-[16/10] animate-pulse bg-secondary/60" />
                    <div className="space-y-3 p-4">
                      <div className="h-5 w-3/4 animate-pulse rounded-md bg-secondary/60" />
                      <div className="h-4 w-1/3 animate-pulse rounded-md bg-secondary/60" />
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="h-10 animate-pulse rounded-lg bg-secondary/60" />
                        ))}
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="h-6 w-1/3 animate-pulse rounded-md bg-secondary/60" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
