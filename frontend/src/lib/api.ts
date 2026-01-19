import { supabase } from './supabase';

const API_Base = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, headers, ...rest } = options;

    const config: RequestInit = {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (requiresAuth) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
            throw new Error('No active session');
        }
        // Type checking for headers to ensure it's an object we can add to
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${session.access_token}`
        };
    }

    const response = await fetch(`${API_Base}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.statusText}`);
    }

    // Handle empty responses (like 204)
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, requiresAuth = true) => request<T>(endpoint, { method: 'GET', requiresAuth }),
    post: <T>(endpoint: string, body: any, requiresAuth = true) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), requiresAuth }),
    put: <T>(endpoint: string, body: any, requiresAuth = true) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), requiresAuth }),
    delete: <T>(endpoint: string, requiresAuth = true) => request<T>(endpoint, { method: 'DELETE', requiresAuth }),
};
