import { useState, useEffect } from 'react';
import { socketService } from '@/socket/socket-service';

/**
 * Hook for Socket.IO Connection
 * Manages socket connection lifecycle
 */
export const useSocket = () => {
  const [socket, setSocket] = useState(socketService.getSocket());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const initSocket = async () => {
      try {
        const socketInstance = await socketService.connect();
        setSocket(socketInstance);

        socketInstance.on('connect', () => setConnected(true));
        socketInstance.on('disconnect', () => setConnected(false));
      } catch (error) {
        console.error('Failed to initialize socket:', error);
      }
    };

    initSocket();

    return () => {
      // Don't disconnect on unmount, let the app manage socket lifecycle
      setConnected(false);
    };
  }, []);

  return {
    socket,
    connected,
    emit: socketService.emit.bind(socketService),
  };
};
