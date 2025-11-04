import { socketService } from '@/socket/socket-service';

/**
 * Socket Connection Manager
 * Centralized logic for checking socket readiness
 */

export interface SocketConnectionStatus {
  isReady: boolean;
  isConnected: boolean;
  hasSocket: boolean;
  hasUser: boolean;
  userId: string | null;
  reason?: string;
}

class SocketConnectionManager {
  private userId: string | null = null;

  /**
   * Set current user ID
   */
  public setUserId(userId: string | null): void {
    this.userId = userId;
    console.log('👤 Socket user ID set:', userId);
  }

  /**
   * Get current user ID
   */
  public getUserId(): string | null {
    return this.userId;
  }

  /**
   * Check if socket is ready for operations
   */
  public isReady(): SocketConnectionStatus {
    const socket = socketService.getSocket();
    const isConnected = socket?.connected || false;
    const hasSocket = socket !== null;
    const hasUser = this.userId !== null;
    const isReady = isConnected && hasSocket && hasUser;

    let reason: string | undefined;
    if (!hasSocket) reason = 'Socket instance not available';
    else if (!isConnected) reason = 'Socket not connected';
    else if (!hasUser) reason = 'User not authenticated';

    return {
      isReady,
      isConnected,
      hasSocket,
      hasUser,
      userId: this.userId,
      reason,
    };
  }

  /**
   * Wait for socket to be ready (with timeout)
   */
  public async waitForReady(timeoutMs: number = 5000): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      if (this.isReady().isReady) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.warn('⏱️ Socket ready timeout after', timeoutMs, 'ms');
    return false;
  }

  /**
   * Clear user context (on logout)
   */
  public clear(): void {
    this.userId = null;
    console.log('🧹 Socket connection manager cleared');
  }
}

// Export singleton instance
export const socketConnectionManager = new SocketConnectionManager();

