import { api } from '../api-client';
import { setTokenSecure, getTokenSecure, clearTokenSecure } from './auth-storage';
import { endpoints } from '../api-client/endpoints';
import { z } from 'zod';

const LoginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone_number: z.string().optional(),
    profile_picture: z.string().optional(),
    relationships: z.array(z.object({
      id: z.string(),
      role: z.string(),
      name: z.string(),
      company_id: z.string(),
    })).optional(),
    userMeta: z.array(z.object({
      meta_key: z.string(),
      meta_value: z.string(),
    })).optional(),
  }),
});

type LoginResponse = z.infer<typeof LoginResponseSchema>;

interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api<LoginResponse>(endpoints.auth.login(), {
    method: 'POST',
    body: credentials,
  });

  try {
    const validated = LoginResponseSchema.parse(response);
    console.log('Login validation successful:', { 
      hasRelationships: !!validated.user.relationships,
      relationshipsCount: validated.user.relationships?.length || 0 
    });
    await setTokenSecure(validated.token);
    return validated;
  } catch (error) {
    console.error('Login validation error:', error);
    console.error('Response data:', JSON.stringify(response, null, 2));
    throw error;
  }
}

export async function logout() {
  await clearTokenSecure();
}

export async function refreshToken(): Promise<string | undefined> {
  const token = await getTokenSecure();
  if (!token) return undefined;

  try {
    const response = await api<{ token: string }>(endpoints.auth.refresh(), {
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
    const response = await api<{ user: LoginResponse['user'] }>(endpoints.auth.me());
    console.log('getCurrentUser response:', {
      hasUser: !!response.user,
      hasRelationships: !!response.user?.relationships,
      relationshipsCount: response.user?.relationships?.length || 0
    });
    return response.user;
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return undefined;
  }
}

