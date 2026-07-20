// Utility functions for API calls with JWT token
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getAuthToken(): Promise<string | null> {
  try {
    return await auth.currentUser?.getIdToken() || null;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiCall(endpoint, { method: 'GET' });
  return response.json();
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const response = await apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  const response = await apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await apiCall(endpoint, { method: 'DELETE' });
  return response.json();
}
