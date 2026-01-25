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
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
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
                    // Join the backend study room logic first
                    await joinRoom(groupId, currentUser.uid);

                    // Fetch LiveKit Token from Backend
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

    // Cleanup on unmount - remove user from stud room
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
        <div className="h-full w-full bg-slate-900 relative flex flex-col">
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
                style={{ height: '100%' }}
            >
                <VideoConference />
            </LiveKitRoom>
        </div>
    );
}

function MyVideoConference() {
    // optional custom layout if needed, otherwise VideoConference is good default
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            <ParticipantTile />
        </GridLayout>
    );
}
