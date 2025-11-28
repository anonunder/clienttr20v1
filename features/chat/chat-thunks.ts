import { createAsyncThunk } from '@reduxjs/toolkit';
import { chatEmitters } from '@/socket/chat';
import {
  setChats,
  setContacts,
  setGroups,
  setMessages,
  setLoading,
  setError,
  addMessage,
  addGroupMessage,
} from './chat-slice';
import {
  GetTrainersPayload,
  SendMessagePayload,
  GetHistoryPayload,
  GetChatListPayload,
  MarkReadPayload,
  SendGroupMessagePayload,
  GroupInfoPayload,
  CreateGroupPayload,
  EditGroupPayload,
  DeleteGroupPayload,
  AddMemberPayload,
  RemoveMemberPayload,
  UpdateRolePayload,
  SearchMessagesPayload,
} from '@/socket/chat/types';

/**
 * Chat Async Thunks
 * Async operations for chat using Redux Toolkit
 */

// ==================== CONTACTS ====================

export const fetchContacts = createAsyncThunk(
  'chat/fetchContacts',
  async (payload: GetTrainersPayload = {}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await chatEmitters.getContacts(payload);
      
      if (response.success) {
        const contacts = (response as any).trainers || (response as any).clients || [];
        dispatch(setContacts(contacts));
        return contacts;
      } else {
        throw new Error(response.error || 'Failed to fetch contacts');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// ==================== CHATS ====================

export const fetchChatList = createAsyncThunk(
  'chat/fetchChatList',
  async (payload: GetChatListPayload = {}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await chatEmitters.getChatList(payload);
      
      if (response.success) {
        const chats = (response as any).chats || [];
        dispatch(setChats(chats));
        return chats;
      } else {
        throw new Error(response.error || 'Failed to fetch chat list');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// ==================== MESSAGES ====================

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async (
    { chatId, isGroup, options }: { chatId: string; isGroup: boolean; options?: Partial<GetHistoryPayload> },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));
      
      let response;
      if (isGroup) {
        response = await chatEmitters.getGroupHistory(chatId, options);
      } else {
        // Auto-detect if we need trainer or client history
        response = await chatEmitters.getContacts({ limit: 1 }); // Check role first
        // Then fetch appropriate history based on role
        // This is a simplified version - in production you'd store the role
        response = await chatEmitters.getTrainerHistory(chatId, options);
      }
      
      if (response.success) {
        const messages = (response as any).messages || [];
        dispatch(setMessages({ chatId, messages }));
        return messages;
      } else {
        throw new Error(response.error || 'Failed to fetch chat history');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (payload: SendMessagePayload, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await chatEmitters.sendMessage(payload);
      
      if (response.success) {
        const message = (response as any).message;
        console.log('📤 Message sent successfully:', message);
        
        // Ensure created_at is set (use server's or current time)
        if (!message.created_at) {
          message.created_at = new Date().toISOString();
        }
        
        // Optimistically add message to UI immediately
        const state = getState() as any;
        const currentUser = state.auth.user;
        
        console.log('➕ Adding message to Redux state:', {
          messageId: message.id,
          recipientId: message.recipient_id,
          senderId: message.sender_id,
          content: message.content,
        });
        
        dispatch(addMessage({
          message: message,
          sender: {
            id: currentUser?.id || message.sender_id,
            name: currentUser?.name || 'You',
            email: currentUser?.email || '',
            role: 'client',
          }
        }));
        
        return message;
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('❌ Failed to send message:', error);
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'chat/markMessagesAsRead',
  async (payload: MarkReadPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatEmitters.markRead(payload);
      
      if (response.success) {
        return true;
      } else {
        throw new Error(response.error || 'Failed to mark as read');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

// ==================== GROUPS ====================

export const fetchGroups = createAsyncThunk(
  'chat/fetchGroups',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await chatEmitters.getGroups();
      
      if (response.success) {
        const groups = (response as any).groups || [];
        dispatch(setGroups(groups));
        return groups;
      } else {
        throw new Error(response.error || 'Failed to fetch groups');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const sendGroupMessage = createAsyncThunk(
  'chat/sendGroupMessage',
  async (payload: SendGroupMessagePayload, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await chatEmitters.sendGroupMessage(payload);
      
      if (response.success) {
        const message = (response as any).message;
        
        // Optimistically add message to UI immediately
        const state = getState() as any;
        const currentUser = state.auth.user;
        
        dispatch(addGroupMessage({
          message: message,
          group_id: payload.group_id,
          sender: {
            id: currentUser?.id || message.sender_id,
            name: currentUser?.name || 'You',
            email: currentUser?.email || '',
            role: 'client',
          }
        }));
        
        return message;
      } else {
        throw new Error(response.error || 'Failed to send group message');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGroupInfo = createAsyncThunk(
  'chat/fetchGroupInfo',
  async (payload: GroupInfoPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatEmitters.getGroupInfo(payload);
      
      if (response.success) {
        return (response as any).group;
      } else {
        throw new Error(response.error || 'Failed to fetch group info');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGroupMembers = createAsyncThunk(
  'chat/fetchGroupMembers',
  async (payload: GroupInfoPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatEmitters.getGroupMembers(payload);
      
      if (response.success) {
        return (response as any).members;
      } else {
        throw new Error(response.error || 'Failed to fetch group members');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

// ==================== GROUP MANAGEMENT ====================

export const createGroup = createAsyncThunk(
  'chat/createGroup',
  async (payload: CreateGroupPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatEmitters.createGroup(payload);
      
      if (response.success) {
        const group = (response as any).group;
        return group;
      } else {
        throw new Error(response.error || 'Failed to create group');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const editGroup = createAsyncThunk(
  'chat/editGroup',
  async (payload: EditGroupPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatEmitters.editGroup(payload);
      
      if (response.success) {
        const group = (response as any).group;
        return group;
      } else {
        throw new Error(response.error || 'Failed to edit group');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteGroup = createAsyncThunk(
  'chat/deleteGroup',
  async (payload: DeleteGroupPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatEmitters.deleteGroup(payload);
      
      if (response.success) {
        return payload.group_id;
      } else {
        throw new Error(response.error || 'Failed to delete group');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const addGroupMember = createAsyncThunk(
  'chat/addGroupMember',
  async (payload: AddMemberPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatEmitters.addMember(payload);
      
      if (response.success) {
        return payload;
      } else {
        throw new Error(response.error || 'Failed to add member');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const removeGroupMember = createAsyncThunk(
  'chat/removeGroupMember',
  async (payload: RemoveMemberPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatEmitters.removeMember(payload);
      
      if (response.success) {
        return payload;
      } else {
        throw new Error(response.error || 'Failed to remove member');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  'chat/updateMemberRole',
  async (payload: UpdateRolePayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatEmitters.updateMemberRole(payload);
      
      if (response.success) {
        return payload;
      } else {
        throw new Error(response.error || 'Failed to update role');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

// ==================== SEARCH ====================

export const searchMessages = createAsyncThunk(
  'chat/searchMessages',
  async (payload: SearchMessagesPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatEmitters.searchMessages(payload);
      
      if (response.success) {
        return (response as any).messages || [];
      } else {
        throw new Error(response.error || 'Failed to search messages');
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

