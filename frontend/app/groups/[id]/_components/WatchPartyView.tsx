'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Link as LinkIcon } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { updateVideoUrl } from "../services/room.service";

export function WatchPartyView({ roomId }: { roomId: string }) {
    const [videoUrl, setVideoUrl] = useState("");
    const [inputUrl, setInputUrl] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (!roomId) return;

        const roomRef = doc(db, 'rooms', roomId);
        const unsubscribe = onSnapshot(roomRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.currentVideoUrl) {
                    setVideoUrl(data.currentVideoUrl);
                }
            }
        });

        return () => unsubscribe();
    }, [roomId]);

    const handleUpdateUrl = async () => {
        if (!inputUrl.trim()) return;

        // Simple YouTube embed transformation
        let embedUrl = inputUrl;
        if (inputUrl.includes("youtube.com/watch?v=")) {
            const videoId = inputUrl.split("v=")[1].split("&")[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } else if (inputUrl.includes("youtu.be/")) {
            const videoId = inputUrl.split("youtu.be/")[1];
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }

        try {
            await updateVideoUrl(roomId, embedUrl);
            setInputUrl("");
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Failed to update video URL", error);
        }
    };

    return (
        <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-800">
            {videoUrl ? (
                <iframe
                    src={videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <div className="text-center text-slate-500 p-8">
                    <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No video playing. Add a YouTube link to watch together.</p>
                </div>
            )}

            {/* Controls Overlay */}
            <div className={`absolute top-4 right-4 z-20 transition-all ${isMenuOpen ? 'w-80' : 'w-auto'}`}>
                {isMenuOpen ? (
                    <div className="bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-700 shadow-xl flex gap-2">
                        <Input
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="Paste YouTube URL..."
                            className="bg-black/50 border-slate-600 text-white h-9 text-sm"
                        />
                        <Button size="sm" onClick={handleUpdateUrl} className="shrink-0 bg-blue-600 hover:bg-blue-700">
                            Play
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsMenuOpen(false)} className="shrink-0 h-9 w-9 p-0">
                            ✕
                        </Button>
                    </div>
                ) : (
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsMenuOpen(true)}
                        className="bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur shadow-lg"
                    >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Set Video
                    </Button>
                )}
            </div>
        </div>
    );
}
