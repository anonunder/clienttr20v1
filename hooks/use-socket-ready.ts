import { useEffect, useState } from 'react';
import { socketConnectionManager, SocketConnectionStatus } from '@/socket/connection-manager';
import { useSocket } from '@/hooks/use-socket';
import { useAuth } from '@/hooks/use-auth';

/**
 * Hook to check if socket is ready for operations
 * Centralizes the connection check logic
 */
export const useSocketReady = () => {
  const { socket, connected } = useSocket();
  const { user } = useAuth();
  const [status, setStatus] = useState<SocketConnectionStatus>({
    isReady: false,
    isConnected: false,
    hasSocket: false,
    hasUser: false,
    userId: null,
  });

  useEffect(() => {
    // Update user ID in connection manager
    socketConnectionManager.setUserId(user?.id || null);

    // Update status
    const newStatus = socketConnectionManager.isReady();
    setStatus(newStatus);

    if (!newStatus.isReady && newStatus.reason) {
      console.log('⚠️ Socket not ready:', newStatus.reason);
    }
  }, [socket, connected, user?.id]);

  return status;
};

