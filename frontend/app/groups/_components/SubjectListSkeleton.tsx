import { Skeleton } from "@/components/ui/skeleton"
import { ButtonGroup } from "@/components/ui/button-group"

export function SubjectListSkeleton() {
    return (
        <div className="flex flex-col items-start gap-8">
            <ButtonGroup>
                {/* All Subjects button placeholder */}
                <Skeleton className="h-8 w-24 rounded-md" />

                {/* Subject buttons placeholders */}
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-32 rounded-md" />
                ))}
            </ButtonGroup>
        </div>
    )
}
