import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Chat,
  ChatMessage,
  ChatContact,
  ChatGroup,
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
} from '@/socket/chat/types';

/**
 * Chat Redux Slice
 * Manages chat state including messages, contacts, groups, and typing indicators
 */

interface TypingState {
  [userId: string]: {
    isTyping: boolean;
    userName: string;
  };
}

interface GroupTypingState {
  [groupId: string]: {
    [userId: string]: {
      isTyping: boolean;
      userName: string;
    };
  };
}

interface ChatState {
  // Chats/Conversations list
  chats: Chat[];
  
  // Contacts (trainers or clients depending on role)
  contacts: ChatContact[];
  
  // Groups
  groups: ChatGroup[];
  
  // Messages by chat ID (user ID or group ID)
  messagesByChat: {
    [chatId: string]: ChatMessage[];
  };
  
  // Active chat
  activeChatId: string | null;
  activeChatType: 'direct' | 'group' | null;
  
  // Typing indicators
  typing: TypingState;
  groupTyping: GroupTypingState;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Online users
  onlineUsers: Set<string>;
}

const initialState: ChatState = {
  chats: [],
  contacts: [],
  groups: [],
  messagesByChat: {},
  activeChatId: null,
  activeChatType: null,
  typing: {},
  groupTyping: {},
  loading: false,
  error: null,
  onlineUsers: new Set(),
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ==================== CHAT LIST ====================
    
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    
    addOrUpdateChat: (state, action: PayloadAction<Chat>) => {
      const index = state.chats.findIndex(c => c.id === action.payload.id);
      if (index >= 0) {
        state.chats[index] = action.payload;
      } else {
        state.chats.unshift(action.payload);
      }
      
      // Sort by updated_at
      state.chats.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    },
    
    // ==================== CONTACTS ====================
    
    setContacts: (state, action: PayloadAction<ChatContact[]>) => {
      state.contacts = action.payload;
    },
    
    updateContactOnlineStatus: (state, action: PayloadAction<{ userId: string; isOnline: boolean }>) => {
      const contact = state.contacts.find(c => c.id === action.payload.userId);
      if (contact) {
        contact.is_online = action.payload.isOnline;
      }
    },
    
    // ==================== GROUPS ====================
    
    setGroups: (state, action: PayloadAction<ChatGroup[]>) => {
      state.groups = action.payload;
    },
    
    addGroup: (state, action: PayloadAction<ChatGroup>) => {
      state.groups.unshift(action.payload);
    },
    
    updateGroup: (state, action: PayloadAction<GroupUpdatedPayload>) => {
      const index = state.groups.findIndex(g => g.id === action.payload.group.id);
      if (index >= 0) {
        state.groups[index] = action.payload.group;
      }
    },
    
    removeGroup: (state, action: PayloadAction<GroupDeletedPayload>) => {
      state.groups = state.groups.filter(g => g.id !== action.payload.group_id);
      delete state.messagesByChat[action.payload.group_id];
      delete state.groupTyping[action.payload.group_id];
      
      // Clear active chat if it's the deleted group
      if (state.activeChatId === action.payload.group_id) {
        state.activeChatId = null;
        state.activeChatType = null;
      }
    },
    
    addGroupMember: (state, action: PayloadAction<GroupMemberAddedPayload>) => {
      const group = state.groups.find(g => g.id === action.payload.group_id);
      if (group) {
        group.member_count += 1;
      }
    },
    
    removeGroupMember: (state, action: PayloadAction<GroupMemberRemovedPayload>) => {
      const group = state.groups.find(g => g.id === action.payload.group_id);
      if (group) {
        group.member_count -= 1;
      }
    },
    
    // ==================== MESSAGES ====================
    
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: ChatMessage[] }>) => {
      state.messagesByChat[action.payload.chatId] = action.payload.messages;
    },
    
    addMessage: (state, action: PayloadAction<NewMessagePayload>) => {
      const message = action.payload.message;
      const currentUserId = action.payload.sender?.id;
      
      console.log('🔵 addMessage reducer called:', {
        messageId: message.id,
        senderId: message.sender_id,
        recipientId: message.recipient_id,
        content: message.content,
        currentUserId,
        activeChatId: state.activeChatId,
      });
      
      // Determine chatId: use the OTHER party's ID (not current user's ID)
      // If current user sent the message, use recipient_id as chatId
      // If current user received the message, use sender_id as chatId
      let chatId: string;
      if (message.sender_id === currentUserId) {
        // This is a sent message, use recipient as chatId
        chatId = message.recipient_id || state.activeChatId || message.sender_id;
      } else {
        // This is a received message, use sender as chatId
        chatId = message.sender_id;
      }
      
      console.log('💬 Chat ID determined:', chatId, {
        reason: message.sender_id === currentUserId ? 'sent message' : 'received message',
        hasRecipientId: !!message.recipient_id,
      });
      
      // Safety check: if chatId is still invalid, skip this message
      if (!chatId) {
        console.error('❌ Could not determine chatId for message:', message.id);
        return;
      }
      
      if (!state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = [];
        console.log('📝 Created new message array for chat:', chatId);
      }
      
      // Avoid duplicates
      const exists = state.messagesByChat[chatId].some(m => m.id === message.id);
      if (!exists) {
        state.messagesByChat[chatId].push(message);
        console.log('✅ Message added to chat:', chatId, 'Total messages:', state.messagesByChat[chatId].length);
      } else {
        console.log('⚠️ Message already exists, skipping:', message.id);
      }
      
      // Update unread count for the chat if message is from someone else
      const chat = state.chats.find(c => c.id === chatId);
      if (chat && message.sender_id !== currentUserId) {
        chat.unread_count += 1;
        chat.last_message = message;
        chat.updated_at = message.created_at;
      }
    },
    
    addGroupMessage: (state, action: PayloadAction<GroupNewMessagePayload>) => {
      const message = action.payload.message;
      const groupId = action.payload.group_id;
      const currentUserId = action.payload.sender?.id;
      
      console.log('🔵 addGroupMessage reducer called:', {
        messageId: message.id,
        groupId,
        senderId: message.sender_id,
        content: message.content,
        currentUserId,
      });
      
      if (!state.messagesByChat[groupId]) {
        state.messagesByChat[groupId] = [];
        console.log('📝 Created new message array for group:', groupId);
      }
      
      // Avoid duplicates
      const exists = state.messagesByChat[groupId].some(m => m.id === message.id);
      if (!exists) {
        state.messagesByChat[groupId].push(message);
        console.log('✅ Group message added:', groupId, 'Total messages:', state.messagesByChat[groupId].length);
      } else {
        console.log('⚠️ Group message already exists, skipping:', message.id);
      }
      
      // Update group last message and unread count (only if from someone else)
      const group = state.groups.find(g => g.id === groupId);
      if (group) {
        group.last_message = message;
        // Only increment unread if message is from someone else
        if (message.sender_id !== currentUserId) {
          group.unread_count += 1;
        }
      }
    },
    
    markMessagesAsRead: (state, action: PayloadAction<MessageReadPayload>) => {
      // Mark messages as read in all chats
      Object.values(state.messagesByChat).forEach(messages => {
        messages.forEach(message => {
          if (action.payload.message_ids.includes(message.id)) {
            message.read_at = new Date().toISOString();
          }
        });
      });
      
      // Clear unread count for the active chat
      if (state.activeChatId) {
        const chat = state.chats.find(c => c.id === state.activeChatId);
        if (chat) {
          chat.unread_count = 0;
        }
        
        const group = state.groups.find(g => g.id === state.activeChatId);
        if (group) {
          group.unread_count = 0;
        }
      }
    },
    
    // ==================== ACTIVE CHAT ====================
    
    setActiveChat: (state, action: PayloadAction<{ chatId: string; type: 'direct' | 'group' }>) => {
      state.activeChatId = action.payload.chatId;
      state.activeChatType = action.payload.type;
    },
    
    clearActiveChat: (state) => {
      state.activeChatId = null;
      state.activeChatType = null;
    },
    
    // ==================== TYPING INDICATORS ====================
    
    setTyping: (state, action: PayloadAction<TypingPayload>) => {
      if (action.payload.is_typing) {
        state.typing[action.payload.user_id] = {
          isTyping: true,
          userName: action.payload.user_name,
        };
      } else {
        delete state.typing[action.payload.user_id];
      }
    },
    
    setGroupTyping: (state, action: PayloadAction<GroupTypingPayload>) => {
      const { group_id, user_id, user_name, is_typing } = action.payload;
      
      if (!state.groupTyping[group_id]) {
        state.groupTyping[group_id] = {};
      }
      
      if (is_typing) {
        state.groupTyping[group_id][user_id] = {
          isTyping: true,
          userName: user_name,
        };
      } else {
        delete state.groupTyping[group_id][user_id];
      }
    },
    
    // ==================== ONLINE STATUS ====================
    
    setUserOnline: (state, action: PayloadAction<UserOnlinePayload>) => {
      state.onlineUsers.add(action.payload.user_id);
      // Update contact status
      const contact = state.contacts.find(c => c.id === action.payload.user_id);
      if (contact) {
        contact.is_online = true;
      }
    },
    
    setUserOffline: (state, action: PayloadAction<UserOfflinePayload>) => {
      state.onlineUsers.delete(action.payload.user_id);
      // Update contact status
      const contact = state.contacts.find(c => c.id === action.payload.user_id);
      if (contact) {
        contact.is_online = false;
      }
    },
    
    // ==================== UI STATE ====================
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // ==================== RESET ====================
    
    resetChat: () => initialState,
  },
});

export const {
  setChats,
  addOrUpdateChat,
  setContacts,
  updateContactOnlineStatus,
  setGroups,
  addGroup,
  updateGroup,
  removeGroup,
  addGroupMember,
  removeGroupMember,
  setMessages,
  addMessage,
  addGroupMessage,
  markMessagesAsRead,
  setActiveChat,
  clearActiveChat,
  setTyping,
  setGroupTyping,
  setUserOnline,
  setUserOffline,
  setLoading,
  setError,
  clearError,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;

