/**
 * Chat Feature Types
 * Shared type definitions for chat components
 */

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  online: boolean;
  lastMessage?: string;
  unread?: number;
}

export interface Group {
  id: string;
  name: string;
  avatar?: string;
  memberCount: number;
  lastMessage?: string;
  unread?: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: string;
}

export interface CallContextType {
  isCallActive: boolean;
  isVideoActive: boolean;
  isCallMinimized: boolean;
  contact: Contact | null;
  callDuration: number;
  setIsCallActive: (active: boolean) => void;
  setIsVideoActive: (active: boolean) => void;
  setIsCallMinimized: (minimized: boolean) => void;
  setContact: (contact: Contact | null) => void;
  setCallDuration: (duration: number | ((prev: number) => number)) => void;
}

