import React from 'react';
import { MinimizedCallFloat } from './MinimizedCallFloat';
import { Contact } from './types';

interface GlobalCallFloatProps {
  isCallActive: boolean;
  isVideoActive: boolean;
  isCallMinimized: boolean;
  contact: Contact | null;
  callDuration: string;
  onMaximize: () => void;
  onEnd: () => void;
}

export function GlobalCallFloat({
  isCallActive,
  isVideoActive,
  isCallMinimized,
  contact,
  callDuration,
  onMaximize,
  onEnd,
}: GlobalCallFloatProps) {
  if (!isCallMinimized || (!isCallActive && !isVideoActive) || !contact) {
    return null;
  }

  return (
    <MinimizedCallFloat
      isVideo={isVideoActive}
      contact={contact}
      callDuration={callDuration}
      onMaximize={onMaximize}
      onEnd={onEnd}
    />
  );
}

