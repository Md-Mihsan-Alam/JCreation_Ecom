import { Skeleton } from "../ui/skeleton";

function LuxuryLoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-card/50 backdrop-blur-lg">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Skeleton className="h-8 w-32 bg-white/5" />
          <div className="hidden md:flex gap-8">
            <Skeleton className="h-4 w-20 bg-white/5" />
            <Skeleton className="h-4 w-20 bg-white/5" />
            <Skeleton className="h-4 w-20 bg-white/5" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full bg-white/5" />
            <Skeleton className="h-8 w-8 rounded-full bg-white/5" />
          </div>
        </div>
      </header>

      {/* Hero Skeleton */}
      <div className="relative w-full h-[400px] md:h-[600px]">
        <Skeleton className="w-full h-full bg-white/5 rounded-none" />
        <div className="absolute inset-x-0 bottom-12 flex flex-col items-center gap-4">
             <Skeleton className="h-12 w-64 bg-white/10" />
             <Skeleton className="h-4 w-48 bg-white/5" />
        </div>
      </div>

      {/* Product Section Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center mb-12">
          <Skeleton className="h-4 w-32 bg-white/5 mb-4" />
          <Skeleton className="h-10 w-64 bg-white/5 mb-6" />
          <Skeleton className="h-0.5 w-20 bg-primary/20" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="aspect-[3/4] w-full bg-white/5 rounded-none" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-white/5" />
                <Skeleton className="h-4 w-1/2 bg-white/5" />
                <Skeleton className="h-8 w-full bg-white/10 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LuxuryLoadingSkeleton;
