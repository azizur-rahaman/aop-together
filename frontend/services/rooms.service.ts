import { api } from '@/lib/api';
import { Room, CreateRoomRequest, JoinRoomRequest, UserRoomStatus } from '@/lib/types';

/**
 * Get all rooms, optionally filtered by subject
 */
export async function getRooms(subject?: string): Promise<Room[]> {
  try {
    const endpoint = subject ? `/rooms?subject=${encodeURIComponent(subject)}` : '/rooms';
    const rooms = await api.get<Room[]>(endpoint);
    return rooms;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
}

/**
 * Get a specific room by ID
 */
export async function getRoomById(roomId: string): Promise<Room> {
  try {
    const room = await api.get<Room>(`/rooms/${roomId}`);
    return room;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
}

/**
 * Create a new room
 */
export async function createRoom(data: CreateRoomRequest): Promise<Room> {
  try {
    const room = await api.post<Room>('/rooms', data);
    return room;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}

/**
 * Join a room
 */
export async function joinRoom(roomId: string, userId: string): Promise<void> {
  try {
    await api.post<void>(`/rooms/${roomId}/join`, { userId });
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
}

/**
 * Leave a room
 */
export async function leaveRoom(roomId: string, userId: string): Promise<void> {
  try {
    await api.post<void>(`/rooms/${roomId}/leave`, { userId });
  } catch (error) {
    console.error('Error leaving room:', error);
    throw error;
  }
}

/**
 * Check if user is currently in a room
 */
export async function getUserRoomStatus(userId: string): Promise<UserRoomStatus> {
  try {
    const status = await api.get<UserRoomStatus>(`/users/${userId}/room-status`);
    return status;
  } catch (error) {
    console.error('Error checking user room status:', error);
    throw error;
  }
}
