import { api } from '@/lib/api';

export interface JitsiTokenRequest {
  roomName: string;
  userName: string;
  userEmail: string;
  userId: string;
  isModerator: boolean;
}

export interface JitsiTokenResponse {
  token: string;
}

/**
 * Get Jitsi JWT token for secure meeting access
 */
export async function getJitsiToken(data: JitsiTokenRequest): Promise<string> {
  try {
    const response = await api.post<JitsiTokenResponse>('/jitsi/token', data);
    return response.token;
  } catch (error) {
    console.error('Error fetching Jitsi token:', error);
    throw error;
  }
}
