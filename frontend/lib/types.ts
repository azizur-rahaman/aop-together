// Type definitions for backend models

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  subject: string;
  hostId: string;
  maxParticipants: number;
  participantCount: number;
  isPublic: boolean;
  status: string;
  createdAt: string;
}

export interface CreateRoomRequest {
  name: string;
  description?: string;
  subject: string;
  maxParticipants: number;
  isPublic: boolean;
  hostId: string;
}

export interface JoinRoomRequest {
  userId: string;
}

export interface UserRoomStatus {
  isInRoom: boolean;
  roomId?: string;
}

export interface Participant {
  userId: string;
  name: string;
  photoURL: string;
  joinedAt: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  type: 'chat' | 'problem';
  createdAt: string;
}
