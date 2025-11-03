import { useEffect } from 'react';
import { connectSocket, getSocket, disconnectSocket } from '../services/socket/socket-client';

export function useSocket(token?: string) {
  useEffect(() => {
    const s = connectSocket(token);

    return () => {
      s.off();
      disconnectSocket();
    };
  }, [token]);

  return getSocket();
}

