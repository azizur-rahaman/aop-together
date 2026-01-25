import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2, Users } from "lucide-react";
import { Room } from "@/lib/types";
import { User } from "firebase/auth";
import { joinRoom, getUserRoomStatus, leaveRoom } from "@/services/rooms.service";

interface StudyRoomCardProps {
    room: Room;
    currentUser: User | null;
}

export function StudyRoomCard({ room, currentUser }: StudyRoomCardProps) {
    const router = useRouter();
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
    const [existingRoomId, setExistingRoomId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleJoinClick = async () => {
        if (!currentUser) {
            toast.error("Please sign in to join a room");
            return;
        }

        setIsLoading(true);
        try {
            const status = await getUserRoomStatus(currentUser.uid);

            if (status.isInRoom) {
                if (status.roomId === room.id) {
                    // Already in this room, just redirect
                    router.push(`/groups/${room.id}`);
                    return;
                } else {
                    // In another room, ask to switch
                    setExistingRoomId(status.roomId!);
                    setIsJoinDialogOpen(true);
                    setIsLoading(false);
                    return;
                }
            }

            // Not in any room, proceed to join
            await executeJoin();

        } catch (error) {
            console.error("Error checking room status:", error);
            toast.error("Failed to check room status");
            setIsLoading(false);
        }
    };

    const executeJoin = async () => {
        if (!currentUser) return;

        setIsLoading(true);
        try {
            if (existingRoomId) {
                // If switching, leave the old room first
                await leaveRoom(existingRoomId, currentUser.uid);
            }

            await joinRoom(room.id, currentUser.uid);

            toast.success(`Joined ${room.name}`);
            setIsJoinDialogOpen(false);
            router.push(`/groups/${room.id}`);

        } catch (error: any) {
            console.error("Error joining room:", error);
            toast.error(error.message || "Failed to join room");
        } finally {
            setIsLoading(false);
        }
    };


    const getSubjectStyle = (subject: string) => {
        const lower = subject.toLowerCase();
        if (lower.includes('phys')) return "bg-[#DBEAFE] text-[#3B82F6]";
        if (lower.includes('chem')) return "bg-[#FEF3C7] text-[#F59E0B]";
        if (lower.includes('math')) return "bg-[#FFF7ED] text-[#F97316]";
        if (lower.includes('bio')) return "bg-[#ECFDF3] text-[#22C55E]";
        if (lower.includes('history')) return "bg-[#F5F3FF] text-[#8B5CF6]";
        if (lower.includes('comp') || lower.includes('cod')) return "bg-[#F0F9FF] text-[#0EA5E9]";
        return "bg-[#F1F5F9] text-[#64748B]";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <>
            <Card className="w-full max-w-md p-5 flex flex-col justify-between rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white">

                {/* Header: Tags */}
                <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className={`${getSubjectStyle(room.subject || '')} border-none rounded-md px-3 py-1 font-medium`}>
                        {room.subject || 'General'}
                    </Badge>

                    {room.status === 'active' && (
                        <Badge className="bg-[#22C55E] hover:bg-[#22C55E] text-white rounded-full flex items-center px-2 py-0.5 text-xs font-bold border-none gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            LIVE
                        </Badge>
                    )}
                </div>

                {/* Body: content */}
                <div className="space-y-2 mb-6">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        {room.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2">
                        {room.description || "Join to study together"}
                    </p>
                </div>

                {/* Footer: Participants & Action */}
                <div className="flex items-center justify-between mt-auto">
                    {/* Participants count */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-md">
                            <Users className="h-4 w-4 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-600">
                                {room.participantCount}/{room.maxParticipants}
                            </span>
                        </div>
                        {room.createdAt && (
                            <span className="text-xs text-slate-400">
                                {formatDate(room.createdAt)}
                            </span>
                        )}
                    </div>

                    <Button
                        onClick={handleJoinClick}
                        disabled={isLoading || room.participantCount >= room.maxParticipants}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-medium h-10 min-w-[100px] shadow-sm shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : room.participantCount >= room.maxParticipants ? (
                            "Full"
                        ) : (
                            "Join"
                        )}
                    </Button>
                </div>
            </Card>

            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Switch Room?</DialogTitle>
                        <DialogDescription>
                            You are currently in another study room. Do you want to leave that room and join <strong>{room.name}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)} disabled={isLoading}>Cancel</Button>
                        <Button onClick={executeJoin} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Switch and Join"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}