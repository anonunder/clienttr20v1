import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect(url?: string, token?: string, companyId?: string): Promise<Socket> {
    // If socket exists and is connected with the same token and company, return it
    if (
      this.socket?.connected && 
      this.socket.auth?.token === token &&
      this.socket.auth?.companyId === companyId
    ) {
      return this.socket;
    }

    // If socket exists but token/company is different or missing, disconnect and recreate
    if (this.socket) {
      this.disconnect();
    }

    if (!token) {
      throw new Error('Token is required for socket connection');
    }

    const socketUrl = url || process.env.EXPO_PUBLIC_SOCKET_URL || 'ws://localhost:3000';

    // Include company_id in auth if available
    const authPayload: { token: string; company_id?: string } = { token };
    if (companyId) {
      authPayload.company_id = companyId;
      console.log('🏢 Socket connecting with company:', companyId);
    }

    this.socket = io(socketUrl, {
      auth: authPayload,
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      console.log('🏢 Company context:', companyId);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnect attempts reached');
        this.disconnect();
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();

