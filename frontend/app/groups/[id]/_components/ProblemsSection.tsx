'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Hash, MessageSquare, Paperclip, X, Loader2, Trash2 } from "lucide-react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { sendMessage, unsendMessage } from "../services/room.service";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface Message {
    id: string;
    userId: string;
    userName: string;
    text: string;
    imageUrl?: string | null;
    status?: 'active' | 'deleted';
    type: 'chat' | 'problem';
    createdAt: Timestamp;
}

export function ProblemsSection({ roomId }: { roomId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!roomId) return;

        const messagesRef = collection(db, 'rooms', roomId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [roomId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, previewUrl]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (messageId: string) => {
        if (!confirm("Are you sure you want to unsend this message?")) return;
        try {
            await unsendMessage(roomId, messageId);
        } catch (error) {
            console.error("Failed to unsend message", error);
        }
    };

    const handleSend = async (type: 'chat' | 'problem' = 'chat') => {
        if ((!inputText.trim() && !selectedFile) || !user) return;

        setIsUploading(true);
        try {
            let imageUrl = undefined;
            if (selectedFile) {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

                if (!cloudName || !uploadPreset) {
                    console.error("Cloudinary not configured");
                    throw new Error("Image upload configuration missing");
                }

                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('upload_preset', uploadPreset);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Image upload failed');
                }

                const data = await response.json();
                imageUrl = data.secure_url;
            }

            await sendMessage(roomId, user.uid, user.displayName || 'Anonymous', inputText, type, imageUrl);
            setInputText("");
            clearFile();
        } catch (error) {
            console.error("Failed to send message", error);
            // Optionally add a toast here for better UX
            alert("Failed to send message: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Discussion & Problems
                </h2>
            </div>

            <ScrollArea className="flex-1 min-h-0 p-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.userId === user?.uid ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMessageId(activeMessageId === msg.id ? null : msg.id);
                                }}
                                className={`cursor-pointer max-w-[85%] rounded-lg p-3 group relative transition-all ${msg.type === 'problem'
                                    ? 'bg-red-500/10 border border-red-500/50'
                                    : msg.userId === user?.uid
                                        ? 'bg-blue-600'
                                        : 'bg-slate-800'
                                    } ${activeMessageId === msg.id ? 'ring-2 ring-white/20' : ''}`}
                            >
                                {msg.type === 'problem' && msg.status !== 'deleted' && (
                                    <span className="text-xs font-bold text-red-400 block mb-1 flex items-center gap-1">
                                        <Hash className="w-3 h-3" /> PROBLEM
                                    </span>
                                )}
                                <p className="text-xs text-slate-400 mb-1">{msg.userName}</p>

                                {msg.status === 'deleted' ? (
                                    <p className="text-sm text-slate-400 italic">This message has been deleted</p>
                                ) : (
                                    <>
                                        {/* Image Display */}
                                        {msg.imageUrl && (
                                            <div className="mb-2 mt-1">
                                                <img
                                                    src={msg.imageUrl}
                                                    alt="Attached content"
                                                    className="rounded-md max-h-48 object-cover border border-white/10"
                                                />
                                            </div>
                                        )}
                                        <p className="text-sm text-white break-words">{msg.text}</p>
                                    </>
                                )}
                            </div>

                            {/* Action Bar (React | Delete) - Appearing below the message */}
                            {activeMessageId === msg.id && msg.status !== 'deleted' && (
                                <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md animate-in fade-in slide-in-from-top-1 border border-white/10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); /* Implement React later */ }}
                                        className="hover:text-white transition-colors"
                                    >
                                        React
                                    </button>
                                    {msg.userId === user?.uid && (
                                        <>
                                            <div className="w-px h-3 bg-white/20" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Image Preview */}
            {previewUrl && (
                <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                    <div className="relative group">
                        <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded border border-slate-700" />
                        <button
                            onClick={clearFile}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    <span className="text-xs text-slate-400 truncate max-w-[200px]">{selectedFile?.name}</span>
                </div>
            )}

            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="flex gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!user || isUploading}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Attach Image"
                    >
                        <Paperclip className="w-4 h-4" />
                    </Button>

                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={user ? "Type a message..." : "Sign in to chat"}
                        disabled={!user || isUploading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend('chat');
                            }
                        }}
                        className="bg-slate-800 border-slate-700 text-white"
                    />
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleSend('problem')}
                        disabled={!user || (!inputText.trim() && !selectedFile) || isUploading}
                        title="Post as Problem"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                        <Hash className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        onClick={() => handleSend('chat')}
                        disabled={!user || (!inputText.trim() && !selectedFile) || isUploading}
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
