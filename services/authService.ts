// src/services/authService.ts
import { api } from './api';

export interface SignUpRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface JwtAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const register = async (data: SignUpRequest) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data: SignInRequest): Promise<JwtAuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<JwtAuthResponse> => {
  const response = await api.post('/auth/refresh', { refreshToken });
  return response.data;
};
