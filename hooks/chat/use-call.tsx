import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Contact, CallContextType } from '@/components/chat/types';

const CallContext = createContext<CallContextType | undefined>(undefined);

interface CallProviderProps {
  children: ReactNode;
}

export function CallProvider({ children }: CallProviderProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  const value: CallContextType = {
    isCallActive,
    isVideoActive,
    isCallMinimized,
    contact,
    callDuration,
    setIsCallActive,
    setIsVideoActive,
    setIsCallMinimized,
    setContact,
    setCallDuration,
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
}

export function useCall(): CallContextType {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}

export { CallContext };

