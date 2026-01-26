'use client';

import { useEffect, useState } from "react";
import { ProblemsSection } from "./ProblemsSection";
import { Users, Loader2, MessageSquare, BookOpen, Info } from "lucide-react";
import { getRoomParticipants } from "@/services/participants.service";
import { getRoomById } from "@/services/rooms.service";
import { Room } from "@/lib/types";
import Image from "next/image";
import { Chat, useRoomContext } from "@livekit/components-react";
import { cn } from "@/lib/utils";

interface Participant {
  userId: string;
  name: string;
  photoURL: string;
  joinedAt: string;
  isOnline: boolean;
}

type Tab = 'info' | 'chat' | 'problems';

export function RightSidebar({ groupId }: { groupId: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const roomContext = useRoomContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomData, participantsData] = await Promise.all([
          getRoomById(groupId),
          getRoomParticipants(groupId)
        ]);
        setRoom(roomData);
        setParticipants(participantsData || []);
      } catch (error) {
        console.error('Failed to fetch room data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(async () => {
      try {
        const participantsData = await getRoomParticipants(groupId);
        setParticipants(participantsData || []);
      } catch (error) {
        console.error('Failed to refresh participants:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [groupId]);

  return (
    <aside className="bg-slate-900 h-full w-full overflow-hidden flex flex-col border-l border-slate-800">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-800 bg-slate-950/50">
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all relative",
            activeTab === 'chat' ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Chat</span>
          {activeTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all relative",
            activeTab === 'info' ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
          )}
        >
          <Users className="h-5 w-5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Members</span>
          {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all relative",
            activeTab === 'problems' ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
          )}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Tasks</span>
          {activeTab === 'problems' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col h-full lk-chat-container">
            <Chat />
          </div>
        )}

        {activeTab === 'info' && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-950/30">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-slate-400 mx-auto" />
              ) : room ? (
                <div>
                  <h2 className="text-sm font-bold text-white truncate">{room.name}</h2>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{room.subject}</p>
                </div>
              ) : null}
            </div>

            <div className="p-4 flex-1">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                Participants ({(participants?.length || 0)}{room ? `/${room.maxParticipants}` : ''})
              </h3>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-8 h-8 bg-slate-800 rounded-full" />
                      <div className="flex-1">
                        <div className="h-3 bg-slate-800 rounded w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (participants?.length || 0) === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Room is quiet...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {participants?.map((participant) => (
                    <div
                      key={participant.userId}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                          <Image
                            src={participant.photoURL || '/images/avatar-female.svg'}
                            alt={participant.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {participant.isOnline && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                          {participant.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="flex-1 overflow-y-auto">
            <ProblemsSection roomId={groupId} />
          </div>
        )}
      </div>
    </aside>
  );
}
