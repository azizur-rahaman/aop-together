'use client';

import { useEffect, useState } from "react";
import { ProblemsSection } from "./ProblemsSection";
import { Users, Loader2 } from "lucide-react";
import { getRoomParticipants } from "@/services/participants.service";
import { getRoomById } from "@/services/rooms.service";
import { Room } from "@/lib/types";
import Image from "next/image";

interface Participant {
  userId: string;
  name: string;
  photoURL: string;
  joinedAt: string;
  isOnline: boolean;
}

export function RightSidebar({ groupId }: { groupId: string }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    // Poll for participant updates every 10 seconds
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
    <aside className="bg-slate-950 h-full w-full overflow-hidden flex flex-col">
      {/* Room Info Header */}
      <div className="p-4 border-b border-slate-800">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : room ? (
          <div>
            <h2 className="text-lg font-bold text-white truncate">{room.name}</h2>
            <p className="text-sm text-slate-400 truncate">{room.subject}</p>
            {room.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{room.description}</p>
            )}
          </div>
        ) : null}
      </div>

      {/* Participants Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants ({(participants?.length || 0)}{room ? `/${room.maxParticipants}` : ''})
            </h3>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-slate-800 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-800 rounded w-24 mb-1" />
                    <div className="h-3 bg-slate-800 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (participants?.length || 0) === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No participants yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {participants?.map((participant) => (
                <div
                  key={participant.userId}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900/50 transition-colors"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
                      <Image
                        src={participant.photoURL || '/images/avatar-female.svg'}
                        alt={participant.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {participant.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {participant.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {participant.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Problems Section */}
      <div className="border-t border-slate-800">
        <ProblemsSection roomId={groupId} />
      </div>
    </aside>
  );
}
