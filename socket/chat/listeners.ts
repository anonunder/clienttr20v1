import { AppDispatch } from '@/state/store';
import { socketService } from '@/socket/socket-service';
import { CHAT_LISTEN_EVENTS } from './events';
import {
  NewMessagePayload,
  TypingPayload,
  MessageReadPayload,
  UserOnlinePayload,
  UserOfflinePayload,
  GroupNewMessagePayload,
  GroupTypingPayload,
  GroupMemberAddedPayload,
  GroupMemberRemovedPayload,
  GroupUpdatedPayload,
  GroupDeletedPayload,
  SocketEventCallback,
} from './types';

/**
 * Chat Socket Listeners
 * Manages all incoming socket events for chat
 */

class ChatSocketListeners {
  private activeListeners: Map<string, SocketEventCallback> = new Map();
  private dispatch: AppDispatch | null = null;

  /**
   * Initialize listeners with Redux dispatch
   */
  public initialize(dispatch: AppDispatch): void {
    this.dispatch = dispatch;
    console.log('✅ Chat socket listeners initialized');
  }

  /**
   * Register a single listener
   */
  private registerListener<T>(
    event: string,
    callback: SocketEventCallback<T>
  ): void {
    const socket = socketService.getSocket();
    if (!socket) {
      console.warn(`Cannot register listener for ${event}: socket not connected`);
      return;
    }

    // Remove existing listener if any
    if (this.activeListeners.has(event)) {
      socket.off(event, this.activeListeners.get(event));
    }

    // Register new listener
    socket.on(event, callback);
    this.activeListeners.set(event, callback);
  }

  /**
   * Register all chat listeners
   */
  public registerAll(): void {
    if (!this.dispatch) {
      console.error('Dispatch not initialized. Call initialize() first.');
      return;
    }

    // Direct message listeners
    this.registerListener<NewMessagePayload>(
      CHAT_LISTEN_EVENTS.NEW_MESSAGE,
      (payload) => {
        console.log('💬 New message received:', payload.message.content);
        // Dispatch will be handled by Redux slice
        if (this.dispatch) {
          // Import action dynamically to avoid circular dependency
          import('@/features/chat/chat-slice').then(({ addMessage }) => {
            this.dispatch!(addMessage(payload));
          });
        }
      }
    );

    this.registerListener<TypingPayload>(
      CHAT_LISTEN_EVENTS.TYPING,
      (payload) => {
        console.log(`✍️ ${payload.user_name} is ${payload.is_typing ? 'typing' : 'stopped typing'}`);
        if (this.dispatch) {
          import('@/features/chat/chat-slice').then(({ setTyping }) => {
            this.dispatch!(setTyping(payload));
          });
        }
      }
    );

    this.registerListener<MessageReadPayload>(
      CHAT_LISTEN_EVENTS.MESSAGE_READ,
      (payload) => {
        console.log('✓ Messages marked as read:', payload.message_ids);
        if (this.dispatch) {
          import('@/features/chat/chat-slice').then(({ markMessagesAsRead }) => {
            this.dispatch!(markMessagesAsRead(payload));
          });
        }
      }
    );

    // Online status listeners
    this.registerListener<UserOnlinePayload>(
      CHAT_LISTEN_EVENTS.ONLINE,
      (payload) => {
        console.log(`🟢 ${payload.user_name} is online`);
        if (this.dispatch) {
          import('@/features/chat/chat-slice').then(({ setUserOnline }) => {
            this.dispatch!(setUserOnline(payload));
          });
        }
      }
    );

    this.registerListener<UserOfflinePayload>(
      CHAT_LISTEN_EVENTS.OFFLINE,
      (payload) => {
        console.log(`⚫ User ${payload.user_id} is offline`);
        if (this.dispatch) {
          import('@/features/chat/chat-slice').then(({ setUserOffline }) => {
            this.dispatch!(setUserOffline(payload));
          });
        }
      }
    );

    // Group message listeners
    this.registerListener<GroupNewMessagePayload>(
      CHAT_LISTEN_EVENTS.GROUP_NEW_MESSAGE,
      (payload) => {
        console.log(`💬 [Group ${payload.group_id}] New message from ${payload.sender.name}`);
        if (this.dispatch) {
          import('@/features/chat/chat-slice').then(({ addGroupMessage }) => {
            this.dispatch!(addGroupMessage(payload));
          });
        }
      }
    );

    this.registerListener<GroupTypingPayload>(
      CHAT_LISTEN_EVENTS.GROUP_TYPING,
      (payload) => {
        console.log(`✍️ [Group ${payload.group_id}] ${payload.user_name} is typing`);
        if (this.dispatch) {
          import('@/features/chat/chat-slice').then(({ setGroupTyping }) => {
            this.dispatch!(setGroupTyping(payload));
          });
        }
      }
    );

    this.registerListener<GroupMemberAddedPayload>(
      CHAT_LISTEN_EVENTS.GROUP_MEMBER_ADDED,
      (payload) => {
        console.log(`👥 [Group ${payload.group_id}] ${payload.user.name} joined`);
        if (this.dispatch) {
          import('@/features/chat/chat-slice').then(({ addGroupMember }) => {
            this.dispatch!(addGroupMember(payload));
          });
        }
      }
    );

    this.registerListener<GroupMemberRemovedPayload>(
      CHAT_LISTEN_EVENTS.GROUP_MEMBER_REMOVED,
      (payload) => {
        console.log(`👥 [Group ${payload.group_id}] User ${payload.user_id} removed`);
        if (this.dispatch) {
          import('@/features/chat/chat-slice').then(({ removeGroupMember }) => {
            this.dispatch!(removeGroupMember(payload));
          });
        }
      }
    );

    this.registerListener<GroupUpdatedPayload>(
      CHAT_LISTEN_EVENTS.GROUP_UPDATED,
      (payload) => {
        console.log(`🔄 Group ${payload.group.id} updated`);
        if (this.dispatch) {
          import('@/features/chat/chat-slice').then(({ updateGroup }) => {
            this.dispatch!(updateGroup(payload));
          });
        }
      }
    );

    this.registerListener<GroupDeletedPayload>(
      CHAT_LISTEN_EVENTS.GROUP_DELETED,
      (payload) => {
        console.log(`🗑️ Group ${payload.group_id} deleted`);
        if (this.dispatch) {
          import('@/features/chat/chat-slice').then(({ removeGroup }) => {
            this.dispatch!(removeGroup(payload));
          });
        }
      }
    );

    console.log(`✅ Registered ${this.activeListeners.size} chat listeners`);
  }

  /**
   * Unregister all listeners
   */
  public unregisterAll(): void {
    const socket = socketService.getSocket();
    if (!socket) return;

    this.activeListeners.forEach((callback, event) => {
      socket.off(event, callback);
    });

    this.activeListeners.clear();
    console.log('🧹 All chat listeners unregistered');
  }

  /**
   * Get active listeners count
   */
  public getActiveListenersCount(): number {
    return this.activeListeners.size;
  }

  /**
   * Get active listener events
   */
  public getActiveEvents(): string[] {
    return Array.from(this.activeListeners.keys());
  }
}

// Export singleton instance
export const chatListeners = new ChatSocketListeners();

