'use client';

import { useEffect, useState } from "react";
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { getJitsiToken } from "@/services/jitsi.service";
import { joinRoom, leaveRoom } from "@/services/rooms.service";

export function JitsiMeetingView({ groupId }: { groupId: string }) {
    const [token, setToken] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    // Join the room first
                    await joinRoom(groupId, currentUser.uid);

                    // Fetch JWT from backend
                    const jitsiToken = await getJitsiToken({
                        roomName: groupId,
                        userName: currentUser.displayName || "User",
                        userEmail: currentUser.email || "",
                        userId: currentUser.uid,
                        isModerator: false
                    });

                    setToken(jitsiToken);
                } catch (error: any) {
                    console.error("Failed to setup meeting", error);
                    toast.error(error.message || "Failed to join meeting");
                    router.push('/groups');
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [groupId, router]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (user) {
                leaveRoom(groupId, user.uid).catch(err => 
                    console.error("Failed to leave room on unmount", err)
                );
            }
        };
    }, [groupId, user]);

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <span className="ml-3">Connecting to meeting...</span>
            </div>
        );
    }

    if (!token || !user) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                <p>Unable to connect. Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-slate-900 relative">
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={groupId}
                jwt={token}
                configOverwrite={{
                    startWithAudioMuted: true,
                    disableThirdPartyRequests: true,
                    prejoinPageEnabled: false,
                    enableWelcomePage: false,
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    SHOW_JITSI_WATERMARK: false,
                }}
                userInfo={{
                    displayName: user.displayName || "User",
                    email: user.email || ""
                }}
                onApiReady={(externalApi: any) => {
                    // Handle video conference events
                    externalApi.on('videoConferenceLeft', async () => {
                        try {
                            await leaveRoom(groupId, user.uid);
                            router.push('/groups');
                        } catch (error) {
                            console.error("Error leaving room:", error);
                            router.push('/groups');
                        }
                    });

                    externalApi.on('readyToClose', () => {
                        router.push('/groups');
                    });
                }}
                getIFrameRef={(iframeRef: HTMLDivElement) => {
                    iframeRef.style.height = '100%';
                    iframeRef.style.width = '100%';
                }}
            />
        </div>
    );
}
