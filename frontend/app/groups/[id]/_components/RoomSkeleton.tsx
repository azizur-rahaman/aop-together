import { Skeleton } from "@/components/ui/skeleton"

export function RoomSkeleton() {
    return (
        <main className="w-full h-dvh grid grid-cols-3 grid-rows-1 overflow-hidden">
            {/* LEFT SIDE - VIDEO AREA (Col Span 2) */}
            <div className="bg-slate-900 col-span-2 flex flex-col relative overflow-hidden p-4">
                {/* Main Video Placeholder */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 relative bg-slate-800/50">
                    <Skeleton className="w-full h-full bg-slate-800" />

                    {/* Participants Overlay Skeleton */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-8 w-32 rounded-full bg-slate-700/50" />
                        ))}
                    </div>
                </div>

                {/* Bottom Controls Skeleton */}
                <div className="mt-auto flex justify-center pb-6 pt-4 z-20">
                    <Skeleton className="h-16 w-80 rounded-2xl bg-slate-800/80" />
                </div>
            </div>

            {/* RIGHT SIDEBAR (Col Span 1) */}
            <aside className="bg-slate-950 col-span-1 border-l border-slate-800 h-full overflow-hidden flex flex-col">
                {/* Header Tabs Skeleton */}
                <div className="p-4 border-b border-slate-800 flex gap-2">
                    <Skeleton className="h-8 flex-1 rounded bg-slate-800" />
                    <Skeleton className="h-8 flex-1 rounded bg-slate-800" />
                </div>

                {/* Messages Skeleton */}
                <div className="flex-1 p-4 space-y-4 overflow-hidden">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'items-end' : 'items-start'} gap-1`}>
                            <Skeleton className={`h-10 rounded-lg bg-slate-800 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'}`} />
                            <Skeleton className="h-3 w-16 rounded bg-slate-800/50" />
                        </div>
                    ))}
                </div>

                {/* Input Area Skeleton */}
                <div className="p-4 bg-slate-900 border-t border-slate-800">
                    <Skeleton className="h-10 w-full rounded-md bg-slate-800" />
                </div>
            </aside>
        </main>
    )
}
