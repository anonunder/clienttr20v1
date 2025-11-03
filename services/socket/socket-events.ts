export interface ServerToClientEvents {
  'session:welcome': (payload: { message: string }) => void;
  'chat:message': (msg: {
    id: string;
    text: string;
    userId: string;
    userName?: string;
    timestamp: string;
  }) => void;
  'progress:update': (p: { userId: string; streak: number; totalWorkouts: number }) => void;
  'workout:started': (payload: { workoutId: string; userId: string }) => void;
  'workout:completed': (payload: { workoutId: string; userId: string }) => void;
}

export interface ClientToServerEvents {
  'chat:send': (msg: { text: string; roomId?: string }) => void;
  'presence:ping': () => void;
  'workout:start': (payload: { workoutId: string }) => void;
  'workout:complete': (payload: { workoutId: string }) => void;
}

