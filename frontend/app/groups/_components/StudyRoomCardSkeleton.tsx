import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StudyRoomCardSkeleton() {
    return (
        <Card className="w-full max-w-md p-6 flex flex-col justify-between m-2 h-full">
            <div className="space-y-4">
                {/* Top Section: Title and Live Badge */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        {/* Title Skeleton */}
                        <Skeleton className="h-8 w-40" />
                        {/* Subject Badge Skeleton */}
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>

                    {/* Status Badge Skeleton */}
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Avatars Skeleton */}
                <div className="flex -space-x-3 items-center pl-1 h-8">
                    <Skeleton className="h-8 w-8 rounded-full border-2 border-white" />
                    <Skeleton className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                    <Skeleton className="h-8 w-8 rounded-full border-2 border-white bg-slate-100" />
                </div>
            </div>

            {/* Bottom Section: Study Count and Join Button */}
            <div className="flex items-center justify-between mt-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        {/* Dot Skeleton */}
                        <Skeleton className="h-3 w-3 rounded-full" />
                        {/* Text Skeleton */}
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>

                {/* Join Button Skeleton */}
                <Skeleton className="h-12 w-24 rounded-b-sm" />
            </div>
        </Card>
    );
}
