import { API_BASE_URL } from "../constants";

const TOKEN_KEY = 'aerozip_jwt';

// Token management
const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    nome: string;
    cognome: string;
  };
}

// API calls
const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data: AuthResponse = await response.json();
  setToken(data.token);
  document.dispatchEvent(new CustomEvent('login'));
  return data;
};

const register = async (
  userData: RegistrationRequest
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  const data: AuthResponse = await response.json();
  setToken(data.token);
  document.dispatchEvent(new CustomEvent('login'));
  return data;
};

const logout = (): void => {
  removeToken();
};

// Helper for authenticated calls
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const authService = {
  login,
  register,
  logout,
  getToken,
  getAuthHeaders,
  isAuthenticated,
  removeToken
};
