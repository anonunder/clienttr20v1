import { useEffect, useState, useCallback } from 'react';
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

  // Function to update status
  const updateStatus = useCallback(() => {
    socketConnectionManager.setUserId(user?.id || null);
    const newStatus = socketConnectionManager.isReady();
    setStatus(newStatus);

    if (!newStatus.isReady && newStatus.reason) {
      console.log('⚠️ Socket not ready:', newStatus.reason);
    } else if (newStatus.isReady) {
      console.log('✅ Socket is ready for operations');
    }
  }, [user?.id]);

  useEffect(() => {
    // Initial status update
    updateStatus();

    // Listen for socket connection events to trigger status updates
    if (socket) {
      const handleConnect = () => {
        console.log('🔌 Socket connected event - updating ready status');
        setTimeout(updateStatus, 100); // Small delay to ensure state is updated
      };

      const handleDisconnect = () => {
        console.log('🔌 Socket disconnected event - updating ready status');
        updateStatus();
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
      };
    }
  }, [socket, connected, updateStatus]);

  return status;
};

