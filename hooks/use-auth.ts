import { useState, useEffect } from 'react';

/**
 * Mock Auth Hook
 * TODO: Replace with actual auth implementation
 */
export const useAuth = () => {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    // Mock user - replace with actual auth logic
    setUser({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    });
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    login: async () => {},
    logout: async () => {},
  };
};

