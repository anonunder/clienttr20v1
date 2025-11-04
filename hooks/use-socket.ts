import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { socketService } from '@/socket/socket-service';
import { RootState } from '@/state/store';
import { getTokenSecure } from '@/services/auth/auth-storage';

/**
 * Hook for Socket.IO Connection
 * Manages socket connection lifecycle
 */
export const useSocket = () => {
  const [socket, setSocket] = useState(socketService.getSocket());
  const [connected, setConnected] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const initSocket = async () => {
      // Only connect if authenticated
      if (!isAuthenticated) {
        // Disconnect if not authenticated
        if (socket?.connected) {
          socketService.disconnect();
          setSocket(null);
          setConnected(false);
        }
        return;
      }

      try {
        // Get token from secure storage (more reliable than Redux state)
        const authToken = token || await getTokenSecure();
        
        if (!authToken) {
          console.warn('Socket: No token available, cannot connect');
          // Disconnect if connected without token
          if (socket?.connected) {
            socketService.disconnect();
            setSocket(null);
            setConnected(false);
          }
          return;
        }

        // If socket exists but is connected without proper auth, disconnect first
        const currentSocket = socketService.getSocket();
        if (currentSocket?.connected && (!currentSocket.auth || !currentSocket.auth.token)) {
          console.log('Socket: Reconnecting with token...');
          socketService.disconnect();
        }

        const socketInstance = await socketService.connect(undefined, authToken);
        setSocket(socketInstance);

        // Only set up listeners if not already set up
        if (!socketInstance.listeners('connect').length) {
          socketInstance.on('connect', () => {
            console.log('✅ Socket connected successfully');
            setConnected(true);
          });
          
          socketInstance.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setConnected(false);
          });

          socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setConnected(false);
          });
        }
      } catch (error) {
        console.error('Failed to initialize socket:', error);
        setConnected(false);
      }
    };

    initSocket();

    return () => {
      // Don't disconnect on unmount, let the app manage socket lifecycle
      setConnected(false);
    };
  }, [isAuthenticated, token]);

  return {
    socket,
    connected,
    emit: socketService.emit.bind(socketService),
  };
};
