import { api } from '../api-client';
import { setTokenSecure, getTokenSecure, clearTokenSecure } from './auth-storage';
import { z } from 'zod';

const LoginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
});

type LoginResponse = z.infer<typeof LoginResponseSchema>;

interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });

  const validated = LoginResponseSchema.parse(response);
  await setTokenSecure(validated.token);
  return validated;
}

export async function logout() {
  await clearTokenSecure();
}

export async function refreshToken(): Promise<string | undefined> {
  const token = await getTokenSecure();
  if (!token) return undefined;

  try {
    const response = await api<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });
    await setTokenSecure(response.token);
    return response.token;
  } catch {
    await clearTokenSecure();
    return undefined;
  }
}

export async function getCurrentUser() {
  const token = await getTokenSecure();
  if (!token) return undefined;

  try {
    const user = await api<LoginResponse['user']>('/auth/me');
    return user;
  } catch {
    return undefined;
  }
}

