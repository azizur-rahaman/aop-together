import { api } from '@/lib/api';
import { Subject } from '@/lib/types';

/**
 * Get all subjects from the backend
 */
export async function getSubjects(): Promise<Subject[]> {
  try {
    const subjects = await api.get<Subject[]>('/subjects');
    return subjects;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
}
