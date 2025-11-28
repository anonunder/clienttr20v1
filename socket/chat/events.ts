/**
 * Socket Events for Chat System
 * Based on server-side event definitions
 * 
 * Event Naming Convention:
 * - Client events: company:chat:client:*
 * - Trainer events: company:chat:trainer:*
 * - User events (shared): company:chat:user:*
 * - Group events: company:chat:group:*
 * - Management events: company:chat:manage:*
 * - Admin events: company:chat:admin:*
 */

// ==================== LISTEN EVENTS (from server) ====================
export const CHAT_LISTEN_EVENTS = {
  // Direct messaging - User events (shared between client/trainer)
  NEW_MESSAGE: 'company:chat:user:newMessage',
  TYPING: 'company:chat:user:typing',
  MESSAGE_READ: 'company:chat:user:messageRead',
  ONLINE: 'company:chat:user:online',
  OFFLINE: 'company:chat:user:offline',
  
  // Group messaging
  GROUP_NEW_MESSAGE: 'company:chat:group:newMessage',
  GROUP_TYPING: 'company:chat:group:typing',
  GROUP_MEMBER_ADDED: 'company:chat:group:memberAdded',
  GROUP_MEMBER_REMOVED: 'company:chat:group:memberRemoved',
  GROUP_UPDATED: 'company:chat:group:updated',
  GROUP_DELETED: 'company:chat:group:deleted',
} as const;

// ==================== EMIT EVENTS (to server) ====================

// Client-specific events (for users with 'client' role)
export const CHAT_CLIENT_EMIT_EVENTS = {
  GET_TRAINERS: 'company:chat:client:getTrainers',
  SEND_MESSAGE: 'company:chat:client:sendMessage',
  GET_HISTORY: 'company:chat:client:getHistory',
  GET_CHAT_LIST: 'company:chat:client:getChatList',
  GET_ONLINE_TRAINERS: 'company:chat:client:getOnlineTrainers',
  MARK_READ: 'company:chat:client:markRead',
  TYPING: 'company:chat:client:typing',
} as const;

// Trainer-specific events (for users with 'trainer', 'manager', 'admin' roles)
export const CHAT_TRAINER_EMIT_EVENTS = {
  GET_CLIENTS: 'company:chat:trainer:getClients',
  SEND_MESSAGE: 'company:chat:trainer:sendMessage',
  GET_HISTORY: 'company:chat:trainer:getHistory',
  GET_CHAT_LIST: 'company:chat:trainer:getChatList',
  GET_ONLINE_CLIENTS: 'company:chat:trainer:getOnlineClients',
  MARK_READ: 'company:chat:trainer:markRead',
  TYPING: 'company:chat:trainer:typing',
  GET_ALL_USERS: 'company:chat:trainer:getAllUsers',
} as const;

// Group events (available to all users)
export const CHAT_GROUP_EMIT_EVENTS = {
  GET_LIST: 'company:chat:group:getList',
  SEND_MESSAGE: 'company:chat:group:sendMessage',
  GET_HISTORY: 'company:chat:group:getHistory',
  GET_INFO: 'company:chat:group:getInfo',
  GET_MEMBERS: 'company:chat:group:getMembers',
  TYPING: 'company:chat:group:typing',
} as const;

// Group management events (trainer-level only)
export const CHAT_MANAGE_EMIT_EVENTS = {
  CREATE_GROUP: 'company:chat:manage:createGroup',
  EDIT_GROUP: 'company:chat:manage:editGroup',
  DELETE_GROUP: 'company:chat:manage:deleteGroup',
  ADD_MEMBER: 'company:chat:manage:addMember',
  REMOVE_MEMBER: 'company:chat:manage:removeMember',
  UPDATE_ROLE: 'company:chat:manage:updateRole',
} as const;

// Search events
export const CHAT_SEARCH_EMIT_EVENTS = {
  MESSAGES: 'company:chat:search:messages',
} as const;

// Admin events
export const CHAT_ADMIN_EMIT_EVENTS = {
  GET_STATS: 'company:chat:admin:getStats',
  GET_RETENTION_SETTINGS: 'company:chat:admin:getRetentionSettings',
  UPDATE_RETENTION_SETTINGS: 'company:chat:admin:updateRetentionSettings',
  RUN_CLEANUP: 'company:chat:admin:runCleanup',
  GET_CLEANUP_STATUS: 'company:chat:admin:getCleanupStatus',
} as const;

// Room management events (manual room operations)
export const CHAT_ROOM_EMIT_EVENTS = {
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',
  TEST_MEMBERSHIP: 'test:room:membership',
  SYNC_MEMBERSHIP: 'sync:group:membership',
} as const;

// Export types
export type ChatListenEvent = typeof CHAT_LISTEN_EVENTS[keyof typeof CHAT_LISTEN_EVENTS];
export type ChatClientEmitEvent = typeof CHAT_CLIENT_EMIT_EVENTS[keyof typeof CHAT_CLIENT_EMIT_EVENTS];
export type ChatTrainerEmitEvent = typeof CHAT_TRAINER_EMIT_EVENTS[keyof typeof CHAT_TRAINER_EMIT_EVENTS];
export type ChatGroupEmitEvent = typeof CHAT_GROUP_EMIT_EVENTS[keyof typeof CHAT_GROUP_EMIT_EVENTS];
export type ChatManageEmitEvent = typeof CHAT_MANAGE_EMIT_EVENTS[keyof typeof CHAT_MANAGE_EMIT_EVENTS];

