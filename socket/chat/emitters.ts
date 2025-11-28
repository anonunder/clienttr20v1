import { socketService } from '@/socket/socket-service';
import {
  CHAT_CLIENT_EMIT_EVENTS,
  CHAT_TRAINER_EMIT_EVENTS,
  CHAT_GROUP_EMIT_EVENTS,
  CHAT_MANAGE_EMIT_EVENTS,
  CHAT_ROOM_EMIT_EVENTS,
  CHAT_SEARCH_EMIT_EVENTS,
} from './events';
import {
  GetTrainersPayload,
  SendMessagePayload,
  GetHistoryPayload,
  GetChatListPayload,
  MarkReadPayload,
  TypingEmitPayload,
  SendGroupMessagePayload,
  GroupInfoPayload,
  CreateGroupPayload,
  EditGroupPayload,
  DeleteGroupPayload,
  AddMemberPayload,
  RemoveMemberPayload,
  UpdateRolePayload,
  SearchMessagesPayload,
  SocketEmitQueueItem,
  SocketAckCallback,
  SocketResponse,
} from './types';

/**
 * Chat Socket Emitters
 * Handles all outgoing socket events with queue management
 */

class ChatSocketEmitters {
  private emitQueue: Map<string, SocketEmitQueueItem> = new Map();
  private processingQueue: boolean = false;
  private userRole: 'client' | 'trainer' | 'manager' | 'admin' | null = null;

  /**
   * Set user role to determine which events to use
   */
  public setUserRole(role: 'client' | 'trainer' | 'manager' | 'admin' | null): void {
    this.userRole = role;
    console.log('👤 Chat user role set:', role);
  }

  /**
   * Check if user is trainer-level (can use trainer events)
   */
  private isTrainerLevel(): boolean {
    return ['trainer', 'manager', 'admin'].includes(this.userRole || '');
  }

  /**
   * Generate unique ID for emit queue items
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add emit to queue
   */
  private addToQueue(
    event: string,
    payload: any,
    callback?: SocketAckCallback,
    maxRetries: number = 3
  ): string {
    const id = this.generateId();
    const queueItem: SocketEmitQueueItem = {
      event,
      payload,
      callback,
      timestamp: Date.now(),
      id,
      retries: 0,
      maxRetries,
    };

    this.emitQueue.set(id, queueItem);
    console.log(`📤 Added to emit queue: ${event}`, { id, queueSize: this.emitQueue.size });

    // Auto-process queue
    this.processQueue();

    return id;
  }

  /**
   * Process emit queue
   */
  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.emitQueue.size === 0) {
      return;
    }

    this.processingQueue = true;

    const socket = socketService.getSocket();
    if (!socket?.connected) {
      console.warn('Socket not connected, queue will retry later');
      this.processingQueue = false;
      return;
    }

    for (const [id, item] of this.emitQueue.entries()) {
      try {
        // Emit the event with callback
        socket.emit(item.event, item.payload, (response: SocketResponse) => {
          if (item.callback) {
            item.callback(response);
          }

          if (response?.success) {
            console.log(`✅ Emit successful: ${item.event}`, { id });
            this.emitQueue.delete(id);
          } else {
            console.warn(`⚠️ Emit failed: ${item.event}`, { id, error: response?.error });
            this.retryEmit(id);
          }
        });

        // If no callback, remove from queue immediately
        if (!item.callback) {
          this.emitQueue.delete(id);
        }
      } catch (error) {
        console.error(`❌ Emit error: ${item.event}`, { id, error });
        this.retryEmit(id);
      }
    }

    this.processingQueue = false;
  }

  /**
   * Retry failed emit
   */
  private retryEmit(id: string): void {
    const item = this.emitQueue.get(id);
    if (!item) return;

    item.retries++;

    if (item.retries >= item.maxRetries) {
      console.error(`❌ Max retries reached for emit: ${item.event}`, { id });
      this.emitQueue.delete(id);
    } else {
      console.log(`🔄 Retrying emit: ${item.event}`, { id, retry: item.retries });
      this.emitQueue.set(id, item);

      // Retry after delay
      setTimeout(() => this.processQueue(), 1000 * item.retries);
    }
  }

  /**
   * Emit with promise wrapper
   */
  private emitAsync<T = any>(event: string, payload: any): Promise<SocketResponse<T>> {
    return new Promise((resolve, reject) => {
      const socket = socketService.getSocket();
      if (!socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      socket.emit(event, payload, (response: SocketResponse<T>) => {
        if (response?.success) {
          resolve(response);
        } else {
          reject(new Error(response?.error || response?.message || 'Unknown error'));
        }
      });
    });
  }

  /**
   * Get queue status
   */
  public getQueueStatus() {
    return {
      size: this.emitQueue.size,
      items: Array.from(this.emitQueue.values()),
      processing: this.processingQueue,
    };
  }

  /**
   * Clear queue
   */
  public clearQueue(): void {
    this.emitQueue.clear();
    console.log('🗑️ Emit queue cleared');
  }

  // ==================== CLIENT METHODS ====================

  /**
   * Get available trainers (client only)
   */
  public async getTrainers(payload: GetTrainersPayload = {}) {
    return this.emitAsync(CHAT_CLIENT_EMIT_EVENTS.GET_TRAINERS, payload);
  }

  /**
   * Send message to trainer (client only)
   */
  public async sendMessageToTrainer(payload: SendMessagePayload) {
    return this.emitAsync(CHAT_CLIENT_EMIT_EVENTS.SEND_MESSAGE, payload);
  }

  /**
   * Get chat history with trainer (client only)
   */
  public async getTrainerHistory(trainerId: string, options: Partial<GetHistoryPayload> = {}) {
    return this.emitAsync(CHAT_CLIENT_EMIT_EVENTS.GET_HISTORY, {
      trainer_id: trainerId,
      ...options,
    });
  }

  /**
   * Get client's chat list
   */
  public async getClientChatList(payload: GetChatListPayload = {}) {
    return this.emitAsync(CHAT_CLIENT_EMIT_EVENTS.GET_CHAT_LIST, payload);
  }

  /**
   * Get online trainers (client only)
   */
  public async getOnlineTrainers() {
    return this.emitAsync(CHAT_CLIENT_EMIT_EVENTS.GET_ONLINE_TRAINERS, {});
  }

  /**
   * Mark messages as read (client)
   */
  public async markReadClient(payload: MarkReadPayload) {
    return this.emitAsync(CHAT_CLIENT_EMIT_EVENTS.MARK_READ, payload);
  }

  /**
   * Send typing indicator (client)
   */
  public sendTypingClient(payload: TypingEmitPayload): void {
    const socket = socketService.getSocket();
    if (socket?.connected) {
      socket.emit(CHAT_CLIENT_EMIT_EVENTS.TYPING, payload);
    }
  }

  // ==================== TRAINER METHODS ====================

  /**
   * Get available clients (trainer only)
   */
  public async getClients(payload: GetTrainersPayload = {}) {
    return this.emitAsync(CHAT_TRAINER_EMIT_EVENTS.GET_CLIENTS, payload);
  }

  /**
   * Send message to client (trainer only)
   */
  public async sendMessageToClient(payload: SendMessagePayload) {
    return this.emitAsync(CHAT_TRAINER_EMIT_EVENTS.SEND_MESSAGE, payload);
  }

  /**
   * Get chat history with client (trainer only)
   */
  public async getClientHistory(clientId: string, options: Partial<GetHistoryPayload> = {}) {
    return this.emitAsync(CHAT_TRAINER_EMIT_EVENTS.GET_HISTORY, {
      client_id: clientId,
      ...options,
    });
  }

  /**
   * Get trainer's chat list
   */
  public async getTrainerChatList(payload: GetChatListPayload = {}) {
    return this.emitAsync(CHAT_TRAINER_EMIT_EVENTS.GET_CHAT_LIST, payload);
  }

  /**
   * Get online clients (trainer only)
   */
  public async getOnlineClients() {
    return this.emitAsync(CHAT_TRAINER_EMIT_EVENTS.GET_ONLINE_CLIENTS, {});
  }

  /**
   * Get all users (admin/manager only)
   */
  public async getAllUsers(payload: GetTrainersPayload = {}) {
    return this.emitAsync(CHAT_TRAINER_EMIT_EVENTS.GET_ALL_USERS, payload);
  }

  /**
   * Mark messages as read (trainer)
   */
  public async markReadTrainer(payload: MarkReadPayload) {
    return this.emitAsync(CHAT_TRAINER_EMIT_EVENTS.MARK_READ, payload);
  }

  /**
   * Send typing indicator (trainer)
   */
  public sendTypingTrainer(payload: TypingEmitPayload): void {
    const socket = socketService.getSocket();
    if (socket?.connected) {
      socket.emit(CHAT_TRAINER_EMIT_EVENTS.TYPING, payload);
    }
  }

  // ==================== AUTO-ROLE METHODS ====================

  /**
   * Send message (auto-detects role)
   */
  public async sendMessage(payload: SendMessagePayload) {
    if (this.isTrainerLevel()) {
      return this.sendMessageToClient(payload);
    } else {
      return this.sendMessageToTrainer(payload);
    }
  }

  /**
   * Get chat list (auto-detects role)
   */
  public async getChatList(payload: GetChatListPayload = {}) {
    if (this.isTrainerLevel()) {
      return this.getTrainerChatList(payload);
    } else {
      return this.getClientChatList(payload);
    }
  }

  /**
   * Get contacts (auto-detects role)
   */
  public async getContacts(payload: GetTrainersPayload = {}) {
    if (this.isTrainerLevel()) {
      return this.getClients(payload);
    } else {
      return this.getTrainers(payload);
    }
  }

  /**
   * Mark as read (auto-detects role)
   */
  public async markRead(payload: MarkReadPayload) {
    if (this.isTrainerLevel()) {
      return this.markReadTrainer(payload);
    } else {
      return this.markReadClient(payload);
    }
  }

  /**
   * Send typing (auto-detects role)
   */
  public sendTyping(payload: TypingEmitPayload): void {
    if (this.isTrainerLevel()) {
      this.sendTypingTrainer(payload);
    } else {
      this.sendTypingClient(payload);
    }
  }

  // ==================== GROUP METHODS ====================

  /**
   * Get group list
   */
  public async getGroups() {
    return this.emitAsync(CHAT_GROUP_EMIT_EVENTS.GET_LIST, {});
  }

  /**
   * Send group message
   */
  public async sendGroupMessage(payload: SendGroupMessagePayload) {
    return this.emitAsync(CHAT_GROUP_EMIT_EVENTS.SEND_MESSAGE, payload);
  }

  /**
   * Get group chat history
   */
  public async getGroupHistory(groupId: string, options: Partial<GetHistoryPayload> = {}) {
    return this.emitAsync(CHAT_GROUP_EMIT_EVENTS.GET_HISTORY, {
      group_id: groupId,
      ...options,
    });
  }

  /**
   * Get group info
   */
  public async getGroupInfo(payload: GroupInfoPayload) {
    return this.emitAsync(CHAT_GROUP_EMIT_EVENTS.GET_INFO, payload);
  }

  /**
   * Get group members
   */
  public async getGroupMembers(payload: GroupInfoPayload) {
    return this.emitAsync(CHAT_GROUP_EMIT_EVENTS.GET_MEMBERS, payload);
  }

  /**
   * Send group typing indicator
   */
  public sendGroupTyping(payload: TypingEmitPayload): void {
    const socket = socketService.getSocket();
    if (socket?.connected) {
      socket.emit(CHAT_GROUP_EMIT_EVENTS.TYPING, payload);
    }
  }

  // ==================== GROUP MANAGEMENT (TRAINER ONLY) ====================

  /**
   * Create group (trainer only)
   */
  public async createGroup(payload: CreateGroupPayload) {
    if (!this.isTrainerLevel()) {
      throw new Error('Only trainers can create groups');
    }
    return this.emitAsync(CHAT_MANAGE_EMIT_EVENTS.CREATE_GROUP, payload);
  }

  /**
   * Edit group (trainer only)
   */
  public async editGroup(payload: EditGroupPayload) {
    if (!this.isTrainerLevel()) {
      throw new Error('Only trainers can edit groups');
    }
    return this.emitAsync(CHAT_MANAGE_EMIT_EVENTS.EDIT_GROUP, payload);
  }

  /**
   * Delete group (trainer only)
   */
  public async deleteGroup(payload: DeleteGroupPayload) {
    if (!this.isTrainerLevel()) {
      throw new Error('Only trainers can delete groups');
    }
    return this.emitAsync(CHAT_MANAGE_EMIT_EVENTS.DELETE_GROUP, payload);
  }

  /**
   * Add member to group (trainer only)
   */
  public async addMember(payload: AddMemberPayload) {
    if (!this.isTrainerLevel()) {
      throw new Error('Only trainers can add members');
    }
    return this.emitAsync(CHAT_MANAGE_EMIT_EVENTS.ADD_MEMBER, payload);
  }

  /**
   * Remove member from group (trainer only)
   */
  public async removeMember(payload: RemoveMemberPayload) {
    if (!this.isTrainerLevel()) {
      throw new Error('Only trainers can remove members');
    }
    return this.emitAsync(CHAT_MANAGE_EMIT_EVENTS.REMOVE_MEMBER, payload);
  }

  /**
   * Update member role (trainer only)
   */
  public async updateMemberRole(payload: UpdateRolePayload) {
    if (!this.isTrainerLevel()) {
      throw new Error('Only trainers can update roles');
    }
    return this.emitAsync(CHAT_MANAGE_EMIT_EVENTS.UPDATE_ROLE, payload);
  }

  // ==================== SEARCH ====================

  /**
   * Search messages
   */
  public async searchMessages(payload: SearchMessagesPayload) {
    return this.emitAsync(CHAT_SEARCH_EMIT_EVENTS.MESSAGES, payload);
  }

  // ==================== ROOM MANAGEMENT ====================

  /**
   * Join room manually
   */
  public async joinRoom(room: string) {
    return this.emitAsync(CHAT_ROOM_EMIT_EVENTS.JOIN_ROOM, { room });
  }

  /**
   * Leave room manually
   */
  public async leaveRoom(room: string) {
    return this.emitAsync(CHAT_ROOM_EMIT_EVENTS.LEAVE_ROOM, { room });
  }

  /**
   * Test room membership
   */
  public async testRoomMembership(groupId: string) {
    return this.emitAsync(CHAT_ROOM_EMIT_EVENTS.TEST_MEMBERSHIP, { groupId });
  }

  /**
   * Sync group membership
   */
  public async syncGroupMembership() {
    return this.emitAsync(CHAT_ROOM_EMIT_EVENTS.SYNC_MEMBERSHIP, {});
  }
}

// Export singleton instance
export const chatEmitters = new ChatSocketEmitters();

