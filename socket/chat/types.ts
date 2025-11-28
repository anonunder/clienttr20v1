/**
 * Type definitions for Chat Socket Events
 * Based on server-side chat system
 */

// ==================== USER & CONTACT TYPES ====================

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'client' | 'trainer' | 'manager' | 'admin';
  is_online?: boolean;
  last_seen?: string;
}

export interface ChatContact extends ChatUser {
  last_message?: ChatMessage;
  unread_count: number;
}

// ==================== MESSAGE TYPES ====================

export type MessageType = 'text' | 'image' | 'video' | 'file' | 'system';

export interface MessageMetadata {
  url?: string;
  filename?: string;
  mimetype?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail?: string;
  action?: string;
  details?: any;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id?: string;
  group_id?: string;
  type: MessageType;
  content: string;
  metadata?: MessageMetadata;
  reply_to?: string;
  created_at: string;
  read_at?: string | null;
  sender?: ChatUser;
}

// ==================== GROUP TYPES ====================

export type GroupRole = 'owner' | 'admin' | 'member';

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  member_count: number;
  unread_count: number;
  last_message?: ChatMessage;
  my_role: GroupRole;
  created_at?: string;
  updated_at?: string;
}

export interface GroupMember extends ChatUser {
  role: GroupRole;
  joined_at: string;
}

// ==================== CHAT/CONVERSATION TYPES ====================

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  participant?: ChatContact;
  group?: ChatGroup;
  last_message?: ChatMessage;
  unread_count: number;
  updated_at: string;
}

// ==================== LISTEN EVENT PAYLOADS ====================

export interface NewMessagePayload {
  message: ChatMessage;
  sender: ChatUser;
}

export interface TypingPayload {
  user_id: string;
  user_name: string;
  is_typing: boolean;
}

export interface MessageReadPayload {
  message_ids: string[];
  reader_id: string;
}

export interface UserOnlinePayload {
  user_id: string;
  user_name: string;
}

export interface UserOfflinePayload {
  user_id: string;
}

export interface GroupNewMessagePayload {
  message: ChatMessage;
  group_id: string;
  sender: ChatUser;
}

export interface GroupTypingPayload {
  group_id: string;
  user_id: string;
  user_name: string;
  is_typing: boolean;
}

export interface GroupMemberAddedPayload {
  group_id: string;
  user: ChatUser;
}

export interface GroupMemberRemovedPayload {
  group_id: string;
  user_id: string;
}

export interface GroupUpdatedPayload {
  group: ChatGroup;
}

export interface GroupDeletedPayload {
  group_id: string;
}

// ==================== EMIT EVENT PAYLOADS ====================

// Client emit payloads
export interface GetTrainersPayload {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface SendMessagePayload {
  recipient_id: string;
  type: MessageType;
  content: string;
  reply_to?: string;
  metadata?: MessageMetadata;
}

export interface GetHistoryPayload {
  trainer_id?: string;
  client_id?: string;
  group_id?: string;
  limit?: number;
  before_message_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface GetChatListPayload {
  limit?: number;
  offset?: number;
}

export interface MarkReadPayload {
  trainer_id?: string;
  client_id?: string;
  message_ids?: string[];
}

export interface TypingEmitPayload {
  trainer_id?: string;
  client_id?: string;
  group_id?: string;
  is_typing: boolean;
}

// Group emit payloads
export interface SendGroupMessagePayload {
  group_id: string;
  type: MessageType;
  content: string;
  reply_to?: string;
  metadata?: MessageMetadata;
}

export interface GroupInfoPayload {
  group_id: string;
}

// Group management payloads
export interface CreateGroupPayload {
  name: string;
  description?: string;
  avatar?: string;
  member_ids: string[];
}

export interface EditGroupPayload {
  group_id: string;
  name?: string;
  description?: string;
  avatar?: string;
}

export interface DeleteGroupPayload {
  group_id: string;
}

export interface AddMemberPayload {
  group_id: string;
  user_id: string;
  role?: 'admin' | 'member';
}

export interface RemoveMemberPayload {
  group_id: string;
  user_id: string;
}

export interface UpdateRolePayload {
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
}

// Search payloads
export interface SearchMessagesPayload {
  query: string;
  chat_type: 'user' | 'group';
  chat_id: string;
  limit?: number;
  offset?: number;
}

// ==================== RESPONSE TYPES ====================

export interface SocketResponse<T = any> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

export interface GetTrainersResponse extends SocketResponse {
  trainers: ChatContact[];
  total: number;
  limit: number;
  offset: number;
}

export interface GetClientsResponse extends SocketResponse {
  clients: ChatContact[];
  total: number;
  limit: number;
  offset: number;
}

export interface SendMessageResponse extends SocketResponse {
  message: ChatMessage;
}

export interface GetHistoryResponse extends SocketResponse {
  messages: ChatMessage[];
  has_more: boolean;
  total?: number;
}

export interface GetChatListResponse extends SocketResponse {
  chats: Chat[];
  total: number;
}

export interface GetGroupListResponse extends SocketResponse {
  groups: ChatGroup[];
}

export interface GetGroupInfoResponse extends SocketResponse {
  group: ChatGroup;
}

export interface GetGroupMembersResponse extends SocketResponse {
  members: GroupMember[];
}

export interface CreateGroupResponse extends SocketResponse {
  group: ChatGroup;
}

// ==================== CALLBACK TYPES ====================

export type SocketEventCallback<T = any> = (payload: T) => void;

export type SocketAckCallback<T = any> = (response: SocketResponse<T>) => void;

// ==================== EMIT QUEUE TYPES ====================

export interface SocketEmitQueueItem {
  event: string;
  payload: any;
  callback?: SocketAckCallback;
  timestamp: number;
  id: string;
  retries: number;
  maxRetries: number;
}

