import { socketService } from '@/socket/socket-service';
import { DASHBOARD_EMIT_EVENTS } from './events';
import {
  JoinDashboardPayload,
  MarkExerciseCompletePayload,
  MarkGoalCompletePayload,
  SyncDataPayload,
  SocketEmitQueueItem,
} from './types';

/**
 * Dashboard Socket Emitters
 * Handles all outgoing socket events with queue management
 */

class DashboardSocketEmitters {
  private emitQueue: Map<string, SocketEmitQueueItem> = new Map();
  private processingQueue: boolean = false;

  /**
   * Generate unique ID for emit queue items
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add emit to queue (stored dynamically)
   */
  private addToQueue(event: string, payload: any, maxRetries: number = 3): string {
    const id = this.generateId();
    const queueItem: SocketEmitQueueItem = {
      event,
      payload,
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
        // Emit the event
        socket.emit(item.event, item.payload, (response: any) => {
          if (response?.success) {
            console.log(`✅ Emit successful: ${item.event}`, { id });
            this.emitQueue.delete(id);
          } else {
            console.warn(`⚠️ Emit failed: ${item.event}`, { id, response });
            this.retryEmit(id);
          }
        });

        // If no acknowledgment callback, remove from queue immediately
        this.emitQueue.delete(id);
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

  // ==================== EMIT METHODS ====================

  /**
   * Join dashboard room
   */
  public joinDashboard(userId: string): string {
    const payload: JoinDashboardPayload = {
      userId,
      timestamp: new Date().toISOString(),
    };

    return this.addToQueue(DASHBOARD_EMIT_EVENTS.JOIN_DASHBOARD, payload);
  }

  /**
   * Leave dashboard room
   */
  public leaveDashboard(userId: string): string {
    return this.addToQueue(DASHBOARD_EMIT_EVENTS.LEAVE_DASHBOARD, { userId });
  }

  /**
   * Request stats update
   */
  public requestStats(userId: string): string {
    return this.addToQueue(DASHBOARD_EMIT_EVENTS.REQUEST_STATS, { userId });
  }

  /**
   * Request exercises update
   */
  public requestExercises(userId: string): string {
    return this.addToQueue(DASHBOARD_EMIT_EVENTS.REQUEST_EXERCISES, { userId });
  }

  /**
   * Request meals update
   */
  public requestMeals(userId: string): string {
    return this.addToQueue(DASHBOARD_EMIT_EVENTS.REQUEST_MEALS, { userId });
  }

  /**
   * Request goals update
   */
  public requestGoals(userId: string): string {
    return this.addToQueue(DASHBOARD_EMIT_EVENTS.REQUEST_GOALS, { userId });
  }

  /**
   * Mark exercise as complete
   */
  public markExerciseComplete(data: MarkExerciseCompletePayload): string {
    return this.addToQueue(DASHBOARD_EMIT_EVENTS.MARK_EXERCISE_COMPLETE, data);
  }

  /**
   * Mark goal as complete
   */
  public markGoalComplete(data: MarkGoalCompletePayload): string {
    return this.addToQueue(DASHBOARD_EMIT_EVENTS.MARK_GOAL_COMPLETE, data);
  }

  /**
   * Sync dashboard data
   */
  public syncData(data: SyncDataPayload): string {
    return this.addToQueue(DASHBOARD_EMIT_EVENTS.SYNC_DATA, data);
  }
}

// Export singleton instance
export const dashboardEmitters = new DashboardSocketEmitters();

