import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DocumentData, Timestamp, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { joinRoom, checkUserRoomStatus, leaveRoom } from "../[id]/services/join.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { encryptId } from "@/lib/utils/cryptoUtils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";


// interface StudyRoomCardProps {
//     id : string,
//     createdAt: Timestamp,
//     participantCount: number,
//     hostId: string,
//     isPublic: boolean,
//     lastActiveAt: Timestamp,
//     subject: string,
//     name: string,
//     maxParticipants:number,
//     status:string
// }

export function StudyRoomCard({ room, currentUser }: { room: DocumentData, currentUser: any }) {
    const router = useRouter();
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
    const [existingRoomId, setExistingRoomId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [participants, setParticipants] = useState<DocumentData[]>([]);

    useEffect(() => {
        const participantsRef = collection(db, 'rooms', room.id, 'participants');
        // Limit to 6 to show 5 avatars + count, or use logic to slice later. Fetching slightly more to valid count.
        // Actually fetches all to get accurate count if 'participantCount' on room doc isn't reliable or for real-time accuracy?
        // Let's rely on this subscription for the list.
        const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
            setParticipants(snapshot.docs.map(doc => doc.data()));
        });
        return () => unsubscribe();
    }, [room.id]);

    const handleJoinClick = async () => {
        if (!currentUser) {
            toast.error("Please sign in to join a room");
            return;
        }

        setIsLoading(true);
        try {
            const status = await checkUserRoomStatus(currentUser.uid);

            if (status.isInRoom) {
                if (status.roomId === room.id) {
                    // Already in this room, just redirect
                    const encrypt = encryptId(room.id);
                    router.push(`./groups/${encrypt}`);
                    return;
                } else {
                    // In another room, ask to switch
                    setExistingRoomId(status.roomId!);
                    setIsJoinDialogOpen(true);
                    setIsLoading(false); // Stop loading to show dialog
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
        setIsLoading(true);
        try {
            if (existingRoomId) {
                // If switching, leave the old room first
                await leaveRoom(existingRoomId, currentUser.uid);
            }

            console.log('Joining.. Room: ' + room.name);
            await joinRoom({
                parentCollection: 'rooms',
                parentDocId: room.id,
                targetSubcollection: 'participants',
                data: {
                    userId: currentUser.uid,
                    isOnline: Timestamp.now(),
                    joinedAt: Timestamp.now(),
                    name: currentUser.displayName || "Anonymous",
                    photoURL: currentUser.photoURL || 'https://img.freepik.com/premium-vector/character-avatar-isolated_729149-194801.jpg?semt=ais_hybrid&w=740&q=80'
                }
            });

            toast.success(existingRoomId ? 'Switched rooms successfully' : 'Joined successfully');
            const encrypt = encryptId(room.id);
            router.push(`./groups/${encrypt}`);
            setIsJoinDialogOpen(false); // Close dialog if open
            // Don't setIsLoading(false) here to prevent flash before redirect
        } catch (error: any) {
            console.error("Join error:", error);
            setIsLoading(false);
            if (error.message === 'Room is full') {
                toast.error("This room is full");
            } else {
                toast.error("Failed to join room");
            }
        }
    };

    const getSubjectStyle = (subject: string) => {
        const lower = subject.toLowerCase();
        if (lower.includes('math')) return "bg-[#FFF7ED] text-[#F97316]";
        if (lower.includes('bio')) return "bg-[#ECFDF3] text-[#22C55E]";
        if (lower.includes('history')) return "bg-[#F5F3FF] text-[#8B5CF6]";
        if (lower.includes('cod')) return "bg-[#F0F9FF] text-[#0EA5E9]";
        return "bg-[#F1F5F9] text-[#64748B]";
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

                {/* Footer: Avatars & Action */}
                <div className="flex items-center justify-between mt-auto">
                    {/* Avatars */}
                    <div className="flex items-center">
                        <div className="flex -space-x-3">
                            {participants.slice(0, 3).map((p, i) => (
                                <div key={i} className="relative z-10 border-2 border-white rounded-full w-8 h-8 flex items-center justify-center overflow-hidden bg-slate-100">
                                    <img
                                        src={p.photoURL || 'https://img.freepik.com/premium-vector/character-avatar-isolated_729149-194801.jpg?semt=ais_hybrid&w=740&q=80'}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        {participants.length > 0 && (
                            <div className="ml-2 px-2 py-1 bg-slate-50 rounded-md text-xs font-semibold text-slate-600">
                                +{participants.length}
                            </div>
                        )}
                        {participants.length === 0 && (
                            <span className="text-xs text-slate-400">No one here yet</span>
                        )}
                    </div>

                    <Button
                        onClick={handleJoinClick}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-medium h-10 min-w-[100px] shadow-sm shadow-blue-200">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Join"}
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