const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
    error?: any;
}

export const api = {
    get: async <T = any>(endpoint: string, token?: string): Promise<T> => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });

        const data: ApiResponse<T> = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'API Error');
        }
        return data.data;
    },

    post: async <T = any>(endpoint: string, body: any, token?: string): Promise<T> => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        const data: ApiResponse<T> = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'API Error');
        }
        return data.data;
    },

    put: async <T = any>(endpoint: string, body: any, token?: string): Promise<T> => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });

        const data: ApiResponse<T> = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'API Error');
        }
        return data.data;
    },

    delete: async <T = any>(endpoint: string, token?: string): Promise<T> => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers,
        });

        const data: ApiResponse<T> = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'API Error');
        }
        return data.data;
    }
};
