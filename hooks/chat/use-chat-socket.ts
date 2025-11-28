import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { useSocketReady } from '@/hooks/use-socket-ready';
import { useAuth } from '@/hooks/use-auth';
import {
  chatEmitters,
  chatListeners,
  SendMessagePayload,
  SendGroupMessagePayload,
  TypingEmitPayload,
  MarkReadPayload,
} from '@/socket/chat';

/**
 * Hook for Chat Socket Operations
 * Manages socket listeners and emitters for chat
 * 
 * Usage:
 * ```tsx
 * const {
 *   isReady,
 *   connected,
 *   sendMessage,
 *   sendGroupMessage,
 *   sendTyping,
 *   markAsRead
 * } = useChatSocket();
 * ```
 */
export const useChatSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socketStatus = useSocketReady();
  const { user } = useAuth();
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);
  const [listenersRegistered, setListenersRegistered] = useState(false);

  // Initialize and register listeners when socket is ready
  useEffect(() => {
    if (!socketStatus.isReady) {
      setListenersRegistered(false);
      return;
    }

    console.log('🔌 Initializing chat socket...');

    // Set user role for chat emitters
    if (user?.relationships && selectedCompanyId) {
      const relationship = user.relationships.find(
        (rel) => rel.company_id === selectedCompanyId
      );
      if (relationship?.role) {
        chatEmitters.setUserRole(relationship.role as any);
      }
    }

    // Initialize listeners with dispatch
    chatListeners.initialize(dispatch);

    // Register all chat listeners
    chatListeners.registerAll();
    setListenersRegistered(true);

    console.log('✅ Chat socket initialized successfully');

    // Cleanup on unmount
    return () => {
      console.log('🔌 Cleaning up chat socket...');
      chatListeners.unregisterAll();
      setListenersRegistered(false);
    };
  }, [socketStatus.isReady, socketStatus.userId, user?.relationships, selectedCompanyId, dispatch]);

  // ==================== MESSAGE METHODS ====================

  /**
   * Send a direct message (client → trainer or trainer → client)
   */
  const sendMessage = useCallback(
    async (payload: SendMessagePayload) => {
      if (!socketStatus.isReady) {
        console.warn('Cannot send message: socket not ready');
        throw new Error('Socket not ready');
      }
      return chatEmitters.sendMessage(payload);
    },
    [socketStatus.isReady]
  );

  /**
   * Send a group message
   */
  const sendGroupMessage = useCallback(
    async (payload: SendGroupMessagePayload) => {
      if (!socketStatus.isReady) {
        console.warn('Cannot send group message: socket not ready');
        throw new Error('Socket not ready');
      }
      return chatEmitters.sendGroupMessage(payload);
    },
    [socketStatus.isReady]
  );

  /**
   * Mark messages as read
   */
  const markAsRead = useCallback(
    async (payload: MarkReadPayload) => {
      if (!socketStatus.isReady) {
        console.warn('Cannot mark as read: socket not ready');
        return;
      }
      return chatEmitters.markRead(payload);
    },
    [socketStatus.isReady]
  );

  // ==================== TYPING INDICATORS ====================

  /**
   * Send typing indicator (direct chat)
   */
  const sendTyping = useCallback(
    (payload: TypingEmitPayload) => {
      if (!socketStatus.isReady) {
        return;
      }
      chatEmitters.sendTyping(payload);
    },
    [socketStatus.isReady]
  );

  /**
   * Send typing indicator (group chat)
   */
  const sendGroupTyping = useCallback(
    (payload: TypingEmitPayload) => {
      if (!socketStatus.isReady) {
        return;
      }
      chatEmitters.sendGroupTyping(payload);
    },
    [socketStatus.isReady]
  );

  // ==================== UTILITY METHODS ====================

  /**
   * Get emit queue status
   */
  const getEmitQueueStatus = useCallback(() => {
    return chatEmitters.getQueueStatus();
  }, []);

  /**
   * Clear emit queue
   */
  const clearEmitQueue = useCallback(() => {
    chatEmitters.clearQueue();
  }, []);

  /**
   * Get active listeners count
   */
  const getListenersCount = useCallback(() => {
    return chatListeners.getActiveListenersCount();
  }, []);

  /**
   * Get active listener events
   */
  const getActiveEvents = useCallback(() => {
    return chatListeners.getActiveEvents();
  }, []);

  // ==================== RETURN ====================

  return {
    // Connection status
    isReady: socketStatus.isReady,
    isConnected: socketStatus.isConnected,
    hasSocket: socketStatus.hasSocket,
    hasUser: socketStatus.hasUser,
    userId: socketStatus.userId,
    reason: socketStatus.reason,
    listenersRegistered,
    listenersCount: listenersRegistered ? chatListeners.getActiveListenersCount() : 0,

    // Message methods
    sendMessage,
    sendGroupMessage,
    markAsRead,

    // Typing methods
    sendTyping,
    sendGroupTyping,

    // Utility methods
    getEmitQueueStatus,
    clearEmitQueue,
    getListenersCount,
    getActiveEvents,

    // Direct access to emitters (for advanced usage)
    emitters: chatEmitters,
  };
};

