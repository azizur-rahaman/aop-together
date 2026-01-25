import { api } from '@/lib/api';

export interface Participant {
  userId: string;
  name: string;
  photoURL: string;
  joinedAt: string;
  isOnline: boolean;
}

export interface ParticipantListResponse {
  participants: Participant[];
  count: number;
}

/**
 * Get participants for a specific room
 */
export async function getRoomParticipants(roomId: string): Promise<Participant[]> {
  try {
    const response = await api.get<ParticipantListResponse>(`/rooms/${roomId}/participants`);
    return response?.participants || [];
  } catch (error) {
    console.error('Error fetching room participants:', error);
    throw error;
  }
}

/**
 * Update participant online status
 */
export async function updateParticipantStatus(roomId: string, userId: string, isOnline: boolean): Promise<void> {
  try {
    await api.post<void>(`/rooms/${roomId}/participants/${userId}/status`, { isOnline });
  } catch (error) {
    console.error('Error updating participant status:', error);
    throw error;
  }
}
