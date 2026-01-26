'use client';

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { joinRoom, leaveRoom } from "@/services/rooms.service";

import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
} from "@livekit/components-react";
import { RightSidebar } from "./RightSidebar";
import { RoomLayout } from "./RoomLayout";
import { Track } from "livekit-client";

export function LiveKitMeetingView({ groupId }: { groupId: string }) {
    const [token, setToken] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const [liveKitUrl, setLiveKitUrl] = useState(process.env.NEXT_PUBLIC_LIVEKIT_URL || "");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    await joinRoom(groupId, currentUser.uid);

                    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                    const resp = await fetch(`${backendUrl}/livekit/token`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            roomName: groupId,
                            participantName: currentUser.displayName || "User_" + currentUser.uid.slice(0, 4),
                        })
                    });

                    if (!resp.ok) {
                        throw new Error("Failed to get audio/video token");
                    }

                    const data = await resp.json();
                    setToken(data.data.token);

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
                <span className="ml-3">Connecting to studio...</span>
            </div>
        );
    }

    if (!token || !user) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                <p>Establishing secure connection...</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-slate-900 relative flex flex-col overflow-hidden">
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={liveKitUrl}
                connect={true}
                onDisconnected={() => {
                    router.push('/groups');
                }}
                data-lk-theme="default"
                className="h-full w-full"
            >
                <RoomLayout
                    sidebar={<RightSidebar groupId={groupId} />}
                >
                    <MeetingLayout />
                </RoomLayout>
                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
}

function MeetingLayout() {
    return (
        <div className="relative h-full w-full flex flex-col bg-slate-950">
            <style jsx global>{`
                /* Ensure the container takes full space */
                .lk-video-conference {
                    position: relative !important;
                    height: 100% !important;
                    width: 100% !important;
                    background: transparent !important;
                }

                /* Force the internal layout to be full size */
                .lk-video-conference-inner {
                    height: 100% !important;
                    width: 100% !important;
                }

                /* Grid and Focus layouts */
                .lk-focus-layout,
                .lk-grid-layout {
                    height: 100% !important;
                    width: 100% !important;
                    padding-bottom: 90px !important; /* Make space for control bar */
                }

                /* Control Bar - Floating Pill Design */
                .lk-control-bar {
                    position: absolute !important;
                    bottom: 20px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 0.75rem !important;
                    padding: 0.75rem 1.25rem !important;
                    background: rgba(15, 23, 42, 0.85) !important;
                    backdrop-filter: blur(8px) !important;
                    border: 1px solid rgba(148, 163, 184, 0.15) !important;
                    border-radius: 9999px !important;
                    z-index: 50 !important;
                    width: auto !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                }

                /* Clean up buttons */
                .lk-button {
                    width: 44px !important;
                    height: 44px !important;
                    padding: 0 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    border-radius: 50% !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    color: #e2e8f0 !important;
                    border: none !important;
                    transition: all 0.2s ease !important;
                }

                .lk-button-text, .lk-button > div[class*="text"] {
                    display: none !important;
                }

                .lk-button:hover {
                    background: rgba(255, 255, 255, 0.15) !important;
                    color: white !important;
                    transform: translateY(-2px);
                }

                /* Danger button (Leave) */
                .lk-disconnect-button,
                .lk-button-danger {
                    background: rgba(239, 68, 68, 0.2) !important;
                    color: #f87171 !important;
                }
                
                .lk-disconnect-button:hover,
                .lk-button-danger:hover {
                    background: #ef4444 !important;
                    color: white !important;
                }

                /* Icons */
                .lk-button svg {
                    width: 20px !important;
                    height: 20px !important;
                }
                
                /* Hide chat button in control bar since we have it in sidebar */
                .lk-chat-toggle,
                .lk-button[aria-label="Chat"],
                .lk-button[title="Chat"],
                button[aria-label="Chat"] { // specific fallback
                    display: none !important;
                }

                /* Layout adjustments for participant tiles */
                .lk-participant-tile {
                    border-radius: 12px !important;
                    overflow: hidden !important;
                    background: #1e293b !important;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
            `}</style>
            <VideoConference />
        </div>
    );
}
