import { Skeleton } from "@/components/ui/skeleton";

export function LandingHeroSkeleton() {
    return (
        <section className="flex items-center justify-center h-[calc(100vh-100px)]">
            <div className="flex flex-col items-center justify-center space-y-6 w-full">
                {/* Lottie Animation Placeholder */}
                <Skeleton className="h-60 w-60 rounded-full" />

                {/* Title Placeholder */}
                <div className="space-y-2 flex flex-col items-center">
                    <Skeleton className="h-12 w-[300px] md:w-[600px] rounded-md" />
                </div>

                {/* Subtitle Placeholder */}
                <div className="space-y-2 flex flex-col items-center">
                    <Skeleton className="h-8 w-[250px] md:w-[500px] rounded-md" />
                    <Skeleton className="h-8 w-[200px] md:w-[400px] rounded-md" />
                </div>

                {/* Button Placeholder */}
                <div className="pt-6">
                    <Skeleton className="h-12 w-48 rounded-md" />
                </div>
            </div>
        </section>
    );
}
