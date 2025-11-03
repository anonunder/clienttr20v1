import { io, Socket } from 'socket.io-client';
import { env } from '../../config/env';
import type { ServerToClientEvents, ClientToServerEvents } from './socket-events';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;

export function getSocket() {
  if (socket) return socket;
  socket = io(env.socketUrl, {
    transports: ['websocket'],
    autoConnect: false,
  });
  return socket;
}

export function connectSocket(token?: string) {
  const s = getSocket();
  if (s.connected) return s;
  s.auth = token ? { token } : undefined;
  s.connect();
  return s;
}

export function disconnectSocket() {
  socket?.disconnect();
}

