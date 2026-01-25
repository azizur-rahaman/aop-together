'use client';

import { Button } from "@/components/ui/button";
import {
  MicrochipIcon,
  Network,
  VideoIcon,
  Phone,
  MicOff as MicrochipOffIcon,
  Users as UsersIcon,
  UserMinus,
  Loader2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  LayoutGrid,
  MonitorPlay
} from "lucide-react";
import { useEffect, useState } from "react";
import { onSnapshot, collection, getDoc, doc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { leaveRoom, isParticipantOfRoom } from "../services/join.service";
import toast from "react-hot-toast";
import { WatchPartyView } from "./WatchPartyView";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useTracks,
  isTrackReference,
  VideoConference,
  ControlBar,
  useParticipants,
  VideoTrack,
  useParticipantTracks
} from "@livekit/components-react";
import { Track, Participant as LiveKitParticipant } from "livekit-client";
import "@livekit/components-styles";

interface Participant {
  id: string;
  userId: string;
  isOnline: Timestamp;
  joinedAt: Timestamp;
  name: string;
  photoURL: string;
}

export function VideoCallView({ groupId, initialParticipants }: { groupId: string, initialParticipants: any[] }) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [user, setUser] = useState<any>(null);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isEndMeetingDialogOpen, setIsEndMeetingDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [viewMode, setViewMode] = useState<'cinema' | 'grid'>('grid');

  const router = useRouter();

  // Auth & Token Fetching
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && groupId) {
        try {
          // Security Check: Ensure user is actually a participant
          const isParticipant = await isParticipantOfRoom(groupId, currentUser.uid);

          if (!isParticipant) {
            toast.error("Access Denied: You must join the room first.");
            router.push('/groups');
            return;
          }

          const resp = await fetch(`/api/livekit/token?room=${groupId}&identity=${currentUser.uid}&name=${currentUser.displayName || currentUser.uid}`);
          const data = await resp.json();
          setToken(data.token);
        } catch (e) {
          console.error("Failed to fetch LiveKit token", e);
          toast.error("Failed to connect to audio server");
        }
      } else if (!currentUser) {
        // Optional: You could redirect if no user, but ProtectedRoute should handle this layout-wise. 
      }
    });
    return () => unsubscribeAuth();
  }, [groupId, router]);

  // Firestore Participants Sync (Keep this for the list UI if needed, or rely on LiveKit peers)
  useEffect(() => {
    if (!groupId) return;
    const participantsRef = collection(db, 'rooms', groupId, 'participants');
    const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
      const updated = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Participant[];
      setParticipants(updated);
    });
    return () => unsubscribe();
  }, [groupId]);

  // Host Check
  useEffect(() => {
    if (groupId && user) {
      getDoc(doc(db, 'rooms', groupId)).then(snap => {
        if (snap.exists() && (snap.data().hostId === user.uid || snap.data().createdBy === user.uid)) {
          setIsHost(true);
        }
      });
    }
  }, [groupId, user]);

  // Room Deletion Listener (End Meeting)
  useEffect(() => {
    if (!groupId) return;
    const roomRef = doc(db, 'rooms', groupId);
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (!doc.exists()) {
        if (!isHost) {
          toast("Meeting has ended. Returning to groups.");
        }
        router.push('/groups');
      }
    });

    return () => unsubscribe();
  }, [groupId, router, isHost]);

  const handleLeave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await leaveRoom(groupId, user.uid);
      toast.success("Left the room");
      router.push('/groups');
    } catch (error) {
      console.error("Failed to leave room", error);
      toast.error("Failed to leave room");
      setIsLoading(false);
    }
  };

  const handleEndMeeting = async () => {
    if (!user || !isHost) return;
    setIsLoading(true);
    try {
      // Import dynamically to avoid circular deps if any
      const { endMeeting } = await import("../services/room.service");
      await endMeeting(groupId);
      // Room listener will handle the redirect
    } catch (error) {
      console.error("Failed to end meeting", error);
      toast.error("Failed to end meeting");
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-1 flex flex-col relative overflow-hidden h-full rounded-none w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin w-8 h-8 opacity-50 text-white" />
          <span className="text-sm opacity-50 text-white">Connecting to Room...</span>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={false} // Disabled video by default
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-1 flex flex-col relative overflow-hidden h-full rounded-none w-full"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col p-4">
        <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative bg-black/20">

          {/* WatchParty Layer (Cinema Mode) */}
          {viewMode === 'cinema' && (
            <div className="absolute inset-0 z-20 transition-opacity duration-300">
              <WatchPartyView roomId={groupId} />
            </div>
          )}

          {/* Avatar Grid Layer (Responsive Grid) */}
          <div className="absolute inset-0 p-4 overflow-y-auto z-10">
            <div className={`
                grid gap-4 w-full h-full
                ${participants.length <= 1 ? 'grid-cols-1 grid-rows-1' : ''}
                ${participants.length === 2 ? 'grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1' : ''}
                ${participants.length > 2 && participants.length <= 4 ? 'grid-cols-2 grid-rows-2' : ''}
                ${participants.length > 4 && participants.length <= 6 ? 'grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2' : ''}
                ${participants.length > 6 && participants.length <= 9 ? 'grid-cols-3 grid-rows-3' : ''}
                ${participants.length > 9 ? 'grid-cols-3 grid-rows-4 md:grid-cols-4 md:grid-rows-3' : ''}
            `}>
              {participants.map((p) => (
                <ParticipantAvatar key={p.id} participant={p} totalParticipants={participants.length} />
              ))}
            </div>
          </div>

          {/* Floating Participants List (Visible in Cinema Mode for context) */}
          {// ... existing cinema mode list code same as before ... 
            viewMode === 'cinema' && (
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-30">
                {participants.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
                    <img src={p.photoURL} alt={p.name} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-white font-medium">{p.name}</span>
                  </div>
                ))}
              </div>
            )}

        </div>
      </div>

      {/* ... LiveKit Components ... */}
      <RoomAudioRenderer />

      {/* ... CustomControlBar ... */}
      <div className="mt-auto flex justify-center pb-6 z-20">
        <CustomControlBar
          isMuted={false}
          viewMode={viewMode}
          onToggleView={() => setViewMode(prev => prev === 'cinema' ? 'grid' : 'cinema')}
          onLeave={() => setIsLeaveDialogOpen(true)}
          onEndMeeting={isHost ? () => setIsEndMeetingDialogOpen(true) : undefined}
          onToggleParticipants={() => setParticipantsOpen(!participantsOpen)}
          participantsOpen={participantsOpen}
        />
      </div>

      {/* ... Participants Modal ... */}
      {participantsOpen && (
        <div className="absolute top-4 right-4 z-30 w-64 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[500px]">
          <div className="p-3 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-white text-sm">Participants ({participants.length})</h3>
            <Button size="sm" variant="ghost" onClick={() => setParticipantsOpen(false)} className="h-6 w-6 p-0 rounded-full">✕</Button>
          </div>
          <div className="overflow-y-auto p-2 space-y-1">
            {participants.map(p => (
              <div key={p.id} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded">
                <img src={p.photoURL} className="w-6 h-6 rounded-full bg-slate-800" />
                <span className="text-white text-sm truncate">{p.name}</span>
                {isHost && p.userId !== user?.uid && (
                  <div className="ml-auto flex gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => import("../services/room.service").then(s => s.kickParticipant(groupId, p.id))}><UserMinus className="w-3 h-3" /></Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ... Leave Dialog ... */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        {/* ... dialog content ... */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Room?</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this room?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleLeave} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Meeting Dialog */}
      <Dialog open={isEndMeetingDialogOpen} onOpenChange={setIsEndMeetingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Meeting for Everyone?</DialogTitle>
            <DialogDescription>
              This will remove the room and disconnect all participants.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEndMeetingDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleEndMeeting} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "End Meeting"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LiveKitRoom>
  );
}

function ParticipantAvatar({ participant, totalParticipants }: { participant: Participant, totalParticipants: number }) {
  const allParticipants = useParticipants();
  const lkParticipant = allParticipants.find(p => p.identity === participant.userId || p.name === participant.name);

  const tracks = useTracks([Track.Source.Camera]);
  const userVideoTrack = tracks.find(t => t.participant.identity === participant.userId);

  const isVideoEnabled = !!userVideoTrack && userVideoTrack.publication.isSubscribed && !userVideoTrack.publication.isMuted;

  const initials = participant.name
    ? participant.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : "?";

  // Deterministic color
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-violet-500',
    'from-rose-500 to-red-500',
    'from-teal-500 to-emerald-500'
  ];
  const colorIndex = (participant.userId || "").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const gradient = colors[colorIndex];

  return (
    <div className={`
        relative overflow-hidden rounded-2xl bg-slate-800 border border-white/10 shadow-2xl transition-all
        ${(!isVideoEnabled) ? `bg-gradient-to-br ${gradient}` : 'bg-black'}
        w-full h-full flex items-center justify-center
        group
    `}>

      {isVideoEnabled && userVideoTrack ? (
        <VideoTrack
          trackRef={userVideoTrack}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 scale-110">
          {participant.photoURL && participant.photoURL.length > 20 ? (
            <img src={participant.photoURL} alt={participant.name} className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-2 border-white/10">
              {initials}
            </div>
          )}
        </div>
      )}

      {/* Name Label Overlay (Bottom Left) */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white font-medium text-sm shadow-lg z-20">
        {participant.name}
        {lkParticipant?.isMicrophoneEnabled === false && <MicrochipOffIcon className="w-3 h-3 text-red-400" />}
      </div>

      {/* Speaking Indicator Border */}
      <div className={`absolute inset-0 border-2 rounded-2xl transition-colors duration-300 pointer-events-none z-30 ${lkParticipant?.isSpeaking ? 'border-green-500/80 shadow-[inset_0_0_20px_rgba(34,197,94,0.3)]' : 'border-transparent'}`} />

    </div>
  );
}


function CustomControlBar({ onLeave, onEndMeeting, onToggleParticipants, participantsOpen, isMuted, viewMode, onToggleView }: { onLeave: () => void, onEndMeeting?: () => void, onToggleParticipants: () => void, participantsOpen: boolean, isMuted: boolean, viewMode: 'cinema' | 'grid', onToggleView: () => void }) {
  const { isMicrophoneEnabled, isCameraEnabled, localParticipant } = useLocalParticipant();

  const buttonBaseClass = "rounded-xl w-10 h-10 md:w-12 md:h-12 transition-all duration-200 flex items-center justify-center";
  const activeClass = "bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/10 scale-105";
  const inactiveClass = "bg-white/10 text-white hover:bg-white/20 backdrop-blur";
  const destructiveClass = "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20";

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 px-3 py-2 md:px-6 md:py-3 flex gap-2 md:gap-4 items-center max-w-full overflow-x-auto no-scrollbar mx-4 md:mx-0">

      {/* Microphone */}
      <Button
        size="icon"
        variant="ghost" // Using custom classes, ghost removes default shadcn bg styles interfering
        onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
        className={`${buttonBaseClass} ${isMicrophoneEnabled ? inactiveClass : destructiveClass}`}
        title={isMicrophoneEnabled ? "Mute Microphone" : "Unmute Microphone"}
      >
        {!isMicrophoneEnabled ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>

      {/* Camera */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
        className={`${buttonBaseClass} ${isCameraEnabled ? inactiveClass : destructiveClass}`}
        title={isCameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
      >
        {!isCameraEnabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
      </Button>

      <div className="w-px h-6 md:h-8 bg-white/10 mx-1 md:mx-2" /> {/* Separator */}

      {/* View Toggle */}
      <Button
        size="icon"
        variant="ghost"
        onClick={onToggleView}
        className={`${buttonBaseClass} ${inactiveClass} hover:scale-105`} // Always 'neutral' action style, just toggles state
        title={viewMode === 'cinema' ? "Switch to Grid View" : "Switch to Cinema Mode"}
      >
        {viewMode === 'cinema' ? <LayoutGrid className="w-5 h-5" /> : <MonitorPlay className="w-5 h-5" />}
      </Button>

      {/* Participants Toggle */}
      <Button
        size="icon"
        variant="ghost"
        onClick={onToggleParticipants}
        className={`${buttonBaseClass} ${participantsOpen ? activeClass : inactiveClass}`}
        title="Participants List"
      >
        <UsersIcon className="w-5 h-5" />
      </Button>

      <div className="w-px h-6 md:h-8 bg-white/10 mx-1 md:mx-2" /> {/* Separator */}

      {/* Leave Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={onLeave}
        className={`${buttonBaseClass} bg-red-600 text-white hover:bg-red-700 hover:scale-110 shadow-lg shadow-red-600/30`}
      >
        <Phone className="w-5 h-5 fill-white" />
      </Button>

      {/* End Meeting Button (Host Only) */}
      {onEndMeeting && (
        <>
          <div className="w-px h-6 md:h-8 bg-white/10 mx-1 md:mx-2" />
          <Button
            size="icon"
            variant="ghost"
            onClick={onEndMeeting}
            className={`${buttonBaseClass} bg-red-800 text-white hover:bg-red-900 hover:scale-110 shadow-lg shadow-red-900/30`}
            title="End Meeting for All"
          >
            <MicrochipIcon className="w-5 h-5" />
          </Button>
        </>
      )}
    </div>
  );
}
