import { MinimizedCallFloat } from "@/components/chat/MinimizedCallFloat";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
}

interface GlobalCallFloatProps {
  isCallActive: boolean;
  isVideoActive: boolean;
  isCallMinimized: boolean;
  contact: Contact | null;
  callDuration: string;
  onMaximize: () => void;
  onEnd: () => void;
}

export const GlobalCallFloat = ({
  isCallActive,
  isVideoActive,
  isCallMinimized,
  contact,
  callDuration,
  onMaximize,
  onEnd,
}: GlobalCallFloatProps) => {
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
};
