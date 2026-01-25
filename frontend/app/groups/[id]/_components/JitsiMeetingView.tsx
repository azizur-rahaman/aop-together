'use client';

import { useEffect, useState } from "react";
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

export function JitsiMeetingView({ groupId }: { groupId: string }) {
    const [token, setToken] = useState("");
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    // Fetch JWT from our Spring Boot Backend
                    const response = await api.post('/jitsi/token', {
                        roomName: groupId,
                        userName: currentUser.displayName || "User",
                        userEmail: currentUser.email || "",
                        userId: currentUser.uid,
                        isModerator: false // Logic can be improved
                    });

                    if (response && response.token) {
                        setToken(response.token);
                    } else {
                        console.error("No token in response", response);
                        toast.error("Failed to join room securely");
                    }
                } catch (error) {
                    console.error("Failed to fetch Jitsi token", error);
                    toast.error("Failed to connect to video server");
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Not logged in? ProtectedRoute should handle, but just in case
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, [groupId]);

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <span className="ml-3">Preparing Security Token...</span>
            </div>
        );
    }

    if (!token || !user) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                <p>Authentication failed or loading...</p>
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
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}
                userInfo={{
                    displayName: user.displayName || "User",
                    email: user.email || ""
                }}
                onApiReady={(externalApi: any) => {
                    // You can attach listeners here
                    externalApi.on('videoConferenceLeft', () => {
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
